window.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const button = document.getElementById("skill");
    const span = document.getElementById("close");

    button.onclick = function () {
        modal.style.display = "grid";
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
})