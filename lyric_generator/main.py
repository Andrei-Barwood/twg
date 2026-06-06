#!/usr/bin/env python3
"""
Lyric Video Generator 4K
Sincroniza letras automáticamente usando Whisper y exporta un lyric video usando FFmpeg.
"""

import os
import sys
import shutil
import argparse
import subprocess
from pathlib import Path
import pysubs2
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn

console = Console()

def get_ffmpeg_binary():
    try:
        # Import static_ffmpeg to ensure we have a full build of ffmpeg (with libass)
        import static_ffmpeg
        static_ffmpeg.add_paths()
        return shutil.which('ffmpeg')
    except ImportError:
        return shutil.which('ffmpeg')

def check_ffmpeg():
    if not get_ffmpeg_binary():
        console.print("[red]Error: ffmpeg no está instalado o no está en el PATH.[/red]")
        sys.exit(1)

def transcribe_audio(audio_path, lyrics_path=None, model_name="small"):
    import whisper
    console.print(f"[cyan]Cargando modelo Whisper '{model_name}'...[/cyan]")
    model = whisper.load_model(model_name)
    
    prompt = ""
    if lyrics_path and os.path.exists(lyrics_path):
        with open(lyrics_path, 'r', encoding='utf-8') as f:
            prompt = f.read().replace('\n', ' ')
            console.print("[cyan]Usando archivo de letras como prompt inicial para mejorar la precisión.[/cyan]")

    console.print("[yellow]Transcribiendo audio y extrayendo marcas de tiempo...[/yellow]")
    result = model.transcribe(str(audio_path), initial_prompt=prompt, word_timestamps=True, language='es')
    return result

def create_ass_subtitles(whisper_result, output_ass):
    console.print("[cyan]Generando archivo de subtítulos estilizado (.ass)...[/cyan]")
    subs = pysubs2.SSAFile()
    
    # Crear un estilo elegante 4K
    style = pysubs2.SSAStyle()
    style.fontname = "Helvetica"
    style.fontsize = 90
    style.primarycolor = pysubs2.Color(255, 255, 255, 0)
    style.outlinecolor = pysubs2.Color(0, 0, 0, 0)
    style.backcolor = pysubs2.Color(0, 0, 0, 128)
    style.outline = 4.0
    style.shadow = 2.0
    style.alignment = 2  # Centrado abajo
    style.marginv = 150
    subs.styles["Default"] = style

    for segment in whisper_result["segments"]:
        start_ms = int(segment["start"] * 1000)
        end_ms = int(segment["end"] * 1000)
        text = segment["text"].strip()
        
        event = pysubs2.SSAEvent(start=start_ms, end=end_ms, text=text)
        subs.events.append(event)
        
    subs.save(str(output_ass))
    console.print(f"[green]Subtítulos guardados en {output_ass}[/green]")

def render_video(audio_path, bg_path, ass_path, output_path):
    bg_path_str = str(bg_path)
    is_image = bg_path_str.lower().endswith(('.png', '.jpg', '.jpeg'))
    
    console.print("[yellow]Renderizando video en 4K con FFmpeg (esto puede tardar)...[/yellow]")
    
    # Crear un archivo temporal sin espacios en la ruta actual para evitar problemas de escape en FFmpeg
    temp_ass = "temp_subs_render.ass"
    shutil.copy(str(ass_path), temp_ass)
    
    ffmpeg_exe = get_ffmpeg_binary()
    cmd = [ffmpeg_exe, '-y']
    
    if is_image:
        cmd.extend(['-loop', '1', '-framerate', '30', '-i', bg_path_str])
    else:
        cmd.extend(['-stream_loop', '-1', '-i', bg_path_str])
        
    cmd.extend(['-i', str(audio_path)])
    
    # Filtro de video: escalar, pad, formato de pixel y subtítulos
    vf = f"scale=3840:2160:force_original_aspect_ratio=decrease,pad=3840:2160:(ow-iw)/2:(oh-ih)/2,format=yuv420p,subtitles='{temp_ass}'"
    
    cmd.extend([
        '-vf', vf,
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
        '-c:a', 'aac', '-b:a', '320k',
        '-shortest', str(output_path)
    ])
    
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    
    error_log = []
    for line in process.stdout:
        error_log.append(line)
        if "frame=" in line or "time=" in line:
            print(f"\rRenderizando: {line.strip()}", end="")
            
    process.wait()
    print()
    
    # Limpiar archivo temporal
    if os.path.exists(temp_ass):
        os.remove(temp_ass)
        
    if process.returncode == 0:
        console.print(f"[bold green]¡Video renderizado exitosamente en {output_path}![/bold green]")
    else:
        console.print("[bold red]Ocurrió un error al renderizar el video. Log de error:[/bold red]")
        print("".join(error_log[-15:]))

def main():
    parser = argparse.ArgumentParser(description="Generador automático de Lyric Videos 4K")
    parser.add_argument('--audio', required=True, help='Ruta al archivo de audio master')
    parser.add_argument('--bg', required=True, help='Ruta a la imagen o loop de video de fondo')
    parser.add_argument('--lyrics', help='(Opcional) Ruta al archivo txt con las letras para guiar a la IA')
    parser.add_argument('--output', default='output_lyric_video.mp4', help='Ruta del video resultante')
    parser.add_argument('--model', default='small', help='Modelo de Whisper a usar (tiny, base, small, medium)')
    
    args = parser.parse_args()
    
    audio_path = Path(args.audio)
    bg_path = Path(args.bg)
    out_path = Path(args.output)
    ass_path = out_path.with_suffix('.ass')
    
    if not audio_path.exists():
        console.print(f"[red]No se encuentra el audio: {audio_path}[/red]")
        sys.exit(1)
    if not bg_path.exists():
        console.print(f"[red]No se encuentra el fondo: {bg_path}[/red]")
        sys.exit(1)
        
    try:
        check_ffmpeg()
        
        with Progress(SpinnerColumn(), TextColumn("[progress.description]{task.description}"), transient=True) as progress:
            task = progress.add_task("[cyan]Analizando audio...", total=None)
            # Only run whisper if ass file does not already exist
            if not ass_path.exists():
                whisper_result = transcribe_audio(audio_path, args.lyrics, args.model)
                create_ass_subtitles(whisper_result, ass_path)
            else:
                console.print(f"[cyan]Usando subtítulos existentes en {ass_path}[/cyan]")
            progress.update(task, completed=100)
            
        render_video(audio_path, bg_path, ass_path, out_path)
        
    except KeyboardInterrupt:
        console.print("\n[yellow]Proceso cancelado por el usuario.[/yellow]")
    except Exception as e:
        console.print(f"\n[red]Error crítico: {str(e)}[/red]")

if __name__ == '__main__':
    main()
