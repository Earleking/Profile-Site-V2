
$('.interest-entry').mousemove(function(event) {
    var x = event.pageX - (window.innerHeight * .05);
    var y = event.pageY - (window.innerHeight * .3);

    $('.interest-entry:hover .interest-pop-up').css({left: x, top: y});
});
console.log($('.interest-entry'));