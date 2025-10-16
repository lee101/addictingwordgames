(function (global) {
    'use strict';

    var DEFAULT_STATE = {
        query: '',
        tags: [],
        source: '',
        page: 1,
        pageSize: 12
    };

    function cloneArray(value) {
        if (!value) {
            return [];
        }
        return Array.isArray(value) ? value.slice() : [value];
    }

    function normaliseTag(tag) {
        return (tag || '').toString().trim();
    }

    function dedupeTags(tags) {
        var seen = {};
        var list = [];
        for (var i = 0; i < tags.length; i += 1) {
            var tag = normaliseTag(tags[i]);
            if (!tag) {
                continue;
            }
            if (!seen[tag.toLowerCase()]) {
                seen[tag.toLowerCase()] = true;
                list.push(tag);
            }
        }
        return list;
    }

    function buildSearchParams(state) {
        var params = [];
        if (state.query) {
            params.push('q=' + encodeURIComponent(state.query));
        }
        var tags = dedupeTags(cloneArray(state.tags));
        if (tags.length) {
            params.push('tags=' + encodeURIComponent(tags.join(',')));
        }
        if (state.source) {
            params.push('source=' + encodeURIComponent(state.source));
        }
        var page = state.page || 1;
        params.push('page=' + encodeURIComponent(page));
        return params.join('&');
    }

    function mergeFilters(base, patch) {
        var next = {
            query: base.query,
            source: base.source,
            tags: cloneArray(base.tags),
            page: base.page,
            pageSize: base.pageSize
        };
        if (typeof patch.query === 'string') {
            next.query = patch.query;
        }
        if (typeof patch.source === 'string') {
            next.source = patch.source;
        }
        if (Array.isArray(patch.tags)) {
            next.tags = cloneArray(patch.tags);
        }
        if (typeof patch.page === 'number') {
            next.page = patch.page;
        }
        if (typeof patch.pageSize === 'number') {
            next.pageSize = patch.pageSize;
        }
        next.tags = dedupeTags(next.tags);
        if (next.page < 1) {
            next.page = 1;
        }
        return next;
    }

    function createQueryState(initial) {
        var state = mergeFilters(DEFAULT_STATE, initial || {});
        return state;
    }

    function FlashLibraryUI(root, bootstrap) {
        this.root = root;
        this.bootstrap = bootstrap || {};
        this.state = createQueryState((this.bootstrap && this.bootstrap.filters) || {});
        this.availableTags = cloneArray((this.bootstrap && this.bootstrap.availableTags) || []);
        this.availableSources = cloneArray((this.bootstrap && this.bootstrap.availableSources) || []);
        this.results = cloneArray((this.bootstrap && this.bootstrap.results) || []);
        this.pagination = (this.bootstrap && this.bootstrap.pagination) || {
            page: 1,
            pages: 1,
            total: this.results.length,
            page_size: this.state.pageSize
        };
        this.formEl = null;
        this.searchInput = null;
        this.sourceSelect = null;
        this.tagContainer = null;
        this.resultsContainer = null;
        this.paginationEl = null;
        this.countEl = null;
        this.clearButton = null;
        this.loading = false;
        this.abortController = null;
    }

    FlashLibraryUI.prototype.init = function () {
        if (!this.root || typeof document === 'undefined') {
            return;
        }
        this.formEl = document.getElementById('flash-search-form');
        this.searchInput = document.getElementById('flash-search-input');
        this.sourceSelect = document.getElementById('flash-source-select');
        this.tagContainer = document.getElementById('flash-tag-filter');
        this.resultsContainer = document.getElementById('flash-results');
        this.paginationEl = document.getElementById('flash-pagination');
        this.countEl = document.getElementById('flash-result-count');
        this.clearButton = document.getElementById('flash-clear-button');

        this.syncFilterUi();
        this.renderResults(this.results, this.pagination);

        this.bindEvents();
    };

    FlashLibraryUI.prototype.bindEvents = function () {
        var self = this;
        if (!this.formEl) {
            return;
        }
        this.formEl.addEventListener('submit', function (event) {
            event.preventDefault();
            self.onFormSubmit();
        });
        if (this.tagContainer) {
            this.tagContainer.addEventListener('change', function (event) {
                if (event.target && event.target.type === 'checkbox') {
                    self.onTagChange();
                }
            });
        }
        if (this.sourceSelect) {
            this.sourceSelect.addEventListener('change', function () {
                self.state.page = 1;
                self.fetchAndRender();
            });
        }
        if (this.clearButton) {
            this.clearButton.addEventListener('click', function () {
                self.resetFilters();
            });
        }
    };

    FlashLibraryUI.prototype.onFormSubmit = function () {
        if (this.searchInput) {
            this.state.query = this.searchInput.value.trim();
        }
        this.state.page = 1;
        this.fetchAndRender();
    };

    FlashLibraryUI.prototype.onTagChange = function () {
        if (!this.tagContainer) {
            return;
        }
        var checkboxes = this.tagContainer.querySelectorAll('input[type="checkbox"]');
        var tags = [];
        for (var i = 0; i < checkboxes.length; i += 1) {
            if (checkboxes[i].checked) {
                tags.push(checkboxes[i].value);
            }
        }
        this.state.tags = dedupeTags(tags);
        this.state.page = 1;
        this.fetchAndRender();
    };

    FlashLibraryUI.prototype.resetFilters = function () {
        this.state = createQueryState();
        this.syncFilterUi();
        this.fetchAndRender();
    };

    FlashLibraryUI.prototype.syncFilterUi = function () {
        if (this.searchInput) {
            this.searchInput.value = this.state.query || '';
        }
        if (this.sourceSelect) {
            this.sourceSelect.value = this.state.source || '';
        }
        if (this.tagContainer) {
            var checkboxes = this.tagContainer.querySelectorAll('input[type="checkbox"]');
            var selected = {};
            for (var i = 0; i < this.state.tags.length; i += 1) {
                selected[this.state.tags[i]] = true;
            }
            for (var j = 0; j < checkboxes.length; j += 1) {
                checkboxes[j].checked = !!selected[checkboxes[j].value];
            }
        }
    };

    FlashLibraryUI.prototype.setLoading = function (loading) {
        this.loading = loading;
        if (!this.resultsContainer) {
            return;
        }
        if (loading) {
            this.resultsContainer.setAttribute('aria-busy', 'true');
        } else {
            this.resultsContainer.removeAttribute('aria-busy');
        }
    };

    FlashLibraryUI.prototype.fetchAndRender = function () {
        var self = this;
        if (typeof fetch === 'undefined') {
            return;
        }
        if (this.abortController && typeof this.abortController.abort === 'function') {
            this.abortController.abort();
        }
        if (typeof AbortController !== 'undefined') {
            this.abortController = new AbortController();
        }
        this.setLoading(true);
        var query = buildSearchParams(this.state);
        var url = '/api/flash-library';
        if (query) {
            url += '?' + query;
        }
        var fetchOptions = {};
        if (this.abortController) {
            fetchOptions.signal = this.abortController.signal;
        }
        fetch(url, fetchOptions)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Failed to fetch results');
                }
                return response.json();
            })
            .then(function (payload) {
                self.handleResponse(payload);
            })
            .catch(function (error) {
                if (error && error.name === 'AbortError') {
                    return;
                }
                self.renderError();
            })
            .finally(function () {
                self.setLoading(false);
            });
    };

    FlashLibraryUI.prototype.handleResponse = function (payload) {
        if (!payload) {
            return;
        }
        this.state = createQueryState(payload.filters || {});
        this.pagination = payload.pagination || { page: 1, pages: 1, total: 0, page_size: this.state.pageSize };
        this.results = cloneArray(payload.results || []);
        this.syncFilterUi();
        this.renderResults(this.results, this.pagination);
    };

    FlashLibraryUI.prototype.renderError = function () {
        if (!this.resultsContainer) {
            return;
        }
        this.resultsContainer.innerHTML = '<div class="flash-library__empty">Unable to load games right now. Please try again shortly.</div>';
        if (this.countEl) {
            this.countEl.textContent = '0 games found';
        }
        if (this.paginationEl) {
            this.paginationEl.innerHTML = '';
        }
    };

    FlashLibraryUI.prototype.renderResults = function (results, pagination) {
        if (!this.resultsContainer) {
            return;
        }
        var container = this.resultsContainer;
        container.innerHTML = '';

        if (!results || !results.length) {
            var emptyState = document.createElement('div');
            emptyState.className = 'flash-library__empty';
            emptyState.textContent = 'No games match your filters yet. Try a different search or remove a filter.';
            container.appendChild(emptyState);
        } else {
            for (var i = 0; i < results.length; i += 1) {
                container.appendChild(this.createCard(results[i]));
            }
        }

        if (this.countEl) {
            var total = pagination && typeof pagination.total === 'number' ? pagination.total : results.length;
            this.countEl.textContent = total === 1 ? '1 game found' : total + ' games found';
        }
        this.renderPagination(pagination);
    };

    FlashLibraryUI.prototype.createCard = function (game) {
        var article = document.createElement('article');
        article.className = 'flash-card';

        var link = document.createElement('a');
        link.className = 'flash-card__link';
        link.href = game.play_url || ('/flash-library/play/' + game.id);

        var thumb = document.createElement('div');
        thumb.className = 'flash-card__thumb';
        var img = document.createElement('img');
        var thumbSrc = game.thumbnail || '/static/img/flash-placeholder.svg';
        img.src = thumbSrc;
        img.alt = (game.title || '') + ' thumbnail';
        img.loading = 'lazy';
        thumb.appendChild(img);

        var body = document.createElement('div');
        body.className = 'flash-card__body';

        var title = document.createElement('h3');
        title.className = 'flash-card__title';
        title.textContent = game.title || 'Untitled game';

        var desc = document.createElement('p');
        desc.className = 'flash-card__desc';
        desc.textContent = game.short_description || '';

        var meta = document.createElement('div');
        meta.className = 'flash-card__meta';

        var source = document.createElement('span');
        source.className = 'flash-card__source';
        source.textContent = game.source || 'Unknown source';

        var tags = document.createElement('ul');
        tags.className = 'flash-card__tags';
        var tagList = cloneArray(game.tags || []);
        for (var i = 0; i < tagList.length; i += 1) {
            var tagItem = document.createElement('li');
            tagItem.className = 'flash-card__tag';
            tagItem.textContent = tagList[i].replace(/-/g, ' ');
            tags.appendChild(tagItem);
        }

        meta.appendChild(source);
        meta.appendChild(tags);

        body.appendChild(title);
        body.appendChild(desc);
        body.appendChild(meta);

        link.appendChild(thumb);
        link.appendChild(body);

        article.appendChild(link);
        return article;
    };

    FlashLibraryUI.prototype.renderPagination = function (pagination) {
        if (!this.paginationEl) {
            return;
        }
        var container = this.paginationEl;
        container.innerHTML = '';

        var pages = pagination && pagination.pages ? pagination.pages : 1;
        var current = pagination && pagination.page ? pagination.page : 1;
        if (pages <= 1) {
            return;
        }
        container.appendChild(this.createPaginationButton('Prev', current - 1, current === 1));

        var windowSize = 5;
        var start = Math.max(1, current - 2);
        var end = Math.min(pages, start + windowSize - 1);
        if (end - start < windowSize - 1) {
            start = Math.max(1, end - windowSize + 1);
        }
        for (var page = start; page <= end; page += 1) {
            container.appendChild(this.createPaginationButton(page, page, page === current));
        }

        container.appendChild(this.createPaginationButton('Next', current + 1, current === pages));
    };

    FlashLibraryUI.prototype.createPaginationButton = function (label, page, disabled) {
        var self = this;
        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        button.disabled = disabled || (typeof page === 'number' && page < 1);
        if (typeof label === 'number') {
            button.className = 'flash-library__pagination-button';
            if (disabled) {
                button.className += ' flash-library__pagination-button--active';
            }
        } else {
            button.className = 'flash-library__pagination-button';
        }
        if (!button.disabled) {
            button.addEventListener('click', function () {
                if (typeof page === 'number') {
                    self.state.page = page;
                    if (self.state.page < 1) {
                        self.state.page = 1;
                    }
                    self.fetchAndRender();
                }
            });
        }
        return button;
    };

    function bootstrapUI() {
        if (typeof document === 'undefined') {
            return;
        }
        var root = document.getElementById('flash-library-root');
        if (!root) {
            return;
        }
        var bootstrap = global.flashLibraryBootstrap || {};
        var ui = new FlashLibraryUI(root, bootstrap);
        ui.init();
        global.flashLibraryUI = ui;
    }

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bootstrapUI);
        } else {
            bootstrapUI();
        }
    }

    var exportsObj = {
        FlashLibraryUI: FlashLibraryUI,
        buildSearchParams: buildSearchParams,
        mergeFilters: mergeFilters,
        createQueryState: createQueryState,
        dedupeTags: dedupeTags
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = exportsObj;
    } else {
        global.FlashLibrary = exportsObj;
    }
})(typeof window !== 'undefined' ? window : globalThis);
