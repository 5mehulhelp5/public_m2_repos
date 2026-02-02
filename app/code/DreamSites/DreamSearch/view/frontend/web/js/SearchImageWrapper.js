/**
 * RequireJS wrapper for SearchImage Vue component
 * This loads and returns the SearchImage.vue component
 */
define([
    'text!DreamSites_DreamSearch/js/components/SearchImage.vue'
], function(vueTemplate) {
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
            throw new Error('Could not parse SearchImage component');
        }

        // Create component definition
        const componentDefFunction = new Function('return ' + exportMatch[1]);
        const componentDef = componentDefFunction();
        componentDef.template = template;

        return componentDef;
    }

    return parseVueComponent(vueTemplate);
});
