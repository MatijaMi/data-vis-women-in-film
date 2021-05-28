function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function render() {
    d3.csv("../Data/data_modified.csv").then(data => {
        var pioneers = []
        data.forEach(element => {
            const dob = String(element.DOB) // Get the Day of Birth for the current pioneer
            const mob = String(element.MOB) // Get the Month of Birth for the current pioneer
            const born = "" + mob + " " + dob // Format Date of Birth

            const date = new Date() // Get today Date
            const month = date.toLocaleString('en-us', { month: 'long' }) // Extract the month in long format
            const day = date.getDate() // Extract the day as number
            const today = "" + month + " " + day // Format String the same as it is in the data
            const debug_today = "February 10" // For showcasing if there is no Pioneer born on day of presentation

            if (born == today) {
                pioneers.push(element)
            }
        });

        if (pioneers.length > 0) {
            const rand = getRandomInt(0, pioneers.length)
            const element = pioneers[rand]
            try {
                const img_url = new URL(element.image_url)
                document.getElementById("birthday_pic").src = img_url
                document.getElementById("birthday_title").innerText = "Happy Birthday: " + element.name
                document.getElementById("description").hidden = true
                document.getElementById("lived").innerText = "Lived:\n" + element.MOB + " " + element.DOB + ", " + +element.YOB + " - " + element.MOD + " " + element.DOD + ", " + +element.YOD
                var worked = String(element.worked_in)
                worked = worked.split("|").join(", ")
                document.getElementById("worked").innerText = "Worked in:\n" + worked
                var aka = String(element.aka)
                aka = aka.split("|").join(", ")
                document.getElementById("aka").innerText = "Also known as:\n" + aka
            } catch (error) {
                console.log("No image found for todays pioneer")
                document.getElementById("pod_title").innerText = "Birthday: " + element.name
            } finally {
                var button = document.getElementById("birthday_discover_button")
                button.style.display = ""
                button.addEventListener("click", function (event) {
                    window.open(element.link)
                })
            }
        } else {
            document.getElementById("birthday_contribute_button").style.display = ""
        }
    })
}
render();