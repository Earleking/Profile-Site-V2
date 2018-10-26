
$('.interest-entry').mousemove(function(event) {
    var x = event.pageX - (window.innerWidth * .02);
    // x = event.pageX;
    var y = event.pageY - (window.innerHeight * .3);
    // console.log(window.innerHeight);
    if(window.innerWidth < 700) {
        y = event.pageY - (window.innerHeight * .1);
    }

    $('.interest-entry:hover .interest-pop-up').css({left: x, top: y});
});
console.log($('.interest-entry'));