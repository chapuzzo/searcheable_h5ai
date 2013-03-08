
modulejs.define('ext/search', ['_', '$', 'core/settings', 'core/resource', 'core/server', 'core/event'], function (_, $, allsettings, resource, server, event) {

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

		/*filter = function (re) {

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
		},*/

		update = function () {

			var val = $input.val();

			if (val) {
				$.ajax({
					url: 'http://jsonizer/v2.php',
					data: { string : val },
					crossDomain: true,
					type: 'POST',
					dataType: 'json',
					success: function (json) {
						console.log(json);
						console.log(json[0].urls);
						var Item = modulejs.require('model/item'),
						//               (absHref,                 time, size, status, isContentFetched) 
						item = Item.get(json[0].urls[0].substr(1), 1512315, 15646, true );
						console.log(json[0].urls[0].substr(1));
						//$('#items').push(item);
						event.pub('location.refreshed', [], [item], []);
					},
					error: function () {
						//callback();
					}
				});

				$search.addClass('current');
			} else {				
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
