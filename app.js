window.onscroll = function() {makeSticky()};

var navbar;
var sticky;

document.addEventListener("DOMContentLoaded", function () {
    var navbarContainer = document.getElementById("navbar-container");
    
    if (navbarContainer) {
        fetch('navbar.html')
            .then(response => response.text())
            .then(data => {
                navbarContainer.innerHTML = data;
                navbar = document.getElementById("navbar");
                sticky = navbar.offsetTop;
            });
    }
});

function makeSticky() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
}
