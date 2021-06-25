async function generateCharacter(num, char) {
    await fetch(`https://hosted-cors.herokuapp.com/http://www.superheroapi.com/api/10158616269425862/${num}`).then(res => {
        return res.json() //extract JSON object
    }).then(data => {
        //Check if a different character query is needed.
        if (data.powerstats.combat === "null") {
            //query for a different character. 
            let num = Math.floor(Math.random()*731)+1 //Character IDs. Include 731, exclude 0.
            generateCharacter(num, char) 
        } else {
            //select the character's data (HTML elements) to update 
            let name = document.querySelectorAll('.charName')[char],
            img = document.querySelectorAll('.portrait')[char],
            fullName = document.querySelectorAll('.fullName')[char],
            align = document.querySelectorAll('.alignment')[char],
            base = document.querySelectorAll('.base')[char],
            firstAppear = document.querySelectorAll('.firstAppear')[char],
            publisher = document.querySelectorAll('.publisher')[char],
            dialogue = document.querySelectorAll('.dialogue')[char]

            // Some characters have their publisher either incorrectly labeled as their alter-ego, or as "null" - replace with "-".
            if (data.biography.publisher === data.biography['alter-egos'] || data.biography.publisher === "null") {
            publisher.textContent = "-"
            } else {
            publisher.textContent = data.biography.publisher
            }

            //Some characters have an empty string as their full-name value, replace with name value
            if (data.biography['full-name'] === "") { 
            fullName.textContent = data.name
            } else fullName.textContent = data.biography['full-name']

            align.textContent = data.biography.alignment
            base.textContent = data.work.base
            firstAppear.textContent = data.biography['first-appearance']
            img.src=(data.image.url)
            name.textContent = data.name;

            if (data.biography.alignment === "good") {
                dialogue.classList.add('blueDialogue')
                dialogue.classList.remove('redDialogue')
            } else if (data.biography.alignment === "bad") {
                    dialogue.classList.add('redDialogue')
                    dialogue.classList.remove('blueDialogue')
            }

            if (char === 1) { //2nd character
                charTwoStats = new CharStats(data.powerstats) //CharStats is pre-loaded from index.html
            }
            else  {
                charOneStats = new CharStats(data.powerstats)
                currChar = num //save this char's id
            }
        }
    }).catch( (e)=> {
        console.log("API call failure: ", e)
    })
}