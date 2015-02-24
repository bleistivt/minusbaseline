/*jslint browser: true */
/*global jQuery*/

jQuery(function ($) {
    'use strict';

    var $window = $(window),
        body = $('body'),
        menu = $('a.Hamburger'),
        pushstate = window.history && window.history.pushState,
        url = window.location.href,
        closeMenu,
        change,
        transformFlyouts;

    //remove the menu hash on the initial pageload
    if (pushstate && window.location.hash === '#menu') {
        url = window.location.href.split('#')[0];
        window.history.replaceState({}, '', url);
    }

    //toggle the menuopen class when the hamburger is clicked
    menu.click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (body.hasClass('HamburgerOpen')) {
            closeMenu();
        } else {
            var scrollTop = $window.scrollTop();
            menu.css({
                position: 'absolute',
                top: scrollTop
            });
            $('#Panel').css({
                top: scrollTop,
                height: $window.height()
            });
            body.addClass('HamburgerOpen');

            if (pushstate) {
                url = window.location.href;
                window.history.pushState({}, '', '#menu');

                //this prevents a chrome bug where the page is scrolled to the top after pushState
                //see https://code.google.com/p/chromium/issues/detail?id=399971
                setTimeout(function () {
                    if ($window.scrollTop() !== scrollTop) {
                        $window.scrollTop(scrollTop);
                    }
                }, 150);
            }
        }
    });

    //close the menu when the user tries to interact with the rest of the page
    closeMenu = function (e, back) {
        if (body.hasClass('HamburgerOpen')) {
            e = e && e.preventDefault();
            var transitionend = function () {
                menu.css({position: 'fixed', top: 0});
            };
            setTimeout(transitionend, 450);
            $window.one('transitionend', transitionend);
            body.removeClass('HamburgerOpen');

            if (pushstate && back !== false) {
                window.history.back();
            }
        }
    };

    $('#Content, #Head').on('touchstart', closeMenu);
    $window.on('orientationchange', closeMenu);

    //make the back button close the menu
    if (pushstate) {
        $(window).on('popstate', function () {
            closeMenu(null, false);
        });
    }

    //clear up the history when a link was clicked while the menu is open
    $(window).on('beforeunload', function () {
        if (body.hasClass('HamburgerOpen')) {
            window.history.replaceState({}, '', url);
        }
    });

    //make the whole area of DiscussionList Items clickable
    $('ul.DataList.Discussions, ul.DataList.Itemlisten').on('click', 'li.Item', function (e) {
        var href = $(this).find('.Title a').attr('href');
        if (!$(e.target).is('span.OptionsTitle, a, a.Bookmark, input, select, option') && href !== undefined) {
            document.location = href;
        }
    });
    $('div.MeMenu').on('click', 'li.Item', function () {
        var href = $(this).find('a:last').attr('href');
        if (href !== undefined) {
            document.location = href;
        }
    });

    //create select lists for flyout menus
    change = function () {
        $('option:selected', this).data('a').click();
        this.selectedIndex = -1;
    };

    transformFlyouts = function () {
        var flyouts, i, items, select, j;

        flyouts = $('.ToggleFlyout');
        for (i = 0; i < flyouts.length; i += 1) {
            //skip already transformed flyouts
            flyouts[i] = $(flyouts[i]);

            if (!flyouts[i].data('hasselectlist')) {
                flyouts[i].data('hasselectlist', true);

                //grab all the links
                items = $('ul.MenuItems a', flyouts[i]);

                //create a selectlist
                select = $('<select/>').css({
                    position: 'absolute',
                    left: 0,
                    opacity: 0
                }).appendTo(flyouts[i]);

                //extract the text and the url
                for (j = 0; j < items.length; j += 1) {
                    select.append(
                        $('<option/>')
                            .data('a', items[j])
                            .text(items[j].text)
                    );
                }
                //deselect the first (default) option
                select[0].selectedIndex = -1;

                //simulate a click on change
                select.change(change);
            }
        }
    };
    transformFlyouts();

    $(document).on('CommentAdded CommentPagingComplete', transformFlyouts);

});
