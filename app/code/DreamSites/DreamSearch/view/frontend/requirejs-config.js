var config = {
    map: {
        '*': {
            vue: 'DreamSites_CustomerPhotos/js/filepond/vue.global.prod',
            text: 'mage/requirejs/text'
        }
    },
    shim: {
        'DreamSites_CustomerPhotos/js/filepond/vue.global.prod': {
            deps: [],
            exports: 'Vue'
        },
        'DreamSites_DreamSearch/js/v-click-outside.umd': {
            deps: ['vue'],
            exports: 'vClickOutside'
        }
    },
    config: {
        text: {
            headers: {
                'Accept': 'text/plain'
            }
        }
    }
};
