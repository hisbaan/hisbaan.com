indow.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const buttons = document.getElementsByClassName("skill");
    const popups = document.getElementsByClassName("skill-popup");
    const closeButtons = document.getElementsByClassName("close-skill-popup");

    // Popuplate the key-value pair linking the skill of the popup to the popup.
    let popupsIndex = {};
    for (i = 0; i < popups.length; i++) {
        popupsIndex[popups[i].dataset.skill] = popups[i]
    }

    // Track the curren popup to eliminate the need for iterating through
    //  entire list of popups
    let openPopup = popups[0]

    for(i = 0; i < buttons.length; i++) {
        let skill = buttons[i].dataset.skill
        // Set onclick for all the buttons
        buttons[i].onclick = function () {
            // Toggle the popup background
            modal.style.display = "grid";
            popupsIndex[skill].style.display = "block";
            // Update openPopup
            openPopup = popupsIndex[skill]
        }
    }

    // Set onclick for the popup background to close the popup.
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            openPopup.style.display = "none";
        }
    }

    // Set onclick for the popup background to close the popup.
    for(i = 0; i < closeButtons.length; i++) {
        closeButtons[i].onclick = function () {
            modal.style.display = "none";
            openPopup.style.display = "none";
        }
    }
})
