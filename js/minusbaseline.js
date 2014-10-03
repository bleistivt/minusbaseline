jQuery(function($) {

	$('a.Hamburger').click(function(e) {
		e.preventDefault();
		$('body').toggleClass('HamburgerOpen');
	})
	
	$('ul.DataList.Discussions, ul.DataList.Itemlisten').on('click', 'li.Item', function (e) {
        var href = $(this).find('.Title a').attr('href');
        if (!$(e.target).is('span.OptionsTitle, a, a.Bookmark, input') && typeof href !== 'undefined') {
            document.location = href;
        }
    });
	
    $('div.MeMenu').on('click', 'li.Item', function () {
        var href = $(this).find('a:last').attr('href');
        if (typeof href !== 'undefined') {
            document.location = href;
        }
    });

});
