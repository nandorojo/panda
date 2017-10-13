$(document).ready(function () {

    'use strict';

    // global variables

    var deckIndex = 0,
        adjustment, // for sortable
        hash,
        $newPage,
        notyf = new Notyf({
            delay: 3000
        }),
        pandaCodeDisplay = [];

    if (localStorage) {
        if (localStorage.getItem('deckIndex')) {
            deckIndex = parseFloat(localStorage.getItem('deckIndex'));
        }
        if (getLocalStorage('decks')) {
            pandaCodeDisplay = getLocalStorage('decks');
        }
    }

    if (window.location.hash) {
        hash = window.location.hash.substring(1).replace('#', '').replace('.html', '');
        $newPage = $("#" + hash);
        if ($newPage.length === 0) {
            return;
        }
        $('.page').removeClass('active');
        $newPage.addClass('active');
        console.log(hash);
    }

    // file upload
    /*    var singleWidget = uploadcare.SingleWidget('[role=uploadcare-uploader]');
        singleWidget.onChange(function (file) {
            if (file) {
                file.done(function (info) {
                    console.log(info.cdnUrl);
                    $('#deck-1-Display').css('background-image', info.cdnUrl);
                }).fail(function (error, fileInfo) {
                    console.log(error)
                });
            };
        });*/

    // function list

    /* save files function */

    function downloadFile(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
        return;
    }

    /* HTML reformatter */

    function htmlFormat(html) {
        /* This takes a chunk of html, 
        reformats it to work in jQuery, 
        and then reformats it to properly display in an HTML <code> block.
        It returns a string of text that should get placed as HTML into a text block */
        var reformattedHTML = html.trim().replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/(?:\r\n|\r|\n)/g, '<br />');
        return reformattedHTML;
    }

    // card ID creator

    function cardId(cardIndex, e, currentdeckIndex) {
        var theIdSuffix = e.closest('[id^=deck-]').attr('id').split('-')[2];
        if (theIdSuffix === undefined) {
            theIdSuffix = '';
        } else {
            theIdSuffix = '-' + theIdSuffix;
        }
        e.attr('id', 'card-' + currentdeckIndex + '-' + cardIndex + theIdSuffix);
        return;
    }

    /* Set local storage */
    // (the parameter that should be edited, the value)
    function setLocalStorage(key, value) {
        // check if browser supports local storage
        if (!localStorage) return;
        // stringify an object if needed, since localstorage requires strings
        if (typeof (value) === 'object') {
            value = JSON.stringify(value)
        }
        localStorage.setItem(key, value);
        return;
    }

    function getLocalStorage(key) {
        // check if browser supports local storage
        if (!localStorage) return;
        // parse a stringified json object
        return JSON.parse(localStorage.getItem(key));
    }

    function resetLocalStorage(key) {
        var resetValue = '';
        if (key === 'deckIndex') {
            resetValue = 0;
        }
        setLocalStorage(key, resetValue);
    }

    function localStoreDecks($storeMe) {
        // object to capture the Deck and its values
        var storeThisObject = {
            cards: []
        };
        storeThisObject.id = $storeMe.attr('id');
        storeThisObject.type = $('#' + $storeMe.attr('id').replace('Display', 'Editor')).attr('data-decktypetemplateeditor');
        $storeMe.find('.card-Display').each(function (number) {
            storeThisObject.cards.push($(this).text().trim());
        });
        storeThisObject.deckIndex = deckIndex;
        pandaCodeDisplay.push(storeThisObject);
        setLocalStorage('decks', pandaCodeDisplay);
        console.log(getLocalStorage('decks'));
    }

    /* Deck Creator */

    function deckCreator(decktype) {
        deckIndex = deckIndex + 1;
        localStorage.setItem('deckIndex', deckIndex);
        // Add deck to the "current" stack
        var $template = $('[data-decktypetemplate = "' + decktype + '"]'),
            $templateClone = $template.clone().removeAttr('data-decktypetemplate').attr('id', 'deck-' + deckIndex + '-Display'),
            $templateEditor = $('[data-decktypetemplateeditor = "' + decktype + '"]'),
            $templateEditorClone = $templateEditor.clone().attr('id', 'deck-' + deckIndex + '-Editor'),
            $deckTitle = $('[data-decktypecreator = "' + decktype + '"]').text().trim(),
            $deckListItemClone = $('[data-decktypecreator = "' + decktype + '"]').clone().removeAttr('data-decktypecreator').attr('id', 'deck-' + deckIndex + '-ListItem').addClass('deckListCurrentItem');
        if ($template.length > 0 && $templateEditor.length > 0) {
            $templateEditorClone.find('textarea, input').val('');
            $templateClone.appendTo('.display').addClass('flashAnimation'); // visible in the display screen
            $templateClone.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).removeClass('flashAnimation'); // remove animation after doing it once
            });
            $templateEditorClone.appendTo('.deckEditors'); // the editor is added to the stack
            $deckListItemClone.appendTo('.deckListCurrentItems').addClass('flashAnimation'); // list item that links to the editor
            $deckListItemClone.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).removeClass('flashAnimation'); // remove animation after doing it once
            });
            localStoreDecks($('#' + $templateClone.attr('id')));
            // init functions
            notyf.confirm('+ ' + $deckTitle); // notify user of success
            $('[id^="deck-' + deckIndex + '"]').find('[class*="card-"]').each(function () { // set the unique ID for each card that will then correspond to its output, etc
                var $this = $(this),
                    i = $(this).closest('[id^="deck-' + deckIndex + '"]').find('[class^="card-"]').index(this); // this indicates the order of this card and matches its editor to its output
                cardId(i, $this, deckIndex);
            });
        } else {
            notyf.alert("Looks like we haven't coded that one yet");
        }
        return;
    }

    // google Fonts API

    function googleFonts() {
        $.getJSON('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBmRHB8iK34zJhT3i_QDCESzCS9dmkPzUY', function (data) {
            $.each(data.items, function (i, font) {
                var fontName = font.family;
            });
        });
    }

    /* 
    
    Delegated Dynamic functions
    ============================
    
    Each time we generate content, we must init (delegate) these functions. 
    Thus, we focus on the configure class, which will not be dynamically added or removed, and delegate to children elements.
    This means that if, say, a new deck list item is created later on, it will still be visible by this function, even if it's
    initialized when the document is ready.
    */

    $('.configure').on('click', function (e) {
        // Should back button be shown or not?
        if (!$('.book').hasClass('active')) {
            $('.configureBack').addClass('active');
        } else {
            $('.configureBack').removeClass('active');
        }
    });

    // activate clickable current list item

    $('.configure').on('click', '.deckListCurrentItem', function (e) { // .delegate because of future dynamically added elements
        var $titleElement,
            currentTitle,
            $editableTitle,
            $editorId,
            $theEditor; // locate deck ID + editor

        // returning function stops the rest from being rendered
        if ($(this).hasClass('dragged')) {
            return;
        } // don't open deck editor if being dragged

        if (!$(e.target).hasClass('deckListItemTitle')) {
            $titleElement = $(this).closest('[id^="deck-"]').find('.deckListItemTitle');
            currentTitle = $titleElement.text().trim();
            $editableTitle = $("<input class='deckListItemTitle-Editor' type='text'>");
            $editableTitle.val(currentTitle);
            $titleElement.replaceWith($editableTitle);
            $editableTitle.focus();
            return;
        }

        // if text is being edited
        if ($('.deckListCurrentItem input').is(':focus')) {
            return;
        }

        // else, render the function to show the deck's editor: 
        $editorId = $(this).attr('id').replace('ListItem', 'Editor');
        $theEditor = $('#' + $editorId); // locate deck ID + editor
        if ($theEditor.length > 0) {
            $(this).closest('.stack').removeClass('active');
            $theEditor.addClass('active');
        }
    });

    // 3 different functions to manage what to do when focusing on / typing a form editor

    // highlight the text that's being edited on the display page
    $('.configure').on('focus', '.deck-Editor textarea, .deck-Editor input', function () {
        var theCardDisplayId = $(this).closest('.card-Editor').attr('id').replace('Editor', 'Display'),
            $theCardDisplay = $('#' + theCardDisplayId),
            theCardDisplayCSS = $theCardDisplay.css('display');
        // remove the edited display CSS when you stop typing
        // also, to fix a mess-up in the display, make it match the cardDisplay's css display attribute.
        $theCardDisplay.wrap('<div class="beingEdited" style="display:' + theCardDisplayCSS + '"></div>');
    });

    // change text on the -Display based on what's typed in the -Editor card.
    $('.configure').on('keyup', '.deck-Editor textarea, .deck-Editor input', function () {
        var $theTyped = $(this).val(),
            // set the display ID according to the editor id
            theCardDisplayId = $(this).closest('.card-Editor').attr('id').replace('Editor', 'Display'),
            $theCardDisplay = $('#' + theCardDisplayId);
        if ($theTyped === '') { // keep button size from shrinking entirely by making the minimum a space bar
            $theCardDisplay.hide();
        } else {
            $theCardDisplay.show();
        }
        $theCardDisplay.text($theTyped);
    });

    $('.configure').on('keypress', 'input, textarea', function (e) {
        if (e.keyCode === 13) { // TODO fix the random error coming up here triggered by a fucked up .focusout
            $(this).blur();
        }
    });

    // What to do when you stop typing in text areas and inputs within the .configure
    $('.configure').on('focusout', '.deck-Editor textarea, .deck-Editor input', function () {
        // remove highlighted area on the -Display
        var theCardDisplayId = $(this).closest('.card-Editor').attr('id').replace('Editor', 'Display'),
            $theCardDisplay = $('#' + theCardDisplayId);
        if ($theCardDisplay.length > 0) {
            $theCardDisplay.unwrap(); // remove the edited display CSS when you stop typing
        }
    });

    // What to do when you stop typing in text areas and inputs within the .configure
    $('.configure').on('focusout', '.deckListCurrentItem input', function () {
        var newTitle = $(this).val().trim(),
            $newListTitleElement = $('<div class="deckListItemTitle"></div>').text(newTitle),
            deckEditorId = $(this).closest('[id^="deck-"]').attr('id').replace('ListItem', 'Editor'),
            $deckEditorTitle = $('#' + deckEditorId).find('.deck-Title');
        $(this).replaceWith($newListTitleElement);
        $deckEditorTitle.text(newTitle);
    });

    $('.configure').on('click', '.exportTrigger', function () {
        var theHtml = $('.display').clone().remove('.fullscreenTrigger'),
            theHtmlPrinted = theHtml.html(),
            stylesheet = $('[data-decktypestylesheetprefix="prefix"]').html();
        theHtml.prepend(stylesheet);
        downloadFile('index.html', theHtmlPrinted);
    });

    $('.configure').on('click', '.deckDelete', function () {
        var $theDeckToDelete = $(this).closest('.deck-Editor'),
            theDeckToDeleteListItemId = $theDeckToDelete.attr('id').replace('Editor', 'ListItem'),
            $theDeckToDeleteListItem = $('#' + theDeckToDeleteListItemId),
            theDeckToDeleteDisplayId = $theDeckToDelete.attr('id').replace('Editor', 'Display'),
            $theDeckToDeleteDisplay = $('#' + theDeckToDeleteDisplayId);
        $theDeckToDelete.remove();
        $theDeckToDeleteDisplay.remove();
        $theDeckToDeleteListItem.remove();
        $('.stack').addClass('active');
    });

    /*
    
    DOM (ready) static functions
    ============================
    
    */

    //////////////////////////////////////
    // STATIC SETTINGS

    // Typography settings

    if (getLocalStorage('typography')) {
        $('[data-stacktype="typography"] select').val(getLocalStorage('typography').font);
    }

    $('[data-stacktype="typography"] select').on('change', function () {
        setLocalStorage('typography', {
            font: $(this).val()
        });
        console.log(getLocalStorage('typography'));
    });

    $('.configureBack').on('click', function () {
        if ($('.stack').hasClass('active')) { // if it's on the second step, showing a stack
            $('.stack').removeClass('active');
            $('.book').addClass('active');
        } else if ($('.deck-Editor').hasClass('active')) {
            $('.deck-Editor').removeClass('active');
            $('[data-stacktype="deckListCurrent"]').addClass('active');
        }
    });

    $('[data-stacktype="deckListNew"]').find('li').on('click', function () { // when clicking to create a new element
        var $deckType = $(this).attr('data-decktypecreator');
        if (typeof $deckType !== typeof undefined && $deckType !== false) {
            deckCreator($deckType); // create new deck function
            $('[data-stacktype="deckListNew"]').slideUp();
        }
    });

    // show + hide configure to make it full screen
    $('.fullscreenTrigger').on('click', function () {
        $(this).closest('page').toggleClass('fullscreen');
    });

    // show the following step when viewing the initial app menu
    $('.book li').on('click', function () {
        var $theTrigger = $(this).attr('data-stacktypetrigger'), // this indicates the stack to be shown
            $theStack = $('[data-stacktype="' + $theTrigger + '"]'),
            $theHeader = $(this).text().trim(); // this changes the text banner to show the user what step they're in; // this selects the stack to be shown
        if ($theStack.length === 1) { // if the menu exists
            $('.book').removeClass('active'); // hide this main menu
            $('.stack').removeClass('active'); // hide all stakc
            $theStack.addClass('active');
            $('.configureTitle').text($theHeader);
        }
    });

    $('.deck-Adder').on('click', function () { // show list of options to create (i.e. generate) a new deck
        $('[data-stacktype="deckListNew"]').slideToggle();
    });

    $('ul.deckListCurrentItems').sortable({
        nested: false,
        pullPlaceholder: '<li class="deckListCurrentItem" />',
        // set $item relative to cursor position
        onDragStart: function ($item, container, _super) {
            var offset = $item.offset(),
                pointer = container.rootGroup.pointer;

            adjustment = {
                top: pointer.top - offset.top
            };

            _super($item, container);

            // Highlight the actual object being moved in the display
            var $theMovedDisplay = $('#' + $item.attr('id').replace('ListItem', 'Display'));
            $theMovedDisplay.addClass('flashBeingMoved');

        },
        onDrag: function ($item, position) {
            $item.css({
                top: position.top - adjustment.top
            });
        },
        onCancel: function ($placeholder, container, $closestItemOrContainer) {
            $('.deck-Editor').removeClass('active');
            $('[data-stacktype="deckListCurrent"]').addClass('active');
        },
        onDrop: function ($item, container, _super, event) {
            $item.removeClass(container.group.options.draggedClass).removeAttr("style");
            $("body").removeClass(container.group.options.bodyClass);

            // set order of re-ordered list items
            $('.deckListCurrentItem').each(function (i) {
                $(this).attr('data-deckOrder-ListItem', i);
                var theDisplayId = $(this).attr('id').replace('ListItem', 'Display');
                $('#' + theDisplayId).attr('data-deckOrder-Display', i);
            });

            // REARRANGE CORRESPONDING DECK DISPLAYS
            // dependency: tinysort

            tinysort('.deck-Display', {
                attr: 'data-deckOrder-Display'
            });

            // show a flash animation on the list item and display of what was moved
            // first is the HTML ID # of display, second of list item
            $('#' + $item.attr('id').replace('ListItem', 'Display')).removeClass('flashBeingMoved');
            $('#' + $item.attr('id').replace('ListItem', 'Display') + ', #' + $item.attr('id')).addClass('flashAnimation');
            $('#' + $item.attr('id').replace('ListItem', 'Display') + ', #' + $item.attr('id')).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).removeClass('flashAnimation'); // remove animation after doing it once
            });

            // STORE THE REARRANGED ELEMENTS
            pandaCodeDisplay = [];
            $('.deck-Display').each(function () {
                localStoreDecks($(this));
            });
        }
    });

    // go to correct (in-page) link when you click on a link
    $('[data-pageTarget]').on('click', function (e) { // simulate page changes without actually changing page

        var link = $(this).attr('data-pagetarget'),
            $targetPage = $('#' + link);
        if ($targetPage.length !== 0) {
            e.preventDefault(); // if the <page> exists
            if ($(this).attr('target') !== '_blank' && !$targetPage.hasClass('active')) { // if it isn't target blank or the current page
                $('.page').removeClass('active');
                $targetPage.addClass('active');
            }
        }
        window.location.hash = link;
    });
});
