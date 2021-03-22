/*jslint browser: true */
/*global window, jQuery*/

jQuery(($) => {
    const $window = $(window);
    const body = $('body');
    const menu = $('a.Hamburger');
    const pushstate = window.history && window.history.pushState;

    //http://stackoverflow.com/a/17961266
    const isAndroid = navigator.userAgent.includes('Android');

    const webkitVer = parseInt((/WebKit\/([0-9]+)/.exec(navigator.appVersion) || [0, NaN])[1], 10);
    const stockAndroid = isAndroid && webkitVer <= 534 && navigator.vendor.indexOf('Google') === 0;
    const iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    let url = window.location.href;

    //remove the menu hash on the initial pageload
    if (pushstate && window.location.hash === '#menu') {
        url = window.location.href.split('#')[0];
        window.history.replaceState({}, '', url);
    }

    //close the menu when the user tries to interact with the rest of the page
    const closeMenu = (e, back) => {
        if (body.hasClass('HamburgerOpen')) {
            if (e) {
                e.preventDefault();
            }
            const transitionend = () => {
                menu.css({position: 'fixed', top: 0});
                $('#Panel').css({display: 'none'});
            };
            setTimeout(transitionend, 450);
            $window.one('transitionend', transitionend);
            body.removeClass('HamburgerOpen');

            if (pushstate && back !== false) {
                window.history.back();
            }
        }
        $window.scrollLeft(0);
    };

    //toggle the menuopen class when the hamburger is clicked
    menu.click(() => {
        if (body.hasClass('HamburgerOpen')) {
            closeMenu();
        } else {
            const scrollTop = $window.scrollTop();
            menu.css({
                position: 'absolute',
                top: scrollTop
            });
            $('#Panel').css({
                display: 'block',
                top: scrollTop,
                height: $window.height()
            });
            body.addClass('HamburgerOpen');
            $window.scrollLeft(0);

            if (pushstate) {
                url = window.location.href;
                window.history.pushState({}, '', '#menu');

                //this prevents a chrome bug where the page is scrolled to the top after pushState
                //see https://code.google.com/p/chromium/issues/detail?id=399971
                setTimeout(() => {
                    if ($window.scrollTop() !== scrollTop) {
                        $window.scrollTop(scrollTop);
                    }
                }, 150);
            }
        }
        return false;
    });

    $('#Content, #Head').on('touchstart', closeMenu);
    $window.on('orientationchange', closeMenu);

    //make the back button close the menu
    if (pushstate) {
        $window.on('popstate', () => {
            closeMenu(null, false);
        });
    }

    //clear up the history when a link was clicked while the menu is open
    $window.on('beforeunload', () => {
        if (body.hasClass('HamburgerOpen')) {
            window.history.replaceState({}, '', url);
        }
    });

    //make the whole area of DiscussionList Items clickable
    $('ul.DataList.Discussions, ul.DataList.Itemlisten').on('click', 'li.Item', ({currentTarget, target}) => {
        const href = $(currentTarget).find('.Title a').attr('href');
        if (!$(target).is('span.OptionsTitle, a, a.Bookmark, input, select, option') && href !== undefined) {
            document.location = href;
        }
    });
    $('div.MeMenu').on('click', 'li.Item', ({currentTarget}) => {
        const href = $(currentTarget).find('a:last').attr('href');
        if (href !== undefined) {
            document.location = href;
        }
    });

    //create select lists for flyout menus
    const change = ({currentTarget}) => {
        const link = $('option:selected', currentTarget).data('a');
        if (link) {
            link.click ? link.click() : window.location.assign($(link).attr('href'));
        }
        currentTarget.selectedIndex = -1;
    };

    const transformFlyouts = () => {
        $('#Content .ToggleFlyout, .ButtonGroup, .MeMenu .ToggleFlyout:last').each((ignore, element) => {
            //skip already transformed flyouts
            const flyout = $(element).css('position', 'relative');

            let select;

            if (!flyout.data('hasselectlist')) {
                flyout.data('hasselectlist', true);

                //create a selectlist
                select = $('<select/>').css({
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    opacity: 0
                }).appendTo(flyout);

                //add a dummy option for old stock android browser
                if (stockAndroid || iOS) {
                    select.append('<option>...</option>');
                }

                //extract the text and the url
                $('ul.MenuItems a', flyout).each((ignore, element) => {
                    select.append(
                        $('<option/>')
                            .data('a', element)
                            .text(element.text)
                    );
                });
                //deselect the first (default) option
                select[0].selectedIndex = -1;

                //simulate a click on change
                select.change(change);
            }
        });
    };
    transformFlyouts();

    $(document).on('CommentAdded CommentEditingComplete CommentPagingComplete', transformFlyouts);
});
