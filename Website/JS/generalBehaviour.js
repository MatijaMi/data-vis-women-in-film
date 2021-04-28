window.onscroll = function() {makeSticky()};
function makeSticky() {
    var navbar = document.getElementById("header");
    var sticky = navbar.offsetTop;

    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
} 

function openNav() {
    document.getElementById("mySidepanel").style.width = "250px";
    document.getElementById("sidepanel_button").hidden = true;
}

function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
    document.getElementById("sidepanel_button").hidden = false;
}
document.getElementById("sidepanel_button").addEventListener("click", openNav,false)
document.getElementById("sidePanelClose").addEventListener("click", closeNav,false)
