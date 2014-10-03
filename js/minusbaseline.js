jQuery(function($) {

	//toggle the menuopen class when the hamburger is clicked
	$('a.Hamburger').click(function(e) {
		e.preventDefault();
		$('body').toggleClass('HamburgerOpen');
	});
	
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
	var options = gdn.definition('MinusBaseline.Options');
	
	var change = function() {
		$('option:selected', this).data('a').click();
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
