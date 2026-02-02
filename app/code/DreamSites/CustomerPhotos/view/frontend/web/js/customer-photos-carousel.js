define([
    'jquery',
    'slick'
], function ($) {
    'use strict';

    return function (config, element) {
        if (element) {
            $(element).slick({
                infinite: true,
                slidesToShow: 5,
                slidesToScroll: 1,
                dots: false,
                arrows: false,
                autoplay: true,
                autoplaySpeed: 3000,
                lazyLoad: 'ondemand',
                responsive: [
                    {
                        breakpoint: 1500,
                        settings: {
                            arrows: false,
                            slidesToShow: 4
                        }
                    },
                    {
                        breakpoint: 1024,
                        settings: {
                            arrows: false,
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            arrows: false,
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 500,
                        settings: {
                            arrows: false,
                            slidesToShow: 1
                        }
                    }
                ]
            });
        }
    };
});
