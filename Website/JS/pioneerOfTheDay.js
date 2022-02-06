//Function that finds the pioneer of the current day for main page
function getPioneerOfTheDay() {

    //Data
    var pioneers = getAllPioneers();

    //Filter
    pioneers = pioneers.filter(pioneer => new Date().getDate() == pioneer.birth_date.getDate() && new Date().getMonth() == pioneer.birth_date.getMonth());

    //No birthdays
    if (pioneers.length == 0) {
        //Don't show contribute button
        document.getElementById("birthday_contribute_button").style.display = "";
    }
    else {
        //Get random pioneer in list
        const rand = Math.floor(Math.random() * pioneers.length);
        const pioneer = pioneers[rand];

        try {
            //Set values
            document.getElementById("birthday_title").innerText = "Happy Birthday: " + pioneer.name;
            document.getElementById("description").hidden = true;
            document.getElementById("lived").innerHTML = "<b>Lived</b>:<br>" + pioneer.birth_date.toDateString().split(' ').slice(1).join(' ') + " - " + pioneer.death_date.toDateString().split(' ').slice(1).join(' ');
            document.getElementById("worked").innerHTML = "<b>Worked in</b>:<br>\n" + pioneer.worked_in.join(", ");
            document.getElementById("aka").innerHTML = "<b>Also known as</b>:<br>\n" + pioneer.aka.join(", ");
            document.getElementById("birthday_pic").src = pioneer.image_url;
            document.getElementById("birthday_pic").style.display = "inline-block";
        } catch (error) {
            //Error setting values
            console.log("Error setting pioneer of the day values " + error);
            document.getElementById("birthday_pic").src = "Images/Unknown.jpg";
            document.getElementById("birthday_pic").style.display = "inline-block";
        } finally {
            //Link button
            var button = document.getElementById("birthday_contribute_button");
            button.style.display = "none";
            button.addEventListener("click", function (event) {
                window.open(element.link);
            })
        }
    }
}
