$(document).ready(function() {
    $('.menu-toggle').click(function() {
        $('.site-nav').toggleClass('site-nav--open', 200);
        $(this).toggleClass('open');
    });
});
