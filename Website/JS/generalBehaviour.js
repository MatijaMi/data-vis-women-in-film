//Make the header sticky
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

//Sidepanel, might get deleted soon tbf
function openNav() {
    document.getElementById("mySidepanel").style.width = "250px";
    document.getElementById("sidepanel_button").hidden = true;
}

function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
    document.getElementById("sidepanel_button").hidden = false;
}
if(document.getElementById("sidepanel_button")!=null){
    document.getElementById("sidepanel_button").addEventListener("click", openNav,false)
}

if(document.getElementById("sidePanelClose")!=null){
    document.getElementById("sidePanelClose").addEventListener("click", closeNav,false)
}
