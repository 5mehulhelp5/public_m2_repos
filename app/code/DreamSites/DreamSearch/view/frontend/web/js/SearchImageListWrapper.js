/**
 * RequireJS wrapper for SearchImageList Vue component
 * This loads and returns the SearchImageList.vue component
 */
define([
    'vue',
    'underscore',
    'DreamSites_DreamSearch/js/SearchImageWrapper',
    'DreamSites_DreamSearch/js/v-click-outside.umd',
    'text!DreamSites_DreamSearch/js/components/SearchImageList.vue'
], function(Vue, _, SearchImage, vClickOutside, vueTemplate) {
    'use strict';

    function parseVueComponent(vueContent) {
        // Extract template
        const templateMatch = vueContent.match(/<template[^>]*>([\s\S]*?)<\/template>/);
        const template = templateMatch ? templateMatch[1].trim() : '';

        // Extract script content
        const scriptMatch = vueContent.match(/<script[^>]*>([\s\S]*?)<\/script>/);
        let scriptContent = scriptMatch ? scriptMatch[1] : '';

        // Remove imports that won't work in RequireJS context
        scriptContent = scriptContent.replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*\n?/g, '');

        // Extract the export default object
        const exportMatch = scriptContent.match(/export\s+default\s+({[\s\S]*});?\s*$/);
        if (!exportMatch) {
            throw new Error('Could not parse SearchImageList component');
        }

        // Create component definition
        const componentDefFunction = new Function('_', 'return ' + exportMatch[1]);
        const componentDef = componentDefFunction(_);
        componentDef.template = template;

        // Register SearchImage component
        if (!componentDef.components) {
            componentDef.components = {};
        }
        componentDef.components['search-image'] = SearchImage;

        // Register click-outside directive
        if (!componentDef.directives) {
            componentDef.directives = {};
        }
        componentDef.directives.clickOutside = vClickOutside.directive;

        return componentDef;
    }

    return parseVueComponent(vueTemplate);
});
