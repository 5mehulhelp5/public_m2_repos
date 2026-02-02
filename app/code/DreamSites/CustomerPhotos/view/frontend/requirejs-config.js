/**
 * RequireJS configuration for DreamSites Blog module
 */
var config = {
    map: {
        '*': {
            'vue': 'DreamSites_CustomerPhotos/js/filepond/vue.global.prod',
            'text': 'mage/requirejs/text',
            'filepond': 'DreamSites_CustomerPhotos/js/filepond/filepond.min',
            'vue-filepond': 'DreamSites_CustomerPhotos/js/filepond/vue-filepond',
            'filepond-plugin-image-preview': 'DreamSites_CustomerPhotos/js/filepond/filepond-plugin-image-preview.min',
            'filepond-plugin-file-validate-type': 'DreamSites_CustomerPhotos/js/filepond/filepond-plugin-file-validate-type.min',
            'filepond-plugin-image-crop': 'DreamSites_CustomerPhotos/js/filepond/filepond-plugin-image-crop.min',
            'filepond-plugin-image-transform': 'DreamSites_CustomerPhotos/js/filepond/filepond-plugin-image-transform.min',
            'filepond-plugin-image-resize': 'DreamSites_CustomerPhotos/js/filepond/filepond-plugin-image-resize.min',
            'filepond-plugin-file-validate-size': 'DreamSites_CustomerPhotos/js/filepond/filepond-plugin-file-validate-size.min',
            'heic2any': 'DreamSites_CustomerPhotos/js/filepond/heic-to',
            'slick': 'DreamSites_HomeCarousel/js/slick.min'
        }
    },
    shim: {
        'DreamSites_CustomerPhotos/js/filepond/vue.global.prod': {
            deps: [],
            exports: 'Vue'
        },
        'DreamSites_CustomerPhotos/js/filepond/filepond.min': {
            exports: 'FilePond'
        },
        'DreamSites_CustomerPhotos/js/filepond/vue-filepond': {
            deps: ['vue', 'filepond']
        },
        'DreamSites_CustomerPhotos/js/filepond/filepond-plugin-image-preview.min': {
            deps: ['filepond'],
            exports: 'FilePondPluginImagePreview'
        },
        'DreamSites_CustomerPhotos/js/filepond/filepond-plugin-file-validate-type.min': {
            deps: ['filepond'],
            exports: 'FilePondPluginFileValidateType'
        },
        'DreamSites_CustomerPhotos/js/filepond/filepond-plugin-image-crop.min': {
            deps: ['filepond'],
            exports: 'FilePondPluginImageCrop'
        },
        'DreamSites_CustomerPhotos/js/filepond/filepond-plugin-image-transform.min': {
            deps: ['filepond'],
            exports: 'FilePondPluginImageTransform'
        },
        'DreamSites_CustomerPhotos/js/filepond/filepond-plugin-image-resize.min': {
            deps: ['filepond'],
            exports: 'FilePondPluginImageResize'
        },
        'DreamSites_CustomerPhotos/js/filepond/filepond-plugin-file-validate-size.min': {
            deps: ['filepond'],
            exports: 'FilePondPluginFileValidateSize'
        },
        'DreamSites_CustomerPhotos/js/filepond/heic-to': {
            deps: [],
            exports: 'HeicTo'
        },
        'DreamSites_HomeCarousel/js/slick.min': {
            deps: ['jquery'],
            exports: 'jQuery.fn.slick'
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
