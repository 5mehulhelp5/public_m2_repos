/**
 * New Products - Vanilla JS Implementation
 * Replaces Alpine.js with standard JavaScript
 */
define(['jquery'], function($) {
    'use strict';

    return function(config, element) {
        var state = {
            activeTab: config.firstKey || '',
            showProductModal: false,
            selectedProduct: null,
            selectedOptions: {},
            quantity: 1,
            errorMessage: '',
            currentImage: '',
            imageLoading: false
        };

        var els = {
            tabs: element.querySelectorAll('[data-tab-button]'),
            tabPanes: element.querySelectorAll('[data-tab-pane]'),
            // Use document.querySelector for modal elements since they might be outside the section
            modalBackdrop: document.querySelector('[data-modal-backdrop]'),
            modalContent: document.querySelector('[data-modal-content]'),
            modalClose: document.querySelectorAll('[data-modal-close]'),
            modalTitle: document.querySelector('[data-modal-title]'),
            modalImagePrimary: document.querySelector('[data-modal-image-primary]'),
            modalImageSecondary: document.querySelector('[data-modal-image-secondary]'),
            modalThumbnails: document.querySelector('[data-modal-thumbnails]'),
            modalPrice: document.querySelector('[data-modal-price]'),
            modalShortDescription: document.querySelector('[data-modal-short-description]'),
            modalDescription: document.querySelector('[data-modal-description]'),
            modalColorSwatches: document.querySelector('[data-modal-color-swatches]'),
            modalSizeOptions: document.querySelector('[data-modal-size-options]'),
            modalOtherOptions: document.querySelector('[data-modal-other-options]'),
            modalError: document.querySelector('[data-modal-error]'),
            modalQuantity: document.querySelector('[data-modal-quantity]'),
            modalForm: document.querySelector('[data-modal-form]'),
            modalWishlist: document.querySelector('[data-modal-wishlist]'),
            modalViewFull: document.querySelector('[data-modal-view-full]'),
            modalReviewSummary: document.querySelector('[data-modal-review-summary]'),
            modalReviewResult: document.querySelector('[data-modal-review-result]'),
            modalReviewWidth: document.querySelector('[data-modal-review-width]'),
            modalReviewText: document.querySelector('[data-modal-review-text]'),
            modalSpinner: document.querySelector('[data-modal-spinner]'),
            productImages: element.querySelectorAll('[data-product-image]')
        };

        /**
         * Switch active tab
         */
        function switchTab(tabKey) {
            state.activeTab = tabKey;

            // Update button states
            els.tabs.forEach(function(tab) {
                var key = tab.getAttribute('data-tab-key');
                if (key === tabKey) {
                    tab.classList.remove('product__tab--primary__btn__list--inactive');
                    tab.classList.add('product__tab--primary__btn__list--active');
                    tab.setAttribute('aria-selected', 'true');
                } else {
                    tab.classList.remove('product__tab--primary__btn__list--active');
                    tab.classList.add('product__tab--primary__btn__list--inactive');
                    tab.setAttribute('aria-selected', 'false');
                }
            });

            // Update tab panes
            els.tabPanes.forEach(function(pane) {
                var key = pane.getAttribute('data-tab-key');
                if (key === tabKey) {
                    pane.classList.add('tab_pane--active');
                } else {
                    pane.classList.remove('tab_pane--active');
                }
            });
        }

        /**
         * Open product modal
         */
        function openProductModal(productData) {
            state.selectedProduct = productData;
            state.selectedOptions = {};
            state.quantity = 1;
            state.errorMessage = '';
            state.currentImage = productData.image;
            state.imageLoading = false;
            state.showProductModal = true;

            // Clear error message
            if (els.modalError) {
                els.modalError.textContent = '';
                els.modalError.classList.add('display-none');
            }

            // Update modal content
            if (els.modalTitle) {
                els.modalTitle.textContent = productData.name;
            }

            if (els.modalPrice) {
                els.modalPrice.textContent = productData.price;
            }

            if (els.modalImagePrimary) {
                els.modalImagePrimary.src = productData.image;
                els.modalImagePrimary.alt = productData.name;
                els.modalImagePrimary.style.opacity = '1';
            }

            if (els.modalImageSecondary) {
                els.modalImageSecondary.style.opacity = '0';
            }

            if (els.modalQuantity) {
                els.modalQuantity.value = 1;
            }

            // Short Description - use short description if available, otherwise first 170 chars of long description
            if (els.modalShortDescription) {
                var shortDesc = '';
                if (productData.short_description && productData.short_description.trim() !== '') {
                    shortDesc = productData.short_description;
                } else if (productData.description && productData.description.trim() !== '') {
                    // Strip HTML tags and get first 170 characters
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = productData.description;
                    var plainText = tempDiv.textContent || tempDiv.innerText || '';
                    shortDesc = plainText.substring(0, 170);
                    if (plainText.length > 170) {
                        shortDesc += '...';
                    }
                }
                els.modalShortDescription.innerHTML = shortDesc;
            }

            // Description
            if (els.modalDescription) {
                if (productData.description) {
                    els.modalDescription.parentElement.classList.remove('hidden');
                    els.modalDescription.textContent = productData.description;
                } else {
                    els.modalDescription.parentElement.classList.add('hidden');
                }
            }

            // Review Summary
            if (productData.reviews_count > 0) {
                if (els.modalReviewSummary) els.modalReviewSummary.classList.remove('hidden');
                if (els.modalReviewWidth) els.modalReviewWidth.style.width = productData.rating_summary + '%';
                if (els.modalReviewResult) els.modalReviewResult.title = productData.rating_summary + '%';
                if (els.modalReviewText) els.modalReviewText.textContent = productData.rating_summary + '%';
            } else {
                if (els.modalReviewSummary) els.modalReviewSummary.classList.add('hidden');
            }

            // Product ID
            if (els.modalForm) {
                var productIdInput = els.modalForm.querySelector('input[name="product"]');
                if (productIdInput) productIdInput.value = productData.id;
            }

            // Wishlist link
            if (els.modalWishlist) {
                els.modalWishlist.href = els.modalWishlist.getAttribute('data-base-url') + '?product=' + productData.id;
            }

            // View full product link
            if (els.modalViewFull) {
                els.modalViewFull.href = productData.url;
            }

            // Render options
            renderColorOptions(productData);
            renderSizeOptions(productData);
            renderOtherOptions(productData);

            // Render thumbnails
            renderThumbnails(productData);

            // Show modal
            document.body.style.overflow = 'hidden';

            if (els.modalBackdrop) {
                els.modalBackdrop.classList.add('product-modal__backdrop--active');
            }

            if (els.modalContent) {
                setTimeout(function() {
                    els.modalContent.classList.add('product-modal__content--active');
                }, 10);
            }
        }

        /**
         * Close product modal
         */
        function closeProductModal() {
            state.showProductModal = false;
            state.selectedProduct = null;
            state.selectedOptions = {};
            state.errorMessage = '';
            state.currentImage = '';
            state.imageLoading = false;

            // Hide modal
            if (els.modalContent) {
                els.modalContent.classList.remove('product-modal__content--active');
            }

            setTimeout(function() {
                if (els.modalBackdrop) {
                    els.modalBackdrop.classList.remove('product-modal__backdrop--active');
                }
                document.body.style.overflow = '';
            }, 300);
        }

        /**
         * Render thumbnail images
         */
        function renderThumbnails(productData) {
            if (!els.modalThumbnails) return;

            els.modalThumbnails.innerHTML = '';

            if (!productData.gallery_images || productData.gallery_images.length === 0) {
                return;
            }

            // Render thumbnails (max 5)
            productData.gallery_images.forEach(function(imageData, index) {
                var thumbnail = document.createElement('img');
                thumbnail.className = 'product-modal__thumbnail';
                if (index === 0) {
                    thumbnail.classList.add('product-modal__thumbnail--active');
                }
                thumbnail.src = imageData.url;
                thumbnail.alt = imageData.label;
                thumbnail.setAttribute('data-thumbnail-index', index);

                thumbnail.addEventListener('click', function() {
                    changeThumbnailImage(imageData.url, index);
                });

                els.modalThumbnails.appendChild(thumbnail);
            });
        }

        /**
         * Change main image when thumbnail is clicked
         */
        function changeThumbnailImage(imageUrl, index) {
            if (!els.modalImagePrimary || !els.modalImageSecondary) return;

            // Determine which image is currently visible
            var primaryOpacity = parseFloat(els.modalImagePrimary.style.opacity || '1');
            var isShowingPrimary = primaryOpacity > 0.5;

            // Select the hidden image to load the new one
            var targetImage = isShowingPrimary ? els.modalImageSecondary : els.modalImagePrimary;
            var oldImage = isShowingPrimary ? els.modalImagePrimary : els.modalImageSecondary;

            // Load new image in the hidden element
            targetImage.src = imageUrl;
            targetImage.alt = state.selectedProduct ? state.selectedProduct.name : '';
            state.currentImage = imageUrl;

            // Fade in the new image over the old one
            targetImage.style.opacity = '1';

            // After transition completes, fade out the old image
            setTimeout(function() {
                oldImage.style.opacity = '0';
            }, 200);

            // Update active thumbnail
            if (els.modalThumbnails) {
                var thumbnails = els.modalThumbnails.querySelectorAll('.product-modal__thumbnail');
                thumbnails.forEach(function(thumb, i) {
                    if (i === index) {
                        thumb.classList.add('product-modal__thumbnail--active');
                    } else {
                        thumb.classList.remove('product-modal__thumbnail--active');
                    }
                });
            }
        }

        /**
         * Render color options
         */
        function renderColorOptions(productData) {
            if (!els.modalColorSwatches) return;

            var colorContainer = els.modalColorSwatches.parentElement;
            if (!productData.options || !productData.options.colors || productData.options.colors.length === 0) {
                colorContainer.classList.add('hidden');
                return;
            }

            colorContainer.classList.remove('hidden');
            els.modalColorSwatches.innerHTML = '';

            productData.options.colors.forEach(function(color) {
                var button = document.createElement('button');
                button.type = 'button';
                button.className = 'product-modal__color-swatch';
                button.title = color.label;
                button.setAttribute('data-color-id', color.id);

                button.addEventListener('click', function() {
                    selectColor(color);
                });

                if (color.swatch_type == '1' && color.swatch_color) {
                    // Visual swatch (color circle)
                    var span = document.createElement('span');
                    span.className = 'product-modal__color-swatch__circle';
                    span.style.backgroundColor = color.swatch_color;
                    button.appendChild(span);
                } else if (color.swatch_type == '2' && color.swatch_thumb) {
                    // Visual swatch (image)
                    var img = document.createElement('img');
                    img.className = 'product-modal__color-swatch__image';
                    img.src = color.swatch_thumb;
                    img.alt = color.label;
                    button.appendChild(img);
                } else {
                    // Text swatch or fallback
                    var textSpan = document.createElement('span');
                    textSpan.className = 'product-modal__color-swatch__text';
                    textSpan.textContent = color.swatch_text || color.label;
                    button.appendChild(textSpan);
                }

                els.modalColorSwatches.appendChild(button);
            });
        }

        /**
         * Select color
         */
        function selectColor(color) {
            state.selectedOptions.color = color.id;

            // Update UI
            var colorButtons = els.modalColorSwatches.querySelectorAll('.product-modal__color-swatch');
            colorButtons.forEach(function(btn) {
                if (btn.getAttribute('data-color-id') == color.id) {
                    btn.classList.add('product-modal__color-swatch--selected');
                } else {
                    btn.classList.remove('product-modal__color-swatch--selected');
                }
            });

            // Change image if available
            if (color.image) {
                changeColorImage(color);
            }

            // Clear error
            state.errorMessage = '';
            if (els.modalError) {
                els.modalError.textContent = '';
                els.modalError.classList.add('display-none');
            }
        }

        /**
         * Change image when color is selected
         */
        function changeColorImage(colorOption) {
            if (!colorOption.image) return;
            if (!els.modalImagePrimary || !els.modalImageSecondary) return;

            state.imageLoading = true;
            if (els.modalSpinner) els.modalSpinner.classList.remove('hidden');

            // Determine which image is currently visible
            var primaryOpacity = parseFloat(els.modalImagePrimary.style.opacity || '1');
            var isShowingPrimary = primaryOpacity > 0.5;

            // Select the hidden image to load the new one
            var targetImage = isShowingPrimary ? els.modalImageSecondary : els.modalImagePrimary;
            var oldImage = isShowingPrimary ? els.modalImagePrimary : els.modalImageSecondary;

            // Preload the image
            var img = new Image();
            img.onload = function() {
                state.currentImage = colorOption.image;
                state.imageLoading = false;

                // Set the new image in the hidden element
                targetImage.src = colorOption.image;
                targetImage.alt = state.selectedProduct ? state.selectedProduct.name : '';

                // Fade in the new image over the old one
                targetImage.style.opacity = '1';

                // After transition completes, fade out the old image
                setTimeout(function() {
                    oldImage.style.opacity = '0';
                }, 200);

                if (els.modalSpinner) els.modalSpinner.classList.add('hidden');
            };
            img.onerror = function() {
                state.imageLoading = false;
                if (els.modalSpinner) els.modalSpinner.classList.add('hidden');
            };
            img.src = colorOption.image;
        }

        /**
         * Render size options
         */
        function renderSizeOptions(productData) {
            if (!els.modalSizeOptions) return;

            var sizeContainer = els.modalSizeOptions.parentElement;
            if (!productData.options || !productData.options.sizes || productData.options.sizes.length === 0) {
                sizeContainer.classList.add('hidden');
                return;
            }

            sizeContainer.classList.remove('hidden');
            els.modalSizeOptions.innerHTML = '';

            productData.options.sizes.forEach(function(size) {
                var button = document.createElement('button');
                button.type = 'button';
                button.className = 'product-modal__size-option product-modal__size-option--inactive';
                button.textContent = size.label;
                button.setAttribute('data-size-id', size.id);

                button.addEventListener('click', function() {
                    selectSize(size);
                });

                els.modalSizeOptions.appendChild(button);
            });
        }

        /**
         * Select size
         */
        function selectSize(size) {
            state.selectedOptions.size = size.id;

            // Update UI
            var sizeButtons = els.modalSizeOptions.querySelectorAll('.product-modal__size-option');
            sizeButtons.forEach(function(btn) {
                if (btn.getAttribute('data-size-id') == size.id) {
                    btn.classList.remove('product-modal__size-option--inactive');
                    btn.classList.add('product-modal__size-option--active');
                } else {
                    btn.classList.remove('product-modal__size-option--active');
                    btn.classList.add('product-modal__size-option--inactive');
                }
            });

            // Clear error
            state.errorMessage = '';
            if (els.modalError) {
                els.modalError.textContent = '';
                els.modalError.classList.add('display-none');
            }
        }

        /**
         * Render other options
         */
        function renderOtherOptions(productData) {
            if (!els.modalOtherOptions) return;

            if (!productData.options || !productData.options.otherOptions) {
                els.modalOtherOptions.innerHTML = '';
                return;
            }

            els.modalOtherOptions.innerHTML = '';

            for (var key in productData.options.otherOptions) {
                var option = productData.options.otherOptions[key];

                var optionDiv = document.createElement('div');
                optionDiv.className = 'product-modal__option';

                var title = document.createElement('h4');
                title.className = 'product-modal__option-title product-modal__option-title--required';
                title.textContent = option.label;
                optionDiv.appendChild(title);

                var optionsWrapper = document.createElement('div');
                optionsWrapper.className = 'product-modal__size-options';

                option.options.forEach(function(opt) {
                    var button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'product-modal__size-option product-modal__size-option--inactive';
                    button.textContent = opt.label;
                    button.setAttribute('data-option-key', key);
                    button.setAttribute('data-option-id', opt.id);

                    button.addEventListener('click', function() {
                        selectOtherOption(key, opt);
                    });

                    optionsWrapper.appendChild(button);
                });

                optionDiv.appendChild(optionsWrapper);
                els.modalOtherOptions.appendChild(optionDiv);
            }
        }

        /**
         * Select other option
         */
        function selectOtherOption(key, option) {
            state.selectedOptions[key] = option.id;

            // Update UI
            var buttons = els.modalOtherOptions.querySelectorAll('[data-option-key="' + key + '"]');
            buttons.forEach(function(btn) {
                if (btn.getAttribute('data-option-id') == option.id) {
                    btn.classList.remove('product-modal__size-option--inactive');
                    btn.classList.add('product-modal__size-option--active');
                } else {
                    btn.classList.remove('product-modal__size-option--active');
                    btn.classList.add('product-modal__size-option--inactive');
                }
            });

            // Clear error
            state.errorMessage = '';
            if (els.modalError) {
                els.modalError.textContent = '';
                els.modalError.classList.add('display-none');
            }
        }

        /**
         * Validate options before adding to cart
         */
        function validateOptions() {
            state.errorMessage = '';

            if (!state.selectedProduct || state.selectedProduct.typeId !== 'configurable') {
                return true;
            }

            var options = state.selectedProduct.options || {};

            if (options.colors && options.colors.length > 0 && !state.selectedOptions.color) {
                state.errorMessage = config.translations.selectColor || 'Please select a color';
                showError();
                return false;
            }

            if (options.sizes && options.sizes.length > 0 && !state.selectedOptions.size) {
                state.errorMessage = config.translations.selectSize || 'Please select a size';
                showError();
                return false;
            }

            if (options.otherOptions) {
                for (var key in options.otherOptions) {
                    var option = options.otherOptions[key];
                    if (!state.selectedOptions[key]) {
                        state.errorMessage = (config.translations.pleaseSelect || 'Please select') + ' ' + option.label;
                        showError();
                        return false;
                    }
                }
            }

            return true;
        }

        /**
         * Show error message
         */
        function showError() {
            if (els.modalError) {
                els.modalError.textContent = state.errorMessage;
                els.modalError.classList.remove('display-none');
            }
        }

        /**
         * Handle form submission
         */
        function handleFormSubmit(e) {
            e.preventDefault();

            if (!validateOptions()) {
                return false;
            }

            // Update hidden inputs for super attributes
            if (state.selectedProduct && state.selectedProduct.typeId === 'configurable') {
                var attributeIds = state.selectedProduct.options.attributeIds || {};

                // Remove old super_attribute inputs
                var oldInputs = els.modalForm.querySelectorAll('input[name^="super_attribute"]');
                oldInputs.forEach(function(input) {
                    input.remove();
                });

                // Add color attribute
                if (state.selectedOptions.color && attributeIds.color) {
                    var colorInput = document.createElement('input');
                    colorInput.type = 'hidden';
                    colorInput.name = 'super_attribute[' + attributeIds.color + ']';
                    colorInput.value = state.selectedOptions.color;
                    els.modalForm.appendChild(colorInput);
                }

                // Add size attribute
                if (state.selectedOptions.size && attributeIds.size) {
                    var sizeInput = document.createElement('input');
                    sizeInput.type = 'hidden';
                    sizeInput.name = 'super_attribute[' + attributeIds.size + ']';
                    sizeInput.value = state.selectedOptions.size;
                    els.modalForm.appendChild(sizeInput);
                }

                // Add other attributes
                for (var key in state.selectedOptions) {
                    if (key !== 'color' && key !== 'size' && attributeIds[key]) {
                        var otherInput = document.createElement('input');
                        otherInput.type = 'hidden';
                        otherInput.name = 'super_attribute[' + attributeIds[key] + ']';
                        otherInput.value = state.selectedOptions[key];
                        els.modalForm.appendChild(otherInput);
                    }
                }
            }

            // Submit form
            els.modalForm.submit();
        }

        /**
         * Initialize event listeners
         */
        function init() {
            // Tab buttons
            els.tabs.forEach(function(tab) {
                tab.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var tabKey = this.getAttribute('data-tab-key');
                    switchTab(tabKey);
                });
            });

            // Product image clicks
            els.productImages.forEach(function(img) {
                img.addEventListener('click', function() {
                    var productData = JSON.parse(this.getAttribute('data-product-json'));
                    openProductModal(productData);
                });
            });

            // Stop propagation on modal content clicks
            if (els.modalContent) {
                els.modalContent.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            }

            // Modal close buttons
            els.modalClose.forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    closeProductModal();
                });
            });

            // Close modal on backdrop click
            if (els.modalBackdrop) {
                els.modalBackdrop.addEventListener('click', function(e) {
                    closeProductModal();
                });
            }

            // Close modal on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && state.showProductModal) {
                    closeProductModal();
                }
            });

            // Form submission
            if (els.modalForm) {
                els.modalForm.addEventListener('submit', handleFormSubmit);
            }

            // Quantity increment/decrement buttons
            var decreaseBtn = document.querySelector('[data-quantity-decrease]');
            var increaseBtn = document.querySelector('[data-quantity-increase]');

            if (decreaseBtn) {
                decreaseBtn.addEventListener('click', function() {
                    var currentValue = parseInt(els.modalQuantity.value) || 1;
                    if (currentValue > 1) {
                        els.modalQuantity.value = currentValue - 1;
                        state.quantity = currentValue - 1;
                    }
                });
            }

            if (increaseBtn) {
                increaseBtn.addEventListener('click', function() {
                    var currentValue = parseInt(els.modalQuantity.value) || 1;
                    els.modalQuantity.value = currentValue + 1;
                    state.quantity = currentValue + 1;
                });
            }

            // Initialize first tab
            if (state.activeTab) {
                switchTab(state.activeTab);
            }
        }

        // Initialize
        init();
    };
});
