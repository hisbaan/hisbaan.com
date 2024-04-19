let theme = localStorage.getItem('theme');
const themeToggle = document.querySelector('.theme-button');

const enableDark = () => {
    document.body.classList.add('onedark');
    localStorage.setItem('theme', 'onedark');
    themeToggle.innerHTML = `some html here`;
    feather.replace();
}

const disableDark = () => {
    document.body.classList.add('palenight');
    localStorage.setItem('theme', 'palenight');
    themeToggle.innerHTML = `some html here`;
    feather.replace();
}

if (theme == 'onedark') {
    enableDark();
} else {
    disableDark();
}

themeToggle.addEventListener('click', () => {
    darkTheme = localStorage.getItem('darkTheme');
    if (darkTheme !== 'onedark') {
        enableDark();
    } else {
        disableDark();
    }
});
