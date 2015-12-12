$('document').ready(init);

function init() {

    function bindBoardEvents() {
        $('.card').bind('dragstart', function(event) {
            event.originalEvent.dataTransfer.setData("item_id", event.target.getAttribute('id'));
        });

        // bind the dragover event on the board sections
        $('table#board > tbody > tr > td').bind('dragover', function(event) {
            $(event.currentTarget).addClass('current-target');
            event.preventDefault();
        });
        $('table#board > tbody > tr > td').bind('dragleave', function(event) {
            $(event.currentTarget).removeClass('current-target');
        });

        // bind the drop event on the board sections
        $('table#board > tbody > tr > td').bind('drop', function(event) {
            target = event.target;
            $(event.currentTarget).removeClass('current-target');

            // make sure we don't drop a card into another card
            // TODO: check if it's a td
            if ($(event.target).hasClass('card')) {
                target = event.target.parentNode;
            }

            var card_id = event.originalEvent.dataTransfer.getData("item_id");
            var card = document.getElementById(card_id);

            // prevent dragging cards between different stories
            // (could also remember and check story id)
            if ($(event.target).parents('tr').get(0) != $(card.parentNode).parents('tr').get(0)) {
                return;
            }

            // XXX this is very ugly: we should reference states by name, not by column index
            $.post('/task/move',
                {
                    id: card_id,
                    state_idx: target.cellIndex-1  // column number not counting story column

                },
                function () {
                    target.appendChild(card);
                    card.setAttribute('data-state-idx', target.cellIndex)-1
                }
            );


            // Turn off the default behaviour
            // without this, FF will try and go to a URL with your id's name
            event.preventDefault();

        });

        $('.card').editable('/task/rename', {
            indicator: 'Saving...',
            tooltip: 'Click to edit...',
            placeholder: '(Click to edit)',
            cssclass: 'card-edit-form',
            type: 'textarea',
            style: 'inherit',
            submit: 'OK',
            onblur: 'submit',
        });
    };

    function populateBoard() {
        $.getJSON('/data', function(data) {
            $.get('static/js/board.hbs', function (raw_template) {
                var template = Handlebars.compile(raw_template);
                $('table#board').html(template(data));
                bindBoardEvents();
            }, 'html');
        });

    }
    populateBoard();
}
