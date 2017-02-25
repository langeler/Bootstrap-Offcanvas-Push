/* ========================================================================
 * Bootstrap: push.js v1.0
 * http://joakim.langeler.se/
 * ========================================================================
 * Copyright 2017 Joakim Langeler
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */

+function ($) {
	'use strict';

	// PUSH CLASS DEFINITION
	// ================================

	// DataAPI, used to indetify inilitizing of the Push plugin
	var dataApi = '[data-toggle="push"]' // Default value is '[data-toggle="push"]'

	// Main function to get off canvas element and options
	var Push = function (element, options) {
		this.element = element
		this.options = options
	}

	// Current version
	Push.VERSION = '1.0'

	// Transition duration
	Push.TRANSITION_DURATION = 150

	// Default settings
	Push.DEFAULTS = {

		// Easing methos, used for the element when it (opens / closes).
		easing			: 'cubic-bezier(.2,.7,.5,1)', // Default value is 'cubic-bezier(.2,.7,.5,1)'

		// Duration for an element to (open / close)
		duration		: 300, // Default value is 300

		// Delay before the element (opens / closes)
		delay			: 0, // Default value is 0

		// Distance an element (opens / closes)
		distance		: 250, // Default value is 250

		// Enable or disable Anti Scrolling (outside the element)
		antiScroll		: true, // Default value is true

		// Enable or disable keyboard closing (escape key to close the element)
		keyboard		: true, // Default value is true

		// Enable or disable a modal like overlay (outside the element).
		overlay			: true, // Default value is true

		// Canvas element (outside togglable sidebars).
		canvas			: '#canvas' // Default value is '#wrapper'
	}

	// Return element if it's open
	Push.prototype.isOpen = function () {
		return $(this.options.canvas).hasClass('isOpen')
	}

	// Function to toggle (open or close)
	Push.prototype.toggle = function () {

		// If element is already open
		if (this.isOpen()) {
			this.close() // close element
		}

		// If element isn't open
		else {
			this.open() // open element
		}
	}

	// Function to find all fixed elements
	Push.prototype.findFixed = function () {

		// Filter all elements with position: fixed
		var fixed_elements = $('*').filter(function() {
			return $(this).css("position") === 'fixed';
		}).not(this.element) // Skip toggelable element

		// Return all fixed elements, except the toggelable element
		return fixed_elements
    }

	// Function to disable scrolling outside an element
	Push.prototype.disableScrolling = function () {

		$(document.body).css('overflow', 'hidden')

		if ('ontouchstart' in document.documentElement) {
			$(document).on('touchmove.bs.push', function (e) {
				e.preventDefault()
			})
		}
	}

	// Function to enable scrolling outside an element
	Push.prototype.enableScrolling = function () {

		$(document.body).css('overflow', 'auto')

		if ('ontouchstart' in document.documentElement) {
			$(document).off('touchmove.bs.push')
		}
	}

	// Function to disable key press to close an element
	Push.prototype.disableKeyboard = function () {
		$(window).off('keydown.bs.push')
	}

	// Function to enable key press to close an element
	Push.prototype.enableKeyboard = function () {

		$(window).one('keydown.bs.push', $.proxy(function (e) {
			e.which == 27 && this.close()
		}, this))
	}

	// Function to remove an overlay outside the element
	Push.prototype.disableOverlay = function () {

		// Remove it (later)
		$(".modal-backdrop").remove();
	}

	// Function to add an overlay outside the element
	Push.prototype.enableOverlay = function () {

		// Show the backdrop
		$('<div class="modal-backdrop in"></div>').appendTo(this.options.canvas);
	}

	// Function to open an element
	Push.prototype.open = function () {

		var that = this
		var fixedElements = this.findFixed()

		// If options is set to disable scrolling, disable it on opening
		if (this.options.antiScroll) this.disableScrolling()

		// If options is set to enable keyboard, enable it on opening
		if (this.options.keyboard) this.enableKeyboard()

		// If options is set to activate overlay, activate it on opening
		if (this.options.overlay) this.enableOverlay()

		$(this.element).removeClass('hidden')

		$(this.options.canvas)
		.on('click.bs.push', $.proxy(this.close, this))
		.trigger('open.bs.push')
		.addClass('isOpen')

		// If browser doesn't support CSS3 transitions
		if (!$.support.transition) {

			fixedElements
			.css({
				'left': this.options.distance + 'px',
				'position': 'relative'
			})

			$(this.options.canvas)
			.css({
				'left': this.options.distance + 'px',
				'position': 'relative'
			})
			.trigger('opened.bs.push')
			return
		}

		fixedElements
		.css({
			'-webkit-transition': '-webkit-transform ' + this.options.duration + 'ms ' + this.options.easing,
				'-ms-transition': '-ms-transform ' + this.options.duration + 'ms ' + this.options.easing,
					'transition': 'transform ' + this.options.duration + 'ms ' + this.options.easing
		})

		$(this.options.canvas)
		.css({
			'-webkit-transition': '-webkit-transform ' + this.options.duration + 'ms ' + this.options.easing,
				'-ms-transition': '-ms-transform ' + this.options.duration + 'ms ' + this.options.easing,
					'transition': 'transform ' + this.options.duration + 'ms ' + this.options.easing
		})

		this.options.canvas.offsetWidth // Force reflow

		fixedElements
		.css({
			'-webkit-transform': 'translateX(' + this.options.distance + 'px)',
				'-ms-transform': 'translateX(' + this.options.distance + 'px)',
					'transform': 'translateX(' + this.options.distance + 'px)'
		})

		$(this.options.canvas)
		.css({
			'-webkit-transform': 'translateX(' + this.options.distance + 'px)',
				'-ms-transform': 'translateX(' + this.options.distance + 'px)',
					'transform': 'translateX(' + this.options.distance + 'px)'
		})
		.one('bsTransitionEnd', function () {
			$(that.options.canvas).trigger('opened.bs.push')
		})
		.emulateTransitionEnd(this.options.duration)
	}

	// Function to close an element
	Push.prototype.close = function () {

		var that = this
		var fixedElements = this.findFixed()

		// If options is set to enable keyboard, disable it on closing
		if (this.options.keyboard) this.disableKeyboard()

		// If options is set to activate overlay, deactivate it on closing
		if (this.options.overlay) this.disableOverlay()

		// If options is set to disable scrolling, enable it on clsoing
		if (this.options.antiScroll) this.enableScrolling()

		function complete () {

			$(that.element).addClass('hidden')

			fixedElements
			.css({
				'-webkit-transition': '',
					'-ms-transition': '',
						'transition': '',
				'-webkit-transform': '',
					'-ms-transform': '',
						'transform': ''
			})

			$(that.options.canvas)
			.removeClass('isOpen')
			.css({
				'-webkit-transition': '',
					'-ms-transition': '',
						'transition': '',
				'-webkit-transform': '',
					'-ms-transform': '',
						'transform': ''
			})
			.trigger('closed.bs.push')
		}

		// If browser doesn't support CSS3 transitions
		if (!$.support.transition) {

			fixedElements
			.css({
				'left': '',
				'position': ''
			})

			$(this.options.canvas)
			.trigger('close.bs.push')
			.css({
				'left': '',
				'position': ''
			})
			.off('click.bs.push')

			return complete()
		}

		fixedElements
		.css({
			'-webkit-transform': 'none',
				'-ms-transform': 'none',
					'transform': 'none'
		})

		$(this.options.canvas)
		.trigger('close.bs.push')
		.off('click.bs.push')
		.css({
			'-webkit-transform': 'none',
				'-ms-transform': 'none',
					'transform': 'none'
		})
		.one('bsTransitionEnd', complete)
		.emulateTransitionEnd(this.options.duration)
	}

	// PUSH PLUGIN DEFINITION
	// ==========================

	function Plugin(option) {

		return this.each(function () {

			var $this		= $(this)
			var data		= $this.data('bs.push')
			var options		= $.extend(
				{
					// extentions...
				},
				Push.DEFAULTS,
				$this.data(),
				typeof option == 'object' && option
			)

			if (!data) $this.data('bs.push', (data = new Push(this, options)))
			if (typeof option == 'string') data[option]()
		})
	}

	var old = $.fn.push

	$.fn.push				= Plugin
	$.fn.push.Constructor	= Push

	// PUSH NO CONFLICT
	// ====================

	$.fn.push.noConflict = function () {

		$.fn.push = old
		return this
	}


	// PUSH DATA-API
	// =================

	$(document).on('click', dataApi, function () {

		var options = $(this).data()
		var $target = $(this.getAttribute('data-target'))

		if (!$target.data('bs.push')) {
			$target.push(options)
		}

		$target.push('toggle')
	})
}(jQuery);