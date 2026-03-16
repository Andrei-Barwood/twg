(function() {
    'use strict';

    const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true });
    const yearOptions = ['2011', '2012', '2013', '2014', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
    const catalogOptions = ['PHNTM_', 'GRBNNY_', 'PTT', 'MD_', 'TWG_', 'TOPR_', 'GRFF_', 'END_', 'ANN_', 'ALMGM_', 'LL_', 'TWK_', 'ASTR_'];
    const seriesOptions = ['Phantoma', 'Gore Bunny', 'Petite', 'Mega Doll', 'The Wooden Groom', 'The Opera', 'Sound Graffiti', 'End of the World', 'Ann', 'Almas Gemelas', 'Liliane', 'The Wooden Kid', 'Astronauta'];
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
        ASTR_: 'Astronauta'
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

    document.addEventListener('alpine:init', function() {
        Alpine.data('musicDiscography', function() {
            return {
                releases: [],
                currentPage: 1,
                pageSize: 6,
                isSyncingLinkedFilters: false,
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
                                }) : []
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
                        const matchesCatalog = !filters.catalog || release.catalogGroup === filters.catalog;
                        const matchesSeries = !filters.series || release.series === filters.series;

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
