<template>
    <div id="app">
        <file-pond
            name="photo"
            ref="myPond"
            accepted-file-types="image/jpg, image/jpeg, image/png, image/webp, image/avif, image/heic, image/heif"
            allow-multiple="false"
            max-files="1"
            credits="false"
            instantUpload="true"
            dropValidation="true"
            allowImageResize="true"
            dropOnPage="true"
            allowImageTransform="true"
            imageTransformOutputMimeType="image/jpeg"
            imageTransformOutputQuality="50"
            allowFileEncode="true"
            allowImagePreview="true"
            allowImageCrop="true"
            imageCropAspectRation="1:1"
            imageResizeTargetWidth="1024"
            maxFileSize="100MB"
            allowProcess="true"
            :server="{ process }"
            v-on:addfile="started"
            v-on:processfiles="processFilesComplete"
            v-on:warning="warning"
            imagePreviewMaxHeight="120"
            labelIdle="Drag or click here to upload image"
            v-on:init="handleFilePondInit"
            :file-validate-type-detect-type="validateType"
        />
    </div>
</template>
<script>
export default {
    name: "app",
    props: {
        post_url: { type: String, default: '', required: true }
    },
    watch: {
        browse: function () {
            this.handleBrowse();
        },
        processFiles: function () {
            this.handleProcessFiles();
        },
    },
    methods: {
        warning: function(error) {
            console.error('FilePond warning:', error.body);
        },
        started: function(error, file) {
            // Automatically start processing files when added
            this.handleProcessFiles();
        },
        processFilesComplete: function() {
            // Emit event when files are done processing
            //this.$emit('processfiles');
        },
        handleProcessFiles() {
            // Access the FilePond instance and manually start the upload
            this.$refs.myPond.processFiles();
        },
        handleBrowse() {
            let files = this.$refs.myPond.getFiles();
            if (files.length === 0) {
                this.$refs.myPond.browse();
            }
        },
        validateType(source, type) {
            console.log('Validating type for file:', source.name);
            const p = new Promise((resolve, reject) => {
                if (source && source.name && /\.heic$/i.test(source.name)) {
                    resolve('image/heic');
                } else if (source && source.name && /\.heif$/i.test(source.name)) {
                    resolve('image/heif');
                } else {
                    resolve(type);
                }
            })

            return p
        },
        process: function(fieldName, file, metadata, load, error, progress, abort, transfer, options) {
            const processFile = async (fileToProcess) => {

                //begin xhr
                try {
                    const formData = new FormData();
                    formData.append("filename", fileToProcess, fileToProcess.name);
                    formData.append("form_key", window.FORM_KEY);

                    // Use fetch API for upload
                    const xhr = new XMLHttpRequest();

                    xhr.upload.addEventListener('progress', (e) => {
                        if (e.lengthComputable) {
                            progress(e.lengthComputable, e.loaded, e.total);
                        }
                    });

                    xhr.addEventListener('load', () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            try {
                                const response = JSON.parse(xhr.responseText);
                                load(response);
                            } catch (e) {
                                error('Invalid response from server');
                            }
                        } else {
                            error('Upload failed: ' + xhr.statusText);
                        }
                    });

                    xhr.addEventListener('error', () => {
                        error('Upload failed: Network error');
                    });

                    xhr.open('POST', this.post_url, true);
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    xhr.send(formData);

                } catch (err) {
                    error('Upload failed: ' + err.message);
                    console.error('Upload failed', err);
                }
                //end xhr
            };

            if (file.name.toLowerCase().indexOf('.heic') !== -1 || file.name.toLowerCase().indexOf('.heif') !== -1) {
                // heic-to library API (works with both HEIC and HEIF)
                const converter = window.heic2any || window.HeicTo;

                if (converter) {
                    // console.log('Converting HEIC/HEIF to JPEG...');
                    converter({
                        blob: file,
                        type: "image/jpeg",
                        quality: 0.3
                    }).then((convertedBlob) => {
                        // console.log('Conversion successful, blob size:', convertedBlob.size);
                        const newFileName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
                        const convertedFile = new File([convertedBlob], newFileName, { type: "image/jpeg" });
                        processFile(convertedFile);
                    }).catch((err) => {
                        console.error("HEIC/HEIF conversion failed:", err);
                        error("HEIC/HEIF conversion failed: " + err);
                    });
                } else {
                    error("HEIC converter not loaded");
                    console.error("heic-to library not available");
                }
            } else {
                processFile(file);
            }

            return {
                abort: () => {
                    // This function should be called if the user aborts the upload
                }
            };
        },
        handleFilePondInit: function () {
            //console.log('FilePond has initialized');

            // example of instance method call on pond reference
            //console.log(this.$refs.myPond.getFiles());
        },
        handleFileError: function (file) {
            this.$refs.myPond.removeFile(file);
        }
    },
    components: {
        FilePond,
    },
};
</script>
