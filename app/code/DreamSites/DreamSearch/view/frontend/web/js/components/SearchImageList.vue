<template>
    <div
        class="search__container"
        v-click-outside="hide"
    >
        <form class="form__container form minisearch" v-bind:action="searchUrl" method="get">
            <input
                type="text"
                placeholder="Search"
                id="q"
                name="q"
                v-on:input="debounceInput"
                v-on:click="show"
                v-on:keydown.esc="hide"
                v-model="searchQuery"
                class="search__input"
            />
            <div class="actions">
                <button
                    type="button"
                    v-if="searchQuery !== ''"
                    v-on:click="clear"
                    title="Clear"
                    class="action__button action__button_type_clear"
                >
                    <i class="fas fa-times"></i>
                </button>
                <button
                    type="submit"
                    title="Search"
                    class="action__button action__button_type_search"
                >
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </form>
        <div
            class="loading"
            v-if="loading"
            ><img
                v-bind:src="loadingGif"
                alt="loading"
                title="loading"
        /></div>
        <div
            v-if="!noData"
            class="search__results"
            v-bind:class="{active: isActive}"
            tabindex="-1"
            v-on:keydown.esc="hide"
        >
            <div class="search__legend">
                <div class="search__display-mode">
                    <a
                        href="#"
                        class="search__toggle-link link_mode_grid"
                        v-bind:class="{active: gridMode}"
                        v-on:click="toggleDataMode('grid')"
                        title="Grid View"
                        ><i class="fas fa-th"></i
                    ></a>
                    <a
                        href="#"
                        class="search__toggle-link link_mode_list"
                        v-bind:class="{active: !gridMode}"
                        v-on:click="toggleDataMode('list')"
                        title="List View"
                        ><i class="fas fa-list"></i
                    ></a>
                </div>
                <div class="search__results-count">
                    <span v-text="resultCount"></span>
                    <span> Results for '</span>
                    <span v-text="searchQuery"></span>
                    <span>'</span>
                </div>
                <div class="search__display-sort">
                    <a
                        href="#"
                        class="search__toggle-link link_sort_relevance"
                        v-bind:class="{active: sortMode === 'relevance'}"
                        v-on:click="toggleDataSort('relevance')"
                        title="Relevance"
                        ><i class="fas fa-redo"></i
                    ></a>
                    <a
                        href="#"
                        class="search__toggle-link link_sort_asc"
                        v-bind:class="{active: sortMode === 'asc'}"
                        v-on:click="toggleDataSort('asc')"
                        title="Price Asc"
                        ><i class="fas fa-chevron-up"></i
                    ></a>
                    <a
                        href="#"
                        class="search__toggle-link link_sort_desc"
                        v-bind:class="{active: sortMode === 'desc'}"
                        v-on:click="toggleDataSort('desc')"
                        title="Price Desc"
                        ><i class="fas fa-chevron-down"></i
                    ></a>
                </div>
            </div>
            <div
                class="search__wrapper"
                v-on:scroll="scroll"
                v-bind:data-mode="dataMode"
            >
                <div
                    v-for="row in allData"
                    class="search__results-item"
                >
                    <search-image
                        v-bind:item_id="row.id"
                        v-bind:item_name="row.name"
                        v-bind:item_link="row.link"
                        v-bind:item_desc="row.desc"
                        v-bind:item_image="row.image"
                        v-bind:item_price="row.price"
                        v-bind:item_url="row.url"
                        v-bind:item_formatted_price="row.formatted_price"
                    ></search-image>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        searchUrl: {
            type: String,
            required: true
        },
        loadingGif: {
            type: String,
            required: true
        },
        placeholderImage: {
            type: String,
            required: false
        }
    },
    data: () => ({
        allData: [],
        resultsData: [],
        searchQuery: '',
        noData: true,
        loading: false,
        offset: 0,
        lastScrollUpdate: 0,
        isActive: false,
        dataMode: 'grid',
        dataSort: 'relevance',
        resultCount: 0,
        searching: false,
        gridMode: true,
        sortMode: 'relevance',
    }),
    methods: {
        search(params = {}) {
            this.allData = [];
            this.resultsData = [];
            this.loading = true;
            this.offset = 0;

            const formData = new FormData();
            formData.append('q', this.searchQuery);
            formData.append('form_key', window.FORM_KEY);
            formData.append('ajax_search', true);
            formData.append('sort', this.dataSort);

            fetch(this.searchUrl, {
                method: 'POST',
                body: formData,
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            })
            .then(response => response.json())
            .then(data => {
                this.resultCount = data.length;
                if (data.length > 0) {
                    this.resultsData = data;
                    for (let i = 0; i < Math.min(12, data.length); i++) {
                        this.allData.push(this.resultsData[i]);
                    }
                    this.noData = false;
                    this.isActive = true;
                }
                this.loading = false;
            })
            .catch(error => {
                console.error('Search error:', error);
                this.loading = false;
                this.noData = true;
            });
        },
        clear() {
            this.isActive = false;
            this.searchQuery = '';
            this.noData = true;
            this.loading = false;
            this.allData = [];
            this.resultsData = [];
            this.offset = 0;
            this.resultCount = 0;
            this.searching = false;
        },
        loadMore() {
            this.loading = true;
            let resultsLeft = 0;
            if (this.resultsData.length >= this.allData.length + 12) {
                resultsLeft = 12;
                this.offset += 12;
            } else if ((this.resultsData.length - this.allData.length) < 12 &&
                       (this.resultsData.length - this.allData.length) > 0) {
                resultsLeft = this.resultsData.length - this.allData.length;
                this.offset += resultsLeft;
            } else {
                resultsLeft = 0;
                this.loading = false;
                return;
            }

            if (resultsLeft > 0) {
                for (let i = this.offset; i < this.offset + resultsLeft; i++) {
                    this.allData.push(this.resultsData[i]);
                }
                this.loading = false;
            }
        },
        debounceInput: _.debounce(function (e) {
            if (this.searchQuery.length <= 2) {
                this.noData = true;
                this.loading = false;
                this.allData = [];
                this.resultsData = [];
                this.offset = 0;
                this.resultCount = 0;
                this.searching = false;
            } else {
                this.searching = true;
                this.search();
            }
        }, 1500),
        scroll: function (e) {
            var scrollBar = e.target;
            if ((scrollBar.scrollTop + scrollBar.clientHeight >= scrollBar.scrollHeight - 20)) {
                var t = new Date().getTime();
                if ((t - this.lastScrollUpdate) > 1000) {
                    this.lastScrollUpdate = t;
                    this.loadMore();
                }
            }
        },
        show: function () {
            this.isActive = true;
        },
        hide: function () {
            this.isActive = false;
        },
        toggleDataMode: function (mode) {
            this.dataMode = mode;
            if (mode === 'grid') {
                this.gridMode = true;
            } else {
                this.gridMode = false;
            }
        },
        toggleDataSort: function (sort) {
            this.dataSort = sort;
            this.sortMode = sort;
            this.loading = true;

            // Sort the cached results
            if (sort === 'asc') {
                this.resultsData.sort((a, b) => a.price - b.price);
            } else if (sort === 'desc') {
                this.resultsData.sort((a, b) => b.price - a.price);
            } else {
                this.resultsData.sort((a, b) => a.id - b.id);
            }

            // Reload visible data
            this.allData = [];
            for (let i = 0; i < Math.min(this.offset + 12, this.resultsData.length); i++) {
                this.allData.push(this.resultsData[i]);
            }
            this.loading = false;
        },
    }
}
</script>
