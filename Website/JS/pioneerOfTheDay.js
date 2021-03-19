import { csv } from "d3";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

csv("/Website/Data/complete_data.csv").then(data => {
    var pods = []
    data.forEach(element => {
        const dob = String(element.DOB) // Get the Date of Birth for the current pioneer

        const date = new Date() // Get today Date
        const month = date.toLocaleString('en-us', { month: 'long' }) // Extract the month in long format
        const day = date.getDate() // Extract the day as number
        const today = "" + month + " " + day // Format String the same as it is in the data
        const debug_today = "February 10" // For showcasing if there is no Pioneer born on day of presentation

        if (dob == debug_today){
            pods.push(element)
        }
    });

    if (pods.length > 0) {
        const rand = getRandomInt(0, pods.length)
        const element = pods[rand]
        try {
            const img_url = new URL(element.image_url)
            document.getElementById("pioneer_of_the_day").src = img_url
            document.getElementById("pod_title").innerText = "Birthday: " + element.name
            document.getElementById("description").remove()
            document.getElementById("address").remove()
            document.getElementById("lived").innerText = "Lived:\n" + element.DOB + ", " + element.YOB + " - " + element.DOD + ", " + element.YOD
            var worked = String(element.worked_in)
            worked = worked.split("|").join(", ")
            document.getElementById("worked").innerText = "Worked in:\n" + worked
            var aka = String(element.aka)
            aka = aka.split("|").join(", ")
            document.getElementById("aka").innerText = "Also known as:\n" + aka
        } catch (error) {
            console.log("No image found for todays pioneer")
            document.getElementById("pod_title").innerText = "Birthday: " + element.name
        }
        var btn = document.createElement("BUTTON")
        btn.innerText = "Discover"
        btn.className = "content_button"
        btn.addEventListener("click", function(event) {
            window.open(element.link)
        })
        document.getElementById("pod_panel").appendChild(btn)
    }
})