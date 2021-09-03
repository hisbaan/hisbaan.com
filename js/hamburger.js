$(document).ready(function() {
    $('.menu-toggle').click(function() {
        $('.site-nav').toggleClass('site-nav--open', 200);
        $(this).toggleClass('open');
    });
    $('.site-nav-button').click(function() {
        $('.site-nav').toggleClass('.site-nav--open', 200);
    });
});
// document.addEventListener("DOMContentLoaded", () => {
//     document.querySelector('.menu-toggle').addEventListener("click", (e) => {
//         document.querySelector('.site-nav').classList.toggle('site-nav--open');
//         e.target.classList.toggle('open');
//     })
// })
