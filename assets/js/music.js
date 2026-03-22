(function() {
    'use strict';

    const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true });
    const yearOptions = ['2011', '2012', '2013', '2014', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
    const samplePacksCatalogOption = 'sample packs';
    const samplePacksSeriesOption = 'remixes';
    const catalogOptions = ['PHNTM_', 'GRBNNY_', 'PTT', 'MD_', 'TWG_', 'TOPR_', 'GRFF_', 'END_', 'ANN_', 'ALMGM_', 'LL_', 'TWK_', 'ASTR_', samplePacksCatalogOption];
    const seriesOptions = ['Phantoma', 'Gore Bunny', 'Petite', 'Mega Doll', 'The Wooden Groom', 'The Opera', 'Sound Graffiti', 'End of the World', 'Ann', 'Almas Gemelas', 'Liliane', 'The Wooden Kid', 'Astronauta', samplePacksSeriesOption];
    const catalogSeriesPairs = {
        PHNTM_: 'Phantoma',
        GRBNNY_: 'Gore Bunny',
        PTT: 'Petite',
        MD_: 'Mega Doll',
        TWG_: 'The Wooden Groom',
        TOPR_: 'The Opera',
        GRFF_: 'Sound Graffiti',
        END_: 'End of the World',
        ANN_: 'Ann',
        ALMGM_: 'Almas Gemelas',
        LL_: 'Liliane',
        TWK_: 'The Wooden Kid',
        ASTR_: 'Astronauta',
        [samplePacksCatalogOption]: samplePacksSeriesOption
    };
    const seriesCatalogPairs = Object.fromEntries(
        Object.entries(catalogSeriesPairs).map(function(entry) {
            return [entry[1], entry[0]];
        })
    );

    function normalizeCatalogGroup(value) {
        const catalog = String(value || '');
        return catalogOptions.find(function(prefix) {
            return catalog.startsWith(prefix);
        }) || catalog;
    }

    function catalogNumber(value) {
        const match = String(value || '').match(/(\d+)$/);
        return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
    }

    function sortReleases(a, b) {
        const groupA = normalizeCatalogGroup(a.catalog);
        const groupB = normalizeCatalogGroup(b.catalog);
        const groupDiff = catalogOptions.indexOf(groupA) - catalogOptions.indexOf(groupB);

        if (groupDiff !== 0) {
            return groupDiff;
        }

        const numberDiff = catalogNumber(a.catalog) - catalogNumber(b.catalog);
        if (numberDiff !== 0) {
            return numberDiff;
        }

        return collator.compare(a.title, b.title);
    }

    function normalizeType(value) {
        const normalized = String(value || '').trim().toLowerCase();

        if (normalized === 'ep') {
            return 'EP';
        }

        if (normalized === 'album') {
            return 'Album';
        }

        if (normalized === 'sencillo') {
            return 'Sencillo';
        }

        return value || '';
    }

    function isSamplePackRelease(release) {
        return Boolean(release && release.insideSession);
    }

    function matchesCatalogFilter(release, value) {
        if (!value) {
            return true;
        }

        if (value === samplePacksCatalogOption) {
            return isSamplePackRelease(release);
        }

        return release.catalogGroup === value;
    }

    function matchesSeriesFilter(release, value) {
        if (!value) {
            return true;
        }

        if (value === samplePacksSeriesOption) {
            return isSamplePackRelease(release);
        }

        return release.series === value;
    }

    const insideSessionHashPrefix = 'inside-session-';

    function insideSessionHashId(value) {
        return insideSessionHashPrefix + String(value || '');
    }

    function parseInsideSessionHash(hash) {
        const normalized = String(hash || '').replace(/^#/, '');

        if (!normalized.startsWith(insideSessionHashPrefix)) {
            return '';
        }

        return normalized.slice(insideSessionHashPrefix.length);
    }

    function normalizeInsideSession(value) {
        if (!value || typeof value !== 'object') {
            return null;
        }

        const metadata = Array.isArray(value.metadata)
            ? value.metadata
                .filter(function(item) {
                    return item && item.label && item.value;
                })
                .map(function(item) {
                    return {
                        label: String(item.label),
                        value: String(item.value)
                    };
                })
            : [];

        const noteParagraphs = Array.isArray(value.noteParagraphs)
            ? value.noteParagraphs
                .filter(Boolean)
                .map(function(paragraph) {
                    return String(paragraph);
                })
            : [];

        const screenshots = Array.isArray(value.screenshots)
            ? value.screenshots
                .filter(function(image) {
                    return image && image.src;
                })
                .map(function(image) {
                    return {
                        src: String(image.src),
                        alt: String(image.alt || 'Screenshot de Renoise'),
                        caption: String(image.caption || '')
                    };
                })
            : [];

        const embeds = Array.isArray(value.embeds)
            ? value.embeds
                .filter(function(embed) {
                    return embed && embed.embedUrl;
                })
                .map(function(embed) {
                    return {
                        title: String(embed.title || 'Embed'),
                        embedUrl: String(embed.embedUrl),
                        description: String(embed.description || ''),
                        height: String(embed.height || '120px'),
                        allowFullscreen: Boolean(embed.allowFullscreen)
                    };
                })
            : [];

        if (!embeds.length && value.preview && typeof value.preview === 'object' && value.preview.embedUrl) {
            embeds.push({
                title: String(value.preview.title || 'Preview'),
                embedUrl: String(value.preview.embedUrl),
                description: String(value.preview.description || ''),
                height: String(value.preview.height || '120px'),
                allowFullscreen: Boolean(value.preview.allowFullscreen)
            });
        }

        const preset = value.preset && typeof value.preset === 'object'
            ? {
                title: String(value.preset.title || ''),
                instrument: String(value.preset.instrument || ''),
                description: String(value.preset.description || '')
            }
            : null;

        const licenseSource = value.license && typeof value.license === 'object' ? value.license : {};
        const callToActionSource = value.callToAction && typeof value.callToAction === 'object' ? value.callToAction : {};

        return {
            title: String(value.title || 'Inside the Session'),
            summary: String(value.summary || ''),
            statusLabel: String(value.statusLabel || 'Disponible para explorar'),
            metadata: metadata,
            downloadUrl: String(value.downloadUrl || ''),
            downloadLabel: String(value.downloadLabel || 'Descarga directa (ZIP)'),
            downloadNote: String(value.downloadNote || ''),
            embeds: embeds,
            noteTitle: String(value.noteTitle || 'Nota personal'),
            noteParagraphs: noteParagraphs,
            screenshotsTitle: String(value.screenshotsTitle || 'Screenshots de la sesión'),
            screenshots: screenshots,
            preset: preset && (preset.title || preset.instrument || preset.description) ? preset : null,
            license: {
                name: String(licenseSource.name || 'CC BY'),
                url: String(licenseSource.url || ''),
                summary: String(licenseSource.summary || ''),
                manifesto: String(licenseSource.manifesto || '')
            },
            callToAction: {
                title: String(callToActionSource.title || 'Haz algo con estos stems'),
                body: String(callToActionSource.body || ''),
                email: String(callToActionSource.email || ''),
                youtubeUrl: String(callToActionSource.youtubeUrl || ''),
                youtubeLabel: String(callToActionSource.youtubeLabel || '@TheWoodenGroom')
            }
        };
    }

    document.addEventListener('alpine:init', function() {
        Alpine.data('musicDiscography', function() {
            return {
                releases: [],
                currentPage: 1,
                pageSize: 6,
                isSyncingLinkedFilters: false,
                expandedInsideSessionId: '',
                copiedInsideSessionId: '',
                filters: {
                    year: '',
                    catalog: '',
                    series: ''
                },

                init() {
                    const source = Array.isArray(window.musicReleases) ? window.musicReleases : [];

                    this.releases = source
                        .map(function(release) {
                            const catalog = String(release.catalog || '');
                            const catalogGroup = normalizeCatalogGroup(catalog);

                            return {
                                ...release,
                                year: String(release.year || ''),
                                type: normalizeType(release.type),
                                catalog: catalog,
                                catalogGroup: catalogGroup,
                                series: catalogSeriesPairs[catalogGroup] || String(release.series || ''),
                                links: Array.isArray(release.links) ? release.links.filter(function(link) {
                                    return link && link.url;
                                }) : [],
                                insideSession: normalizeInsideSession(release.insideSession)
                            };
                        })
                        .sort(sortReleases);

                    this.$watch('filters.catalog', (value) => {
                        if (this.isSyncingLinkedFilters) {
                            return;
                        }

                        this.currentPage = 1;
                        this.isSyncingLinkedFilters = true;
                        this.filters.series = value ? (catalogSeriesPairs[value] || '') : '';
                        this.isSyncingLinkedFilters = false;
                    });

                    this.$watch('filters.series', (value) => {
                        if (this.isSyncingLinkedFilters) {
                            return;
                        }

                        this.currentPage = 1;
                        this.isSyncingLinkedFilters = true;
                        this.filters.catalog = value ? (seriesCatalogPairs[value] || '') : '';
                        this.isSyncingLinkedFilters = false;
                    });

                    this.$watch('filters.year', () => {
                        this.currentPage = 1;
                    });

                    window.addEventListener('hashchange', () => {
                        this.syncInsideSessionFromHash();
                    });

                    this.$nextTick(() => {
                        this.syncInsideSessionFromHash();
                    });
                },

                get yearOptions() {
                    return yearOptions;
                },

                get catalogOptions() {
                    return catalogOptions;
                },

                get seriesOptions() {
                    return seriesOptions;
                },

                get filteredReleases() {
                    const filters = this.filters;

                    return this.releases.filter(function(release) {
                        const matchesYear = !filters.year || release.year === filters.year;
                        const matchesCatalog = matchesCatalogFilter(release, filters.catalog);
                        const matchesSeries = matchesSeriesFilter(release, filters.series);

                        return matchesYear && matchesCatalog && matchesSeries;
                    });
                },

                get totalPages() {
                    return Math.max(1, Math.ceil(this.filteredReleases.length / this.pageSize));
                },

                get paginatedReleases() {
                    const start = (this.currentPage - 1) * this.pageSize;
                    const end = start + this.pageSize;

                    return this.filteredReleases.slice(start, end);
                },

                get hasActiveFilters() {
                    return Boolean(this.filters.year || this.filters.catalog || this.filters.series);
                },

                get insideSessionCount() {
                    return this.releases.filter(function(release) {
                        return Boolean(release.insideSession);
                    }).length;
                },

                get insideSessionStatusText() {
                    if (this.insideSessionCount === 0) {
                        return 'Primeros sample packs en preparación. Cada release con stems publicados tendrá su botón Explorar stems dentro de la discografía.';
                    }

                    if (this.insideSessionCount === 1) {
                        return 'Ya hay 1 sample pack disponible dentro de la discografía.';
                    }

                    return 'Ya hay ' + this.insideSessionCount + ' sample packs disponibles dentro de la discografía.';
                },

                insideSessionAnchorId(release) {
                    return insideSessionHashId(release.id);
                },

                insideSessionLink(releaseId) {
                    const url = new URL(window.location.href);
                    url.hash = insideSessionHashId(releaseId);
                    return url.toString();
                },

                revealInsideSession(releaseId, options) {
                    const settings = options || {};
                    const releaseIndex = this.filteredReleases.findIndex(function(release) {
                        return release.id === releaseId;
                    });

                    if (releaseIndex === -1) {
                        const releaseExists = this.releases.some(function(release) {
                            return release.id === releaseId;
                        });

                        if (!releaseExists) {
                            return;
                        }

                        if (this.hasActiveFilters) {
                            this.resetFilters();
                            this.$nextTick(() => {
                                this.revealInsideSession(releaseId, settings);
                            });
                        }

                        return;
                    }

                    this.currentPage = Math.floor(releaseIndex / this.pageSize) + 1;
                    this.expandedInsideSessionId = releaseId;

                    this.$nextTick(() => {
                        const target = document.getElementById(insideSessionHashId(releaseId));

                        if (target) {
                            target.scrollIntoView({
                                behavior: settings.behavior || 'smooth',
                                block: 'start'
                            });
                        }
                    });

                    if (!settings.skipHashUpdate) {
                        this.updateInsideSessionHash(releaseId);
                    }
                },

                syncInsideSessionFromHash() {
                    const releaseId = parseInsideSessionHash(window.location.hash);

                    if (!releaseId) {
                        this.expandedInsideSessionId = '';
                        return;
                    }

                    this.revealInsideSession(releaseId, {
                        skipHashUpdate: true,
                        behavior: 'auto'
                    });
                },

                updateInsideSessionHash(releaseId) {
                    const url = new URL(window.location.href);
                    url.hash = insideSessionHashId(releaseId);
                    window.history.replaceState(null, '', url.toString());
                },

                clearInsideSessionHash() {
                    const releaseId = parseInsideSessionHash(window.location.hash);

                    if (!releaseId) {
                        return;
                    }

                    const url = new URL(window.location.href);
                    url.hash = '';
                    window.history.replaceState(null, '', url.toString());
                },

                handleInsideSessionToggle(releaseId, event) {
                    if (event.target.open) {
                        this.expandedInsideSessionId = releaseId;
                        this.updateInsideSessionHash(releaseId);
                        return;
                    }

                    if (this.expandedInsideSessionId === releaseId) {
                        this.expandedInsideSessionId = '';
                        this.clearInsideSessionHash();
                    }
                },

                copyInsideSessionLink(releaseId) {
                    const link = this.insideSessionLink(releaseId);

                    const markCopied = () => {
                        this.copiedInsideSessionId = releaseId;
                        window.setTimeout(() => {
                            if (this.copiedInsideSessionId === releaseId) {
                                this.copiedInsideSessionId = '';
                            }
                        }, 2200);
                    };

                    if (navigator.clipboard && window.isSecureContext) {
                        navigator.clipboard.writeText(link).then(markCopied).catch(() => {
                            const fallback = document.createElement('textarea');
                            fallback.value = link;
                            fallback.setAttribute('readonly', '');
                            fallback.style.position = 'absolute';
                            fallback.style.left = '-9999px';
                            document.body.appendChild(fallback);
                            fallback.select();
                            document.execCommand('copy');
                            document.body.removeChild(fallback);
                            markCopied();
                        });

                        return;
                    }

                    const fallback = document.createElement('textarea');
                    fallback.value = link;
                    fallback.setAttribute('readonly', '');
                    fallback.style.position = 'absolute';
                    fallback.style.left = '-9999px';
                    document.body.appendChild(fallback);
                    fallback.select();
                    document.execCommand('copy');
                    document.body.removeChild(fallback);
                    markCopied();
                },

                goToPage(page) {
                    const nextPage = Math.min(this.totalPages, Math.max(1, page));

                    if (nextPage === this.currentPage) {
                        return;
                    }

                    this.currentPage = nextPage;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },

                resetFilters() {
                    this.currentPage = 1;
                    this.filters.year = '';
                    this.filters.catalog = '';
                    this.filters.series = '';
                }
            };
        });
    });
})();
