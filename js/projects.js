$(document).ready(function() {
    $('.card').click(function() {
        window.location = $(this).find("a").attr("href");
        return false;
    });
});
