/**
 * RequireJS configuration for DreamSites HomeCarousel module
 * Loads Slick slider library with jQuery dependencies
 */
var config = {
    map: {
        '*': {
            'slick': 'DreamSites_HomeCarousel/js/slick.min'
        }
    },
    shim: {
        'DreamSites_HomeCarousel/js/slick.min': {
            deps: ['jquery'],
            exports: 'jQuery.fn.slick'
        }
    }
};
