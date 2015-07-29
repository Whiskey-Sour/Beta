var about = function () {
    var $storySection,
        $button,
        storyContent,
        $storySubsection;

    drawControlsSection();

    $storySection = $('<div>').attr('id', 'story');
    $($storySection).appendTo('body');

    storyContent = 'The trainers at Telerik Academy thought it would be fun to have some robots running around the building. '
        + 'Unfortunately, things got out of hand and now the only one left is a young apprentice called John. '
        + 'In order to stop the robots he must learn how to code. Help him collect all JavaScript logos!';

    $storySubsection = $('<p/>')
        .attr('id', 'story-subsection')
        .text(storyContent);

    $($storySubsection).appendTo($storySection);

    $button = $('<button>').attr('id', 'btn-back');
    $($button).appendTo($storySection);
    $('#btn-back').on('click', function() {
        $('svg').remove();
        $($storySection).remove();
        menu();
    });

    function drawControlsSection() {
        var paper = Snap(CONSTANTS.screen.width, CONSTANTS.screen.height / 2),
            rectSide = 60,
            initialRectX = 160,
            initialRectY = 110,
            transformingMatrix = new Snap.Matrix(),
            header,
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

        paper.rect(0, 0, CONSTANTS.screen.width, CONSTANTS.screen.height / 2)
            .attr({
                fill: '#CCC',
                opacity: 0.5
            });

        header = paper.text(30, 50, 'About')
            .attr({
                fontSize: 45,
                fontFamily: 'Times New Roman',
                fill: '#72BF44'
            });

        transformingMatrix.translate(100, 100);
        transformingMatrix.rotate(90, 0, 0);
        header.animate({transform: transformingMatrix}, 2000, mina.bounce);

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

        circle = paper.circle(735, 40, 18);
        bombUpper = paper.rect(730, 17, 10, 6);
        miniRect = paper.rect(734, 10, 2, 5)
            .attr({
                fill: 'red'
            });
        bomb = paper.group(circle, bombUpper, miniRect);
        bomb.animate({ transform: 't-660, 10' }, 2000, mina.bounce);
    }
};
