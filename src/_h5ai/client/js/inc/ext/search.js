
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

		update = function () {

			var val = $input.val();

			if (val) {
				search(val);
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

			$(document)
				.on('keydown', function (event) {

					if (event.which === 27) {
						$input.attr('value','').blur();
					}
					else 
					if((57>=event.which && event.which>=48)        // first row numbers
			        || (105>=event.which && event.which>=96)        // keypad numbers
			        || (90>=event.which && event.which>=65))         // a-z
			        //|| (40>=event.which && event.which>=37)       // arrows
			        //|| (event.which == 8) || (event.which == 46)  // backspace && del
			        //|| (event.which == 13) || (event.which == 32))// enter && space
				    {				      
						$input.focus();
				    }
				    else
				    {
				    	//event.which = 0;
				    }
				});
		};

	init();
});
