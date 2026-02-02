/**
 * RequireJS wrapper for FilePondUploader Vue component
 * This loads and returns the actual FilePondUploader.vue component
 */
define([
    'vue',
    'filepond',
    'vue-filepond',
    'filepond-plugin-image-preview',
    'filepond-plugin-file-validate-type',
    'filepond-plugin-image-crop',
    'filepond-plugin-image-transform',
    'filepond-plugin-image-resize',
    'filepond-plugin-file-validate-size',
    'heic2any',
    'text!DreamSites_CustomerPhotos/js/vue/FilePondUploader.vue'
], function(Vue, FilePond, vueFilePond, FilePondPluginImagePreview, FilePondPluginFileValidateType, FilePondPluginImageCrop, FilePondPluginImageTransform, FilePondPluginImageResize, FilePondPluginFileValidateSize, heic2any, vueTemplate) {
    'use strict';

    // Parse the Vue single file component
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
            throw new Error('Could not parse Vue component export');
        }

        // Get the vue-filepond function (handle different export structures)
        if (!vueFilePond) {
            throw new Error('vueFilePond is undefined - check requirejs-config.js mapping');
        }

        const vueFilePondFunction = vueFilePond.default || vueFilePond;

        const FilePond = vueFilePondFunction(
            FilePondPluginFileValidateType,
            FilePondPluginImagePreview,
            FilePondPluginImageCrop,
            FilePondPluginImageTransform,
            FilePondPluginImageResize,
            FilePondPluginFileValidateSize
        );

        // Get the heic2any function (handle different export structures)
        if (!heic2any) {
            throw new Error('heic2any is undefined - check requirejs-config.js mapping');
        }

        // heic-to exports a function directly (no .default property)
        const heic2anyFunction = typeof heic2any === 'function' ? heic2any : (heic2any.default || heic2any);

        // Make it available globally for the Vue component
        if (typeof heic2anyFunction === 'function') {
            if (!window.heic2any) {
                window.heic2any = heic2anyFunction;
            }
            if (!window.HeicTo) {
                window.HeicTo = heic2anyFunction;
            }
        }

        // Create a function that returns the component definition
        const componentDefFunction = new Function('Vue', 'FilePond', 'heic2any', `
            // FilePond is now available in this scope
            return ${exportMatch[1]}
        `);

        const componentDef = componentDefFunction(Vue, FilePond, heic2anyFunction);

        // Set the template
        componentDef.template = template;

        // Register FilePond as a component so it can be used in the template
        if (!componentDef.components) {
            componentDef.components = {};
        }

        // Register the FilePond component that we created
        // Make sure it's available in both PascalCase and kebab-case
        componentDef.components.FilePond = FilePond;
        componentDef.components['file-pond'] = FilePond;

        // Ensure heic2any are available in the component
        const originalData = componentDef.data || function() { return {}; };
        componentDef.data = function() {
            const data = typeof originalData === 'function' ? originalData.call(this) : originalData;
            data.heic2any = heic2anyFunction;
            return data;
        };

        return componentDef;
    }

    try {
        // Parse and return the Vue component
        return parseVueComponent(vueTemplate);
    } catch (error) {
        console.error('Error parsing Vue component:', error);

        // Fallback component if parsing fails
        return {
            name: 'FilePondUploader',
            template: `
                <div class="filepond-error">
                    <p>Error loading FilePond component: {{ error }}</p>
                </div>
            `,
            data() {
                return {
                    error: error.message
                }
            }
        };
    }
});
