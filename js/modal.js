var modal = document.getElementById("modal");
var button = document.getElementById("skill");
var span = document.getElementById("close");

button.onclick = function() {
    modal.style.display = "grid";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
