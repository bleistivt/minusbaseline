jQuery(function($) {

    var body = $('body'),
        pushstate = window.history && window.history.pushState,
        href = window.location.href;


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
                href = window.location.href;
                window.history.pushState({}, '', '#menu');
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

    //clear up the history when a link was clicked while the menu is open
    $(window).on('beforeunload', function() {
        if (body.hasClass('HamburgerOpen')) {
            window.history.replaceState({}, '', href);
        }
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
    var change = function() {
        $('option:selected', this).data('a').click();
        this.selectedIndex = -1;
    };

    var transformFlyouts = function() {
        var flyouts = $('.ToggleFlyout');
        for (var i = 0; i < flyouts.length; i++) {
            //skip already transformed flyouts
            flyouts[i] = $(flyouts[i]);
            if (flyouts[i].data('hasselectlist')) {
                continue;
            }
            flyouts[i].data('hasselectlist', true);
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
            select[0].selectedIndex = -1;
            //simulate a click on change
            select.change(change);
        }
    };
    transformFlyouts();

    $(document).on('CommentAdded CommentPagingComplete', transformFlyouts);

});
