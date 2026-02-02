/**
 * Home Carousel - Slick Slider Initialization with Fade-in Animations
 */
define([
    'jquery',
    'slick'
], function ($) {
    'use strict';

    return function (config, element) {
        var carousel = element;
        var animationTimeouts = [];

        /**
         * Clear any pending animation timeouts
         */
        function clearAnimationTimeouts() {
            animationTimeouts.forEach(function(timeoutId) {
                clearTimeout(timeoutId);
            });
            animationTimeouts = [];
        }

        /**
         * Hide all slide content instantly (no transition)
         */
        function hideAllSlides() {
            var allTitles = carousel.querySelectorAll('.slider__content--maintitle');
            var allDescs = carousel.querySelectorAll('.slider__content--desc');
            var allBtns = carousel.querySelectorAll('.slider__content--btn');

            // Add no-transition class to disable transitions
            allTitles.forEach(function(title) {
                title.classList.add('no-transition');
                title.classList.remove('is-visible');
            });

            allDescs.forEach(function(desc) {
                desc.classList.add('no-transition');
                desc.classList.remove('is-visible');
            });

            allBtns.forEach(function(btn) {
                btn.classList.add('no-transition');
                btn.classList.remove('is-visible');
            });

            // Force reflow to ensure instant hiding
            void carousel.offsetWidth;

            // Remove no-transition class to allow future transitions
            allTitles.forEach(function(title) {
                title.classList.remove('no-transition');
            });

            allDescs.forEach(function(desc) {
                desc.classList.remove('no-transition');
            });

            allBtns.forEach(function(btn) {
                btn.classList.remove('no-transition');
            });
        }

        /**
         * Animate all slide content in sequence
         */
        function animateAllSlides() {
            clearAnimationTimeouts();
            // hideAllSlides();

            var allTitles = carousel.querySelectorAll('.slider__content--maintitle');
            var allDescs = carousel.querySelectorAll('.slider__content--desc');
            var allBtns = carousel.querySelectorAll('.slider__content--btn');

            // Animate title first (200ms delay)
            var timeout1 = setTimeout(function () {
                allTitles.forEach(function(title) {
                    title.classList.add('is-visible');
                });
            }, 200);

            // Animate description second (500ms delay)
            var timeout2 = setTimeout(function () {
                allDescs.forEach(function(desc) {
                    desc.classList.add('is-visible');
                });
            }, 500);

            // Animate button last (800ms delay)
            var timeout3 = setTimeout(function () {
                allBtns.forEach(function(btn) {
                    btn.classList.add('is-visible');
                });
            }, 800);

            animationTimeouts.push(timeout1, timeout2, timeout3);
        }

        // Initialize Slick carousel
        $(element).slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: true,
            autoplay: true,
            autoplaySpeed: 6000,
            pauseOnHover: true,
            pauseOnFocus: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                    }
                }
            ]
        });

        // Hide content before slide changes
        $(element).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            hideAllSlides();
        });

        // Animate content after slide has changed
        $(element).on('afterChange', function(event, slick, currentSlide) {
            animateAllSlides();
        });

        // Initial animation on page load
        animateAllSlides();
    };
});
