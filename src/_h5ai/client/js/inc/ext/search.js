
modulejs.define('ext/search', ['_', '$', 'core/settings', 'core/resource'], function (_, $, allsettings, resource) {

	var settings = _.extend({
			enabled: false
		}, allsettings.search),

		template = '<li id="search">' +
						'<span class="element">' +
							'<img src="' + resource.image('search') + '" alt="search"/>' +
							'<input type="text" value="" placeholder="search"/>' +
						'</span>' +
					'</li>',
		noMatchTemplate = '<div class="no-match l10n-noMatch"/>',

		$search, $input, $noMatch,

		filter = function (re) {

			var match = [],
				noMatch = [],
				duration = 200;

			if (re) {
				$('#items .item').each(function () {

					var label = $(this).find('.label').text();

					if (label.match(re)) {
						match.push(this);
					} else {
						noMatch.push(this);
					}
				});
			} else {
				match = $('#items .item');
			}

			if ($(match).length) {
				$noMatch.hide();
			} else {
				setTimeout(function () { $noMatch.show(); }, duration);
			}
			$(match).fadeIn(duration);
			$(noMatch).fadeOut(duration);
		},

		escapeRegExp = function (sequence) {

			return sequence.replace(/[\-\[\]{}()*+?.,\\$\^|#\s]/g, '\\$&');
		},

		parseFilterSequence = function (sequence) {

			if (sequence.substr(0, 3) === 're:') {
				return new RegExp(sequence.substr(3));
			}

			sequence = $.map($.trim(sequence).split(/\s+/), function (part) {

				return _.map(part.split(''), function (char) {

					return escapeRegExp(char);
				}).join('.*?');
			}).join('|');

			return new RegExp(sequence, 'i');
		},

		update = function () {

			var val = $input.val();

			if (val) {
				//filter(parseFilterSequence(val));
				$search.addClass('current');
			} else {
				//filter();
				$search.removeClass('current');
			}
		},

		init = function () {

			if (!settings.enabled) {
				return;
			}

			$search = $(template).appendTo('#navbar');
			$input = $search.find('input');
			$noMatch = $(noMatchTemplate).appendTo('#view');

			$search
				.on('click', function () {

					$input.focus();
				});

			$input
				.on('focus', function () {

					$search.addClass('current');
				})
				.on('blur keyup', update);

			$input
				.on('keydown', function (event) {

					if (event.which === 27) {
						$input.attr('value','').blur();
					}
				})
				.on('keypress', function (event) {

					$input.focus();
				});
		};

	init();
});
