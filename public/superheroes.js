
let panelStage = 0, //var to track the msgs shown by the left side comic panel guide.
charOneScore = 0, charTwoScore = 0, statsShown = 0, winStreak = 0, currChar = 0
const icons = ['fa-brain', 'fa-dumbbell', 'fa-running', 'fa-shield-alt', 'fa-burn', 'fa-fist-raised']
//Wake apis with a start-up request:
fetch('https://hosted-cors.herokuapp.com/http://www.superheroapi.com/api/10158616269425862/1') 

class CharStats {
    constructor({intelligence, strength, speed, durability, power, combat}) {
        this.intelligence = intelligence;
        this.strength = strength;
        this.speed = speed; 
        this.durability = durability;
        this.power = power;
        this.combat = combat;
    }
}

//initial setup
const setupBtns = () => {
    let btn = document.querySelector('.btn'), btnTwo = document.querySelector('.btn:nth-of-type(2)')

    btn.classList.add('animate')
    btn.addEventListener("click", () => {
            let num = Math.floor(Math.random()*731)+1 //Character IDs. Include 731, exclude 0.
            generateCharacter(num, 0)
            if (panelStage === 0) {
                managePanel();
            }
        }) 
    btnTwo.classList.add('animate')
    btnTwo.addEventListener("click", () => {
        btn.classList.add('btnDisappear'), btnTwo.classList.add('btnDisappear')
        btnTwo.classList.remove('appear')
        managePanel() 
        setTimeout(()=> {
            btn.remove(), btnTwo.remove()
        }, 500)
    }) 
}

setupBtns()

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
            //select a character's ui pieces to update 
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
                charTwoStats = new CharStats(data.powerstats)
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

const managePanel = () => {
    let comicPane = document.querySelector('.comic-pane')
    if (panelStage === 0) {
        btnTwo = document.querySelector('.btn:nth-of-type(2)')
        setTimeout(()=> {
            comicPane.classList.add('fadeOut')
            setTimeout(()=> {
                comicPane.classList.remove('fadeOut'), comicPane.classList.add('fadeIn')
                let comicPaneTxt = document.querySelector('.text')
                comicPaneTxt.innerHTML = "<p>After you have a character you'd like to see battle, click the <strong>BATTLE</strong> button. </p>"
                btnTwo.classList.remove('hiddenBtn') //reveal Battle button
                btnTwo.classList.add('appear')
                panelStage++
            }, 800)
        }, 600)
    } else if (panelStage === 1) {
        comicPane.classList.add('fadeOut') 
        setTimeout(()=> {
            document.querySelector('row').classList.add('col')
            setTimeout(prepBattleArea, 1000)
        }, 700)
    }
}

const prepBattleArea = () => {
    let battleArea = document.createElement('div'),
    row = document.querySelector('.row')

    row.classList.remove('col'), row.classList.add('colFinalState')

    let newRow = row.cloneNode(true),
    middleRow = row.cloneNode(false),
    middleDialogue = document.querySelector('.comic-pane').cloneNode(true)

    middleDialogue.classList.add('midPanel')

    battleArea.classList.add('battleArea')
    document.body.appendChild(battleArea)
    battleArea.appendChild(row), battleArea.appendChild(middleRow), battleArea.appendChild(newRow)

    clearCharUI(1) //clear data from the newly generated character two

    let num = Math.floor(Math.random()*731)+1 //Character IDs. Include 731, exclude 0.
    generateCharacter(num, 1)

    setTimeout(()=> {
        document.body.insertBefore(middleDialogue, battleArea)
        middleDialogue.classList.remove('fadeInLeft', 'fadeOutLeft')
        middleDialogue.classList.add('fadeInTop')
        document.querySelectorAll('.text p')[1].innerHTML = "<p>The characters' <strong>powerstats</strong> will now be compared one at a time, rewarding points to the character that has a higher value for that stat. Click <strong>BEGIN</strong> to proceed.</p>"
        setTimeout(()=> {
            newBtn = document.createElement('button')
            newBtn.classList.add('btn', 'animate', 'battleBtn', 'appear')
            newBtn.innerHTML = "<strong>BEGIN</strong>"
            middleRow.appendChild(newBtn)
            newBtn.addEventListener('click', ()=> {
                middleDialogue.classList.add('fadeOutTop')
                newBtn.classList.add('btnDisappear')
                newBtn.classList.remove('appear')
                setTimeout(updateBattleUi, 400)
            })
        }, 1200)
    }, 400)
}

