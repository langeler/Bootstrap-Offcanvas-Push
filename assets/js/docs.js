	// Scrolls to the selected menu item on the page
	$(function() {

		$('a[href*=#]:not([href=#],[data-toggle],[data-target],[data-slide])').click(function() {
			if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {

				var target = $(this.hash);

				target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

				if (target.length) {
					$('html,body').animate({
						scrollTop: target.offset().top
					}, 1000);
					return false;
				}
			}
		});
	});

	// Flip the caret, when a dropdown is clicked
	$(function(){
		$(".dropdown").on("show.bs.dropdown hide.bs.dropdown", function(){
			$(this).find(".caret").toggleClass("rotateY");
		});
	});

// back to top button - docs
$(function () {

	if ($('.docs-top').length) {

		_backToTopButton()
		$(window).on('scroll', _backToTopButton)

		function _backToTopButton () {

			if ($(window).scrollTop() > $(window).height()) {
				$('.docs-top').fadeIn()
			}

			else {
				$('.docs-top').fadeOut()
			}
		}
	}
})

$(function () {

	// doc nav js
	var $toc	= $('#markdown-toc')
	var $window = $(window)

	if ($toc[0]) {

		maybeActivateDocNavigation()
		$window.on('resize', maybeActivateDocNavigation)

		function maybeActivateDocNavigation () {

			if ($window.width() > 768) {
				activateDocNavigation()
			}

			else {
				deactivateDocNavigation()
			}
		}

		function deactivateDocNavigation() {

			$window.off('resize.theme.nav')
			$window.off('scroll.theme.nav')

			$toc.css({
				position: '',
				left: '',
				top: ''
			})
		}

		function activateDocNavigation() {

			var cache = {}

			function updateCache() {

				cache.containerTop   = $('.docs-content').offset().top - 40
				cache.containerRight = $('.docs-content').offset().left + $('.docs-content').width() + 45
				measure()
			}

			function measure() {

				var scrollTop = $window.scrollTop()
				var distance =  Math.max(scrollTop - cache.containerTop, 0)

				if (!distance) {

					$($toc.find('li')[1]).addClass('active')

					return $toc.css({
						position: '',
						left: '',
						top: ''
					})
				}

				$toc.css({
					position: 'fixed',
					left: cache.containerRight,
					top: 40
				})
			}

			updateCache()

			$(window)
			.on('resize.theme.nav', updateCache)
			.on('scroll.theme.nav', measure)

			$('.canvas').scrollspy({
				target: '#markdown-toc',
				selector: 'li > a'
			})

			setTimeout(function () {
				$('body').scrollspy('refresh')
			}, 1000)
		}
	}
})