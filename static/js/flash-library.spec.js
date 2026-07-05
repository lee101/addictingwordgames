'use strict';

const library = require('./flash-library.js');

describe('FlashLibrary helpers', function () {
    it('buildSearchParams encodes filters and preserves order', function () {
        const params = library.buildSearchParams({
            query: 'Portal',
            tags: ['puzzle', 'physics'],
            source: 'Armor Games',
            page: 3
        });
        expect(params).toBe('q=Portal&tags=puzzle%2Cphysics&source=Armor%20Games&page=3');
    });

    it('mergeFilters deduplicates tags and resets invalid pages', function () {
        const base = { query: '', tags: ['platformer'], source: '', page: 2, pageSize: 12 };
        const merged = library.mergeFilters(base, { tags: ['platformer', 'Platformer', 'action', ''], page: -5 });
        expect(merged.tags).toEqual(['platformer', 'action']);
        expect(merged.page).toBe(1);
    });

    it('createQueryState applies defaults', function () {
        const state = library.createQueryState({ query: 'Line Rider', pageSize: 20 });
        expect(state.query).toBe('Line Rider');
        expect(state.page).toBe(1);
        expect(state.tags).toEqual([]);
        expect(state.pageSize).toBe(20);
    });

    it('dedupeTags removes blank entries and enforces uniqueness', function () {
        const tags = library.dedupeTags(['strategy', 'Strategy', ' ', 'tower-defense']);
        expect(tags).toEqual(['strategy', 'tower-defense']);
    });
});