const updateBattleUi = () => {
    let firstUl = document.querySelector('ul'),
    secondUl = document.querySelectorAll('ul')[1]

    //if stats about to appear for the first time
    if (statsShown === 0) {
        document.querySelector('.btn:nth-of-type(1)').remove()
        firstUl.classList.add('btnDisappear')
        secondUl.classList.add('btnDisappear')
    }

    setTimeout(()=> {
        //if stats about to appear for the first time
        if (statsShown === 0) {
            firstUl.innerHTML = '<li>Score: <span class="charScore"></span></li>'
            firstUl.classList.remove('btnDisappear')
            secondUl.innerHTML = '<li>Score: <span class="charTwoScore"></span></li>'
            secondUl.classList.remove('btnDisappear')
            document.querySelector('.charScore').textContent = charOneScore
            document.querySelector('.charTwoScore').textContent = charTwoScore
        }
        displayBattleStat(Object.keys(charOneStats)[statsShown], icons[statsShown])
    }, 600)
}

//Battle: Character stats are displayed and compared one-by-one.
const displayBattleStat = (stat, icon) => {
    let firstUl = document.querySelector('ul'), secondUl = document.querySelectorAll('ul')[1],
    middleDialogue = document.querySelectorAll('.comic-pane')[1],
    displayStat = (stat.charAt(0).toUpperCase() + stat.slice(1)),
    classOne = `charOne${displayStat}`, classTwo = `charTwo${displayStat}`,
    bannerOne = document.querySelector('.portraitBanner'), bannerTwo = document.querySelectorAll('.portraitBanner')[1],
    advantage = 0;

    //create battle dialogue
    document.querySelectorAll('.text p')[1].innerHTML = `<p><strong>${displayStat} </strong> &nbsp <i class='fas ${icon}'></i></p>`

    middleDialogue.classList.add('fadeInTop', 'statPanel', 'stat')
    middleDialogue.classList.remove('fadeOutTop','fadeIn', 'fadeOut')

    bannerOne.classList.remove('appear'), bannerTwo.classList.remove('appear')
    
    setTimeout(()=> {     
        middleDialogue.classList.remove('fadeInTop'), middleDialogue.classList.add('fadeOutTop')

        //update stat lists as the stats are revealed
        firstUl.innerHTML +=`<li>${displayStat}: <span class="${classOne}"></span></li>`
        secondUl.innerHTML +=`<li>${displayStat}: <span class="${classTwo}"></span></li>`
        document.querySelector('.'+classOne).textContent = charOneStats[stat]
        document.querySelector('.'+classTwo).textContent = charTwoStats[stat]

        //compare character stats
        if (Number(charOneStats[Object.keys(charOneStats)[statsShown]]) > Number(charTwoStats[Object.keys(charTwoStats)[statsShown]])) {
            bannerOne.classList.add('appear')
            bannerOne.classList.remove('btnDisappear')
            advantage = 0;
            charOneScore += 50;
            document.querySelector('.charScore').textContent = charOneScore
        } else if (Number(charOneStats[Object.keys(charOneStats)[statsShown]]) < Number(charTwoStats[Object.keys(charTwoStats)[statsShown]])) {
            bannerTwo.classList.add('appear')
            bannerTwo.classList.remove('btnDisappear')       
            advantage = 1; 
            charTwoScore += 50;   
            document.querySelector('.charTwoScore').textContent = charTwoScore
        } else advantage = 2 //no point reward if evenly matched on a stat
            
        statsShown++

        setTimeout(()=> {
            if (statsShown < Object.keys(charOneStats).length) { 
                updateBattleUi() //proceed with comparing more character stats
                if (advantage === 0)
                    bannerOne.classList.add('btnDisappear')
                else if (advantage === 1) {
                    bannerTwo.classList.add('btnDisappear')
                }
            } else setTimeout(displayBattleConclusion, 600)
        }, 400)
    }, 1500)
}

const displayBattleConclusion = () => {
        let bannerOne = document.querySelector('.portraitBanner'), bannerTwo = document.querySelectorAll('.portraitBanner')[1]

        if (charOneScore > charTwoScore) {
            if (bannerOne.classList.contains('btnDisappear')) {
                bannerOne.classList.remove('btnDisappear'), bannerOne.classList.add('appear')
            }

            if (bannerTwo.classList.contains('appear')) {
                bannerTwo.classList.add('btnDisappear'), bannerTwo.classList.remove('appear')
            }

            bannerOne.textContent = "Winner"
            document.querySelector('.charName').innerHTML += "&nbsp <i class='fas fa-trophy'></i>"
            winStreak += 1
            setupPostBattle('Your character has <strong>WON</strong>!')
        } else if (charOneScore < charTwoScore) {
            if (bannerTwo.classList.contains('btnDisappear')) {
                bannerTwo.classList.remove('btnDisappear'), bannerTwo.classList.add('appear')
            }

            if (bannerOne.classList.contains('appear')) {
                bannerOne.classList.add('btnDisappear'), bannerOne.classList.remove('appear')
            }

            bannerTwo.textContent = "Winner"
            document.querySelectorAll('.charName')[1].innerHTML += "&nbsp <i class='fas fa-trophy'></i>"
            winStreak = 0
            setupPostBattle('Better luck next time.')
        } else {
            if (bannerOne.classList.contains('appear')) {
                bannerOne.classList.add('btnDisappear'), bannerOne.classList.remove('appear')
            }
            if (bannerTwo.classList.contains('appear')) {
                bannerTwo.classList.add('btnDisappear'), bannerTwo.classList.remove('appear')
            }
            setupPostBattle('The characters are evenly matched. A draw <strong>does not</strong> reset your win streak.')
        }
}

