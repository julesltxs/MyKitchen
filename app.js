document.addEventListener("DOMContentLoaded", function() {
    var navbarContainer = document.getElementById("navbar-container");

    if (navbarContainer) {
        fetch('navbar.html')
            .then(response => response.text())
            .then(data => {
                navbarContainer.innerHTML = data;
                makeSticky(); // Call makeSticky again to apply sticky effect to dynamically loaded navbar
            });
    }
});

window.onscroll = function() {makeSticky()};

var navbar = document.getElementById("navbar");
var sticky = navbar ? navbar.offsetTop : 0;

function makeSticky() {
    if (!navbar) {
        navbar = document.getElementById("navbar");
        sticky = navbar ? navbar.offsetTop : 0;
    }
    
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
}


