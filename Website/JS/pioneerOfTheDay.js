//All pioneers with birthdays on this day
var pioneers = [];

//Function that finds the pioneer of the current day for main page
function getPioneerOfTheDay() {
    //Load data
    d3.queue().defer(d3.csv, "./Data/data_modified.csv", function (row) {
            const dob = String(row.DOB) // Get the Day of Birth for the current pioneer
            const mob = String(row.MOB) // Get the Month of Birth for the current pioneer
            const born = "" + mob + " " + dob // Format Date of Birth

            const date = new Date() // Get today Date
            const month = date.toLocaleString('en-us', { month: 'long' }) // Extract the month in long format
            const day = date.getDate() // Extract the day as number
            const today = "" + month + " " + day // Format String the same as it is in the data
            //const debug_today1 = "February 10" // For showcasing if there is no Pioneer born on day of presentation
            //const debug_today2 = "February 11"
            if (born == today) {
                pioneers.push(row);
            }
        }).await(choosePioneer);
}

function choosePioneer(){
        //If there is a pioneer
        if (pioneers.length > 0) {
            const rand = Math.floor(Math.random() * pioneers.length);
            const element = pioneers[rand];
            try {
                document.getElementById("birthday_title").innerText = "Happy Birthday: " + element.name
                document.getElementById("description").hidden = true
                document.getElementById("lived").innerHTML = "<b>Lived</b>:<br>" + element.MOB + " " + element.DOB + ", " + +element.YOB + " - " + element.MOD + " " + element.DOD + ", " + +element.YOD
                var worked = String(element.worked_in)
                worked = worked.split("|").join(", ")
                document.getElementById("worked").innerHTML = "<b>Worked in</b>:<br>\n" + worked
                var aka = String(element.aka)
                aka = aka.split("|").join(", ")
                document.getElementById("aka").innerHTML = "<b>Also known as</b>:<br>\n" + aka

                //Try to load image
                const img_url = new URL(element.image_url)
                document.getElementById("birthday_pic").src = element.image_url
                document.getElementById("birthday_pic").style.display = "inline-block";
            } catch (error) {
                //console.log(error)
                //console.log("No image found for todays pioneer")
                //document.getElementById("pod_title").innerText = "Birthday: " + element.name
                
                document.getElementById("birthday_pic").src = "./Images/Unknown.jpg"
                document.getElementById("birthday_pic").style.display = "inline-block";
            } finally {
                var button = document.getElementById("birthday_contribute_button")
                button.style.display = "none"
                button.addEventListener("click", function (event) {
                    window.open(element.link)
                })
            }
        } 
        //There is no pioneer
        else {
            document.getElementById("birthday_contribute_button").style.display = "";
        }
}

