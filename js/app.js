(function () {
	'use strict';

	// Initialize the carousel of projects on the start page.
	$(".owl-carousel").owlCarousel({
		autoPlay: true,
		singleItem: true,
		navigation: true,
		navigationText: ["<", ">"],
		pagination: true,
		paginationSpeed: 500,
		responsive: true,
		slideSpeed: 500,
		stopOnHover: true,
		theme: 'ce-owl'
	});

    $(document).on('click', '.ce-menu-submenu', function () {
      sessionStorage.scrollTop = $(window).scrollTop();
    });

	// Used to handle clicks on table rows that acts like links.
	$(document).on('click', '[data-href]', function () {
		document.location = $(this).data('href');
	});

	// Used to toggle the menu if it is hidden (on small screens)
	$(document).on('click', '#menu', function () {
		$('#menu-primary').toggleClass('ce-active');
		$('#menu').toggleClass('ce-active');
	});

	/**
     * Function to limit a list of "medarbetare" from all to random list of a specific amount (currently: 4)
     * by removing the surplus DOM elements of the other "medarbetare".
     *
     * "Lazy" image loading/entry activation by transferring image url in attribute "data-src" to "src".
     */
	$(function () {
		var personList = $('.ce-person-list-limited');
		if (personList.length > 0) {

			// Pick four random persons to show and load the real images for these persons.
			for (var i = 0; i < 4; i++) {
				var persons = personList.find('[data-src][src$=".gif"]');
				var number = Math.floor(Math.random() * persons.length);
				var person = $(persons.get(number));
				person.attr('src', person.data('src'));
			}

			// All persons are added by in the template but with an empty gif. Remove all persons
			// without a real image, i.e. the ones that weren't choosen by the randomizer.
			personList.find('[src$=".gif"]').parent().parent().parent().remove();
		}

	    if ($('.ce-menu-submenu').length === 0) {
	        sessionStorage.scrollTop = "undefined"
	    }
	});

	/**
     * Function to limit a list of "medarbetarcitat" from all to random list of a specific amount (currently: 1)
     * by removing the surplus DOM elements of the other "medarbetarcitat".
     *
     * "Lazy" image loading/entry activation by transferring image url in attribute "data-src" to "src".
     */
	$(function () {
        var amountQuotes = 1;

		var quoteList = $('.ce-illustrated-quote');
		if (quoteList.length > 0) {

			// Pick four random quotes to show and load the real images for these quotee's.
			for (var i = 0; i < amountQuotes; i++) {
				var quotesWithoutImage = quoteList.find('[data-src][src$=".gif"]');
				var number = Math.floor(Math.random() * quotesWithoutImage.length);
				var quoteWithoutImage = $(quotesWithoutImage.get(number));

				// Set image src to load image for quotee
				quoteWithoutImage.attr('src', quoteWithoutImage.data('src'));
			}

			// All quotes are added by in the template but with an empty gif. Remove all quotes
			// without a real image, i.e. the ones that weren't choosen by the randomizer.
			quoteList.find('[src$=".gif"]').parent().parent().parent().remove();
		}
	});
})();

function initDisqus() {
	var disqusShortname = 'callistablog';

	var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
	dsq.src = '//' + disqusShortname + '.disqus.com/embed.js';
	(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
}


    $(document).ready(function() {
        var path2 = $(location).attr('pathname');

        /** Mapping from page url to url for background image */
        var imgBackground = {
            "/"                                 : "default",
            "/english/"                         : "default",
            "/om/jobb/"                         : "jobb",
            "/om/jobb/stockholm/"               : "jobb",
            "/om/jobb/goteborg/"                : "jobb",
            "/om/jobb/beskriv-jobb-generell/"   : "jobb",
            "/om/jobb/frontend/"                : "rekrytering/inget_snack",
            "/om/jobb/teknisk-arkitekt/"        : "rekrytering/mjukvaruarkitekt",
            "/om/jobb/it-arkitekter/"           : "rekrytering/itarkitekt",
            "/om/jobb/informatiker/"            : "rekrytering/Informatiker2",
        }

        var bgImage = imgBackground[path2]

        if(bgImage == undefined) {
            path2 = path2.split("/")[1];

            if(path2 == "erbjudanden") {
                if($(location).attr('pathname').split("/")[2] == "uppdrag") {
                    path2  = "uppdrag";
                }
            }
            bgImage = path2 == "" ? "default" : path2;
        }

        var lazyImages;
        if("IntersectionObserver" in window) {
            lazyImages = document.querySelectorAll(".lazyImg");

            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                    if(e.isIntersecting) {
                        var img = e.target;
                        img.classList.remove("lazyImg");
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(function(img) {
                img.style.backgroundImage = 'url("/images/backgrounds/' + bgImage + '.jpg")';
                observer.observe(img);
            })
        } else {
            lazyImages = document.querySelectorAll(".lazyImg");

            function loadLazyImage() {
                lazyImages.forEach(function(img) {
                        img.src = img.dataset.src;
                        img.style.backgroundImage = 'url("/images/backgrounds/' + bgImage + '.jpg")';
                        img.classList.remove("lazyImg");

                });
                if(lazyImages.length == 0) {
                    document.removeEventListener("scroll", loadLazyImage);
                    window.removeEventListener("resize", loadLazyImage);
                    window.removeEventListener("orientationChange", loadLazyImage);
                }
            }

            document.addEventListener("scroll", loadLazyImage);
            window.addEventListener("resize", loadLazyImage);
            window.addEventListener("orientationChange", loadLazyImage);
        }

        if (sessionStorage.scrollTop != "undefined") {
            $(window).scrollTop(sessionStorage.scrollTop);
        }

        if ($('.ce-blog').length > 0) {
            $('html, body').animate({
                scrollTop: $('.ce-blog').offset().top -10
            }, 1000);
        }
    })