const setupPostBattle = (msg) => {
    let midPanel = document.querySelector('.stat'), midRow = document.querySelector('row:nth-of-type(2)'),
    firstUl = document.querySelector('ul'), secondUl = document.querySelectorAll('ul')[1],
    bannerOne = document.querySelector('.portraitBanner'), bannerTwo = document.querySelectorAll('.portraitBanner')[1],

    defaultHTML = "<li>Full Name: <span class='fullName'></span></li> <li>Alignment: <span class='alignment'></span></li> <li>Base: <span class='base'></span> </li> <li>First Appearance: <span class='firstAppear'></span></li> <li>Publisher: <span class='publisher'></span></li>"

    midPanel.classList.remove('stat', 'statPanel', 'fadeOutTop'), midPanel.classList.add('fadeInTop')
    document.querySelectorAll('.text p')[1].innerHTML = `<p>${msg}<br>Win Streak: ${winStreak}</p>`

    setTimeout(()=> {
        let newBtn = document.createElement('button'), newBtnTwo = document.createElement('button')

        newBtn.classList.add('btn', 'animate', 'battleBtnTwo', 'appear')
        newBtn.innerHTML = "<strong>NEXT OPPONENT</strong>"
        midRow.appendChild(newBtn)

        newBtnTwo.classList.add('btn', 'animate', 'battleBtnTwo', 'appear', 'top')
        newBtnTwo.innerHTML = "<strong>RETURN HOME</strong>"
        midRow.appendChild(newBtnTwo)

        newBtnTwo.addEventListener('click', () => {
            location.href = "index.html" //refresh the page
        })

        newBtn.addEventListener('click', ()=> {
            //wipe the 2nd character's data
            document.querySelectorAll('.charName')[1].textContent = ''
            document.querySelectorAll('.portrait')[1].src = "unknownChar.jpg"
            firstUl.innerHTML = defaultHTML, secondUl.innerHTML = defaultHTML
            
            if (bannerOne.classList.contains('appear')) {
                bannerOne.classList.add('btnDisappear'), bannerOne.classList.remove('appear')
            }
            if (bannerTwo.classList.contains('appear')) {
                bannerTwo.classList.add('btnDisappear'), bannerTwo.classList.remove('appear')
            }

            let num = Math.floor(Math.random()*731)+1 //Character IDs. Include 731, exclude 0.
            generateCharacter(num, 1), generateCharacter(currChar, 0)

            midPanel.classList.add('fadeOutTop'), midPanel.classList.remove('fadeInTop')
            newBtn.classList.add('btnDisappear'), newBtnTwo.classList.add('btnDisappear')
            newBtn.classList.remove('appear'), newBtnTwo.classList.remove('appear')
            statsShown = 0, charOneScore = 0, charTwoScore = 0

            setTimeout(() => {
                newBtn.remove(), newBtnTwo.remove()
                midPanel.classList.add('fadeInTop'), midPanel.classList.remove('fadeOutTop')
                document.querySelectorAll('.text p')[1].innerHTML = "<p>The characters' <strong>powerstats</strong> will now be compared one at a time, rewarding points to the character that has a higher value for that stat. Click <strong>BEGIN</strong> to proceed.</p>"
                setTimeout(()=> {
                    newestBtn = document.createElement('button')
                    newestBtn.classList.add('btn', 'animate', 'battleBtn', 'appear')
                    newestBtn.innerHTML = "<strong>BEGIN</strong>"

                    //reset the popup banners' text from "winner"
                    bannerOne.innerText = "ADVANTAGE", bannerTwo.innerText = "ADVANTAGE"

                    midRow.appendChild(newestBtn)
                    newestBtn.addEventListener('click', ()=> {
                        midPanel.classList.add('fadeOutTop'), midPanel.classList.remove('fadeInTop')
                        newestBtn.classList.add('btnDisappear')
                        newestBtn.classList.remove('appear')
                        setTimeout(updateBattleUi, 400)
                    })
                }, 1200)
            }, 600)
        })
    }, 1100)
}

const clearCharUI = (char) => {
    document.querySelectorAll('.portrait')[char].src="unknownChar.jpg"
    //select a character's ui pieces to update
    const ui = [document.querySelectorAll('.charName')[char], document.querySelectorAll('.fullName')
    [char], document.querySelectorAll('.alignment')[char], document.querySelectorAll('.base')[char],
    document.querySelectorAll('.firstAppear')[char], document.querySelectorAll('.publisher')[char]]

    for (piece in ui) {
        ui[piece].textContent = ''
    }
}