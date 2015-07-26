var Menu = function() {
        var divIdName = 'game-menu',
            buttonsIdNames = ['btn-play', 'btn-highscores', 'btn-about'],
            buttonsIdNamesLen = buttonsIdNames.length;

        // document.body.onload = addMenu;
        addMenu();

        function addMenu () {
            addDiv();
            addButtons();
            addEvents();
        }

        function addDiv() {
            var $div = $('<div>').attr('id', divIdName);
            $($div).appendTo('body');
        }

        function addButtons() {
            var $buttonContainer = ('#' + divIdName),
                currentIdName,
                $button,
                i;

            for (i = 0; i < buttonsIdNamesLen; i += 1) {
                currentIdName = buttonsIdNames[i];
                $button = $('<button>').attr('id', currentIdName);

                $($button).appendTo($buttonContainer);
            }
        }

        function addEvents() {
            var buttonIdName = buttonsIdNames[0];

            $('#' + buttonIdName).on('click', function() {
                // probably should remove div from DOM
                // Play the game
                $('#' + divIdName).remove();
                Play();
            });

            buttonIdName = buttonsIdNames[1];
            $('#' + buttonIdName).on('click', function() {
                // probably should remove div from DOM
                // Show High scores
            });

            buttonIdName = buttonsIdNames[2];
            $('#' + buttonIdName).on('click', function() {
                // probably should remove div from DOM
                // Show About
            });
        }
};
