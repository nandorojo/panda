$(document).ready(function () {

    // global variables

    var $book = $('.book'),
        $stackTrigger = $('.book li'),
        $stack = $('.stack'),
        $deckAdder = $('.deck-Adder'),
        $deck = $('.deck-Editor'),
        $deckIndex = 0,
        $configureTitle = $('.configureTitle'),
        $deckListNew = $('[data-stacktype="deckListNew"]'),
        $deckCreator = $deckListNew.find('[data-decktypecreator]'),
        $deckListCurrent = $('[data-stacktype="deckListCurrent"]'),
        $output = $('.output'),
        googleFontsUrl = "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBmRHB8iK34zJhT3i_QDCESzCS9dmkPzUY",
        notyf = new Notyf({
            delay: 3000
        });

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
    }

    /* HTML reformatter */

    function htmlFormat(html) {
        /* This takes a chunk of html, 
        reformats it to work in jQuery, 
        and then reformats it to properly display in an HTML <code> block.
        It returns a string of text that should get placed as HTML into a text block */
        var reformattedHTML = html.trim().replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/(?:\r\n|\r|\n)/g, '<br />');
        return reformattedHTML;
    };

    // card ID creator

    function cardId(cardIndex, e, currentDeckIndex) {
        var theIdSuffix = e.closest('[id^=deck-]').attr('id').split('-')[2];
        if (theIdSuffix == undefined) {
            theIdSuffix = '';
        } else {
            theIdSuffix = '-' + theIdSuffix;
        }
        e.attr('id', 'card-' + currentDeckIndex + cardIndex + theIdSuffix);
    };

    /* Deck Creator */

    function deckCreator(decktype) {
        $deckIndex = $deckIndex + 1;
        // Add deck to the "current" stack
        var $template = $('[data-decktypetemplate = "' + decktype + '"]'),
            $templateClone = $template.clone().removeAttr('data-decktypetemplate').attr('id', 'deck-' + $deckIndex + '-Display'),
            $templateEditor = $('[data-decktypetemplateeditor = "' + decktype + '"]'),
            $templateEditorClone = $templateEditor.clone().attr('id', 'deck-' + $deckIndex + '-Editor'),
            $deckTitle = $('[data-decktypecreator = "' + decktype + '"]').text().trim(),
            $deckListItemClone = $('[data-decktypecreator = "' + decktype + '"]').clone().removeAttr('data-decktypecreator').attr('id', 'deck-' + $deckIndex + '-ListItem').addClass('deckListCurrentItem');
        if ($template.length > 0 && $templateEditor.length > 0) {
            $templateEditorClone.find('textarea, input').val('')
            $templateClone.appendTo('.display'); // visible in the display screen
            $templateEditorClone.appendTo('.deckEditors'); // the editor is added to the stack
            $deckListItemClone.appendTo('.deckListCurrentItems'); // list item that links to the editor
            // init functions
            notyf.confirm('+ ' + $deckTitle); // notify user of success
            $('[id^="deck-' + $deckIndex + '"]').find('[class*="card-"]').each(function () { // set the unique ID for each card that will then correspond to its output, etc
                var $this = $(this),
                    i = $(this).closest('[id^="deck-' + $deckIndex + '"]').find('[class^="card-"]').index(this); // this indicates the order of this card and matches its editor to its output
                cardId(i, $this, $deckIndex)
            });
        } else {
            notyf.alert("Looks like we haven't coded that one yet")
        }
    };

    // google Fonts API

    function googleFonts() {
        $.getJSON(googleFontsUrl, function (data) {
            $.each(data.items, function (i, font) {
                var fontName = font.family
            });
        });
    };

    /* 
    
    Delegated Dynamic functions
    ============================
    
    Each time we generate content, we must init (delegate) these functions. 
    Thus, we focus on the configure class, which will not be dynamically added or removed, and delegate to children elements.
    This means that if, say, a new deck list item is created later on, it will still be visible by this function, even if it's
    initialized when the document is ready.
    */

    // activate clickable current list item

    $('.configure').on('click', '.deckListCurrentItem', function (e) { // .delegate because of future dynamically added elements
        if ($(this).hasClass('dragged')) return;
        if (e.target == this) {
            var $editorId = $(this).attr('id').replace('ListItem', 'Editor'),
                $theEditor = $('#' + $editorId); // locate deck ID + editor
            if ($theEditor.length > 0) {
                $(this).closest('.stack').removeClass('active');
                $theEditor.addClass('active');
            }
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
        if ($theTyped == '') { // keep button size from shrinking entirely by making the minimum a space bar
            $theCardDisplay.hide();
        } else {
            $theCardDisplay.show();
        }
        $theCardDisplay.text($theTyped);
    });

    // What to do when you stop typing in text areas and inputs within the .configure
    $('.configure').on('focusout', '.deck-Editor textarea, .deck-Editor input', function () {
        // remove highlighted area on the -Display
        var theCardDisplayId = $(this).closest('.card-Editor').attr('id').replace('Editor', 'Display'),
            $theCardDisplay = $('#' + theCardDisplayId);
        if ($theCardDisplay.length > 0) {
            $theCardDisplay.unwrap(); // remove the edited display CSS when you stop typing
        };
    });

    // allow someone to edit the name of a deck (for the editor, mainly)
    $('.configure').on('click', '.pencilIcon', function () {
        var $titleElement = $(this).closest('[id^="deck-"]').find('.deckListItemTitle'),
            currentTitle = $titleElement.text().trim(),
            $editableTitle = $("<input class='deckListItemTitle-Editor' type='text'>");
        $editableTitle.val(currentTitle);
        $titleElement.replaceWith($editableTitle);
        $editableTitle.focus();
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
        var theHtml = $('.display').clone().find('.fullscreenTrigger').remove(),
            stylesheet = $('[data-decktypestylesheetprefix="prefix"]').html();
        theHtml.prepend(stylesheet);
        theHtmlPrinted = theHtml.html();
        downloadFile('index.html', theHtmlPrinted)
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

    $('.configureBack').on('click', function () {
        if ($('.stack').hasClass('active')) { // if it's on the second step, showing a stack
            $('.stack').removeClass('active');
            $('.book').addClass('active');
        } else if ($('.deck-Editor').hasClass('active')) {
            $('.deck-Editor').removeClass('active');
            $('.stack').addClass('active');
        }
    });

    $deckListNew.find('li').on('click', function () { // when clicking to create a new element
        var $deckType = $(this).attr('data-decktypecreator');
        if (typeof $deckType !== typeof undefined && $deckType !== false) {
            deckCreator($deckType); // create new deck function
            $('[data-stacktype="deckListNew"]').slideUp();
        }
    });

    // show + hide configure to make it full screen
    $('.fullscreenTrigger').on('click', function () {
        $(this).closest('page').toggleClass('fullscreen')
    });

    // show the following step when viewing the initial app menu
    $stackTrigger.on('click', function () {
        var $theTrigger = $(this).attr('data-stacktypetrigger'), // this indicates the stack to be shown
            $theStack = $('[data-stacktype="' + $theTrigger + '"]'),
            $theHeader = $(this).text().trim(); // this changes the text banner to show the user what step they're in; // this selects the stack to be shown
        if ($theStack.length == 1) { // if the menu exists
            $book.removeClass('active'); // hide this main menu
            $stack.removeClass('active'); // hide all stakc
            $theStack.addClass('active');
            $configureTitle.text($theHeader);
        }
    });

    $deckAdder.on('click', function () { // show list of options to create (i.e. generate) a new deck
        $deckListNew.slideToggle();
    });

    $('ul.deckListCurrentItems').sortable({
        nested: false,
        pullPlaceholder: false,
        // set $item relative to cursor position
        onDragStart: function ($item, container, _super) {
            var offset = $item.offset(),
                pointer = container.rootGroup.pointer;

            adjustment = {
                top: pointer.top - offset.top
            };

            _super($item, container);
        },
        onDrag: function ($item, position) {
            $item.css({
                top: position.top - adjustment.top
            });
        },
        onCancel: function ($placeholder, container, $closestItemOrContainer) {
            $('.deck-Editor').removeClass('active');
            $('[data-stacktype="deckListCurrent"]').addClass('active');
        }
    });

    if (window.location.hash) {
        var hash = window.location.hash.substring(1), //Puts hash in variable, and removes the # character
            splitHash = hash.replace('#', '').replace('.html', ''),
            $newPage = $("#" + splitHash);
        if ($newPage.length != 0) {
            $('page').removeClass('active');
            $newPage.addClass('active');
        };
    };

    // initialize color droppers
    $('.dropper').spectrum({
        showPalette: true,
        showInput: true,
        preferredFormat: "hex",
        localStorageKey: "spectrum.homepage", // Any Spectrum with the same string will share selection

        // this function will happen whenever a color is chosen from any color dropper
        // it will determine, based on the parent element of the selected color dropper, which function to call
        // the functions it's choosing from will then change the corresponding CSS attributes of the cover

        move: function (color) {
            var $this = $(this),
                $bgColorExists = $this.closest('#coverBackgroundColor').length,
                $textColorExists = $this.closest('#coverTextColor').length;
            if ($bgColorExists == 1) { // if the background dropper exists
                $coverBackgroundColor = $('#coverBackgroundColor .dropper').spectrum('get').toHexString();
                coverBackgroundColor($coverBackgroundColor)
            } else if ($textColorExists == 1) {
                $coverTextColor = $('#coverTextColor .dropper').spectrum('get').toHexString();
                coverTextColor($coverTextColor)
            };
        }
    });

    // show set values as text in the droppers

    $('.dropper').each(function () {
        var $color = $(this).spectrum('get').toHexString();
        $(this).parent().find('.sp-preview-inner').html('<div>' + $color + '</div>')
    });

    // go to correct (in-page) link when you click on a link
    $('a[href$=".html"]').on('click', function (e) { // simulate page changes without actually changing page

        var $currentPage = $('page.active'),
            $link = $(this).attr('href').replace('.html', ''),
            $targetPage = $('#' + $link),
            $this = $(this);
        if ($targetPage.length != 0) {
            e.preventDefault(); // if the <page> exists
            if ($this.attr('target') != '_blank' && !$targetPage.hasClass('active')) { // if it isn't target blank or the current page
                $('page').removeClass('active');
                $targetPage.addClass('active');
            }
        };
        window.location.hash = '#' + $link;
    });
});
