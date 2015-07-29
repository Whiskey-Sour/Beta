var about = function() {
    var $storyDiv,
        $button;

    drawSvg();

    $storyDiv = $('<div>').attr('id', 'story');
    $($storyDiv).appendTo('body');

    $button = $('<button>').attr('id', 'btn-back');
    $($button).appendTo($storyDiv);
    $('#btn-back').on('click', function() {
        $('svg').remove();
        $($storyDiv).remove();
        Menu();
    });

    function drawSvg() {
        var paper = Snap(800, 500),
            rectSide = 60,
            initialRectX = 160,
            initialRectY = 110,
            text,
            timing,
            moveText,
            spaceText,
            fireText,
            textsMoveFire,
            rectUpperArrow,
            rectLeftArrow,
            rectRightArrow,
            rectSpace,
            rectControls,
            arrowUp,
            arrowLeft,
            arrowRight,
            bomb,
            circle,
            bombUpper,
            miniRect;

        paper.rect(0, 0, 800, 500)
            .attr({
                fill: '#CCC',
                opacity: 0.5
            });
        //Animate title about
        text = 'about';
        timing = 750;
        (function() {
            var svgTextElement = paper.text(350, 80, text).attr({
                fontSize: '120px',
                opacity: 0,
                fill: '#72BF44',
                stroke: 'black',
                strokeWidth: 2,
                textAnchor: "middle"
            });

            setTimeout(function() {
                Snap.animate(0, 1, function(value) {

                    svgTextElement.attr({
                        'font-size': value * 100,
                        opacity: value
                    });
                }, timing, mina.bounce);
            }, timing);
        }());
        
        rectUpperArrow = paper.rect(initialRectX, initialRectY, rectSide, rectSide);
        arrowUp = paper.path('M190 120 L190 160 M190 120 L170 140 M190 120 L210 140')
            .attr({
                stroke: 'black'
            });

        rectLeftArrow = rectUpperArrow.clone()
            .attr({
                x: initialRectX - (rectSide + 4),
                y: initialRectY + rectSide
            });

        arrowLeft = paper.path('M106 200 L146 200 M106 200 L126 180 M106 200 L126 220')
            .attr({
                stroke: 'black'
            });

        rectRightArrow = rectUpperArrow.clone()
            .attr({
                x: initialRectX + (rectSide + 4),
                y: initialRectY + rectSide
            });

        arrowRight = paper.path('M235 200 L275 200 L255 180 M275 200 L255 220')
            .attr({
                fill: 'none',
                stroke: 'black'
            });

        rectSpace = paper.rect(430, 200, rectSide * 3, rectSide / 2);
        spaceText = paper.text(500, 220, 'SPACE')
            .attr({
                fontSize: 15,
                fontFamily: 'Times New Roman',
                fill: '#000'
            });


        rectControls = paper.group(rectUpperArrow, rectLeftArrow, rectRightArrow, rectSpace)
            .attr({
                fill: 'none',
                stroke: '#000',
                strokeWidth: 2
            });


        moveText = paper.text(initialRectX, 260, 'MOVE');
        fireText = paper.text(500, 260, 'FIRE');
        textsMoveFire = paper.group(moveText, fireText)
            .attr({
                fontFamily: 'Times New Roman',
                fontSize: 20,
                fontWeight: 900,
                fill: '#72BF44'
            });

        circle = paper.circle(765, 50, 20);
        bombUpper = paper.rect(760, 26, 13, 8);
        miniRect = paper.rect(764, 21, 5, 8)
            .attr({
                fill: 'red'
            });
        bomb = paper.group(circle, bombUpper, miniRect);
        bomb.animate({
            transform: 't-560, 10'
        }, 2000, mina.bounce);
    }
};
