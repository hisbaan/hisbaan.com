$(document).ready(function() {
    $('.menu-toggle').click(function() {
        $('.site-nav').toggleClass('site-nav--open', 200);
        $(this).toggleClass('open');
    });
    $('.site-nav-buttons').click(function() {
        $('.site-nav').toggleClass('.site-nav--open', 200);
        $('.menu-toggle').toggleClass('open');
    });
});

// document.addEventListener("DOMContentLoaded", () => {
//     document.querySelector('.menu-toggle').addEventListener("click", (e) => {
//         document.querySelector('.site-nav').classList.toggle('site-nav--open', 200);
//         // e.target.classList.toggle('open');

//         document.querySelector(this).classList.toggle('open');
//     });
// });
