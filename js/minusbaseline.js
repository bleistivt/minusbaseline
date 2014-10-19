jQuery(function($) {

	var body = $('body');
	var pushstate = window.history && window.history.pushState;

	//toggle the menuopen class when the hamburger is clicked
	$('a.Hamburger').click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		if (body.hasClass('HamburgerOpen')) {
			body.removeClass('HamburgerOpen');
			if (pushstate) {
				window.history.back();
			}
		} else {
			body.addClass('HamburgerOpen');
			if (pushstate) {
				window.history.pushState('menu', null, '#menu');
			}
		}
	});

	//close the menu when the user tries to interact with the rest of the page
	$('#Content, #Head').on('mousedown touchstart', function(e) {
		if (body.hasClass('HamburgerOpen')) {
			e.preventDefault();
			body.removeClass('HamburgerOpen');
			if (pushstate) {
				window.history.back();
			}
		}
	});

	//make the back button close the menu
	if (pushstate) {
		$(window).on('popstate', function() {
			if (body.hasClass('HamburgerOpen')) {
				body.removeClass('HamburgerOpen');
			}
		});
	}

	//make the whole area of DiscussionList Items clickable
	$('ul.DataList.Discussions, ul.DataList.Itemlisten').on('click', 'li.Item', function (e) {
		var href = $(this).find('.Title a').attr('href');
		if (!$(e.target).is('span.OptionsTitle, a, a.Bookmark, input, select, option') && typeof href !== 'undefined') {
			document.location = href;
		}
	});
	$('div.MeMenu').on('click', 'li.Item', function () {
		var href = $(this).find('a:last').attr('href');
		if (typeof href !== 'undefined') {
			document.location = href;
		}
	});

	//create select lists for flyout menus
	var change = function() {
		$('option:selected', this).data('a').click();
		$(this).val(null);
	};

	var flyouts = $('.ToggleFlyout');
	for (var i = 0; i < flyouts.length; i++) {
		//grab all the links
		var items = $('ul.MenuItems a', flyouts[i]);
		//create a selectlist
		var select = $('<select/>').css({
				position: 'absolute',
				left: 0,
				opacity: 0
			}).appendTo(flyouts[i]);
		//extract the text and the url
		for (var j = 0; j < items.length; j++) {
			select.append(
				$('<option/>')
				.data('a', items[j])
				.text(items[j].text)
			);
		}
		select.val(null);
		//simulate a click on change
		select.change(change);
	}

});
