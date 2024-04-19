function toggleNav() {
    document.querySelector('.site-nav').classList.toggle('site-nav--open');
    document.querySelector('.menu-toggle').classList.toggle('open');
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('.menu-toggle').onclick = toggleNav;
    document.querySelector('.site-nav-button').onclick = toggleNav;
});
