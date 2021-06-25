let panelStage = 0, //tracks the msgs shown by the left-side comic panel/guide.
    charOneScore = 0, 
    charTwoScore = 0, 
    statsShown = 0, 
    winStreak = 0, 
    currChar = 0;

const icons = ['fa-brain', 'fa-dumbbell', 'fa-running', 'fa-shield-alt', 'fa-burn', 'fa-fist-raised'];
//Wake apis with a start-up request:
fetch('https://hosted-cors.herokuapp.com/http://www.superheroapi.com/api/10158616269425862/1');

//initial setup
(function beginApp() {
    let btn = document.querySelector('.btn'), btnTwo = document.querySelector('.btn:nth-of-type(2)')
    let btnTwoClicked = false;

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
        if (!btnTwoClicked) {
            btn.classList.add('btnDisappear'), btnTwo.classList.add('btnDisappear')
            btnTwo.classList.remove('appear')
            managePanel() 
            setTimeout(()=> {
                btn.remove(), btnTwo.remove()
            }, 500)
            btnTwoClicked = true;
        }
    }) 
})();

const prepBattleArea = () => {
    let battleArea = document.createElement('div'),
    row = document.querySelector('.row');

    row.classList.remove('col'), row.classList.add('colFinalState');

    let newRow = row.cloneNode(true),
    middleRow = row.cloneNode(false),
    middleDialogue = document.querySelector('.comic-pane').cloneNode(true);

    middleDialogue.classList.add('midPanel');

    battleArea.classList.add('battleArea');
    document.body.appendChild(battleArea);
    battleArea.appendChild(row), battleArea.appendChild(middleRow), battleArea.appendChild(newRow);

    clearCharUI(1); //clear data from the newly generated character two

    let num = Math.floor(Math.random()*731)+1; //Character IDs. Include 731, exclude 0.
    generateCharacter(num, 1);

    setTimeout(()=> {
        document.body.insertBefore(middleDialogue, battleArea)
        middleDialogue.classList.remove('fadeInLeft', 'fadeOutLeft')
        middleDialogue.classList.add('fadeInTop')
        document.querySelectorAll('.text p')[1].innerHTML = "<p>The characters' <strong>powerstats</strong> will now be compared one at a time, rewarding points to the character that has a higher value for that stat. Click <strong>BEGIN</strong> to proceed.</p>"
        setTimeout(()=> {
            let clicked = false;
            newBtn = document.createElement('button')
            newBtn.classList.add('btn', 'animate', 'battleBtn', 'appear')
            newBtn.innerHTML = "<strong>BEGIN</strong>"
            middleRow.appendChild(newBtn)
            newBtn.addEventListener('click', () => {
                if (clicked === false) {
                    middleDialogue.classList.add('fadeOutTop')
                    newBtn.classList.add('btnDisappear')
                    newBtn.classList.remove('appear')
                    setTimeout(updateBattleUi, 400);
                    clicked = true;
                }
            })
        }, 1200)
    }, 400)
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
    document.querySelectorAll('.text p')[1].innerHTML = `<p><strong>${displayStat} </strong> &nbsp <i class='fas ${icon}'></i></p>`;

    middleDialogue.classList.add('fadeInTop', 'statPanel', 'stat');
    middleDialogue.classList.remove('fadeOutTop','fadeIn', 'fadeOut');

    bannerOne.classList.remove('appear'), bannerTwo.classList.remove('appear');
    
    setTimeout(()=> {     
        middleDialogue.classList.remove('fadeInTop'), middleDialogue.classList.add('fadeOutTop')

        //update stat lists as the stats are revealed
        firstUl.innerHTML +=`<li>${displayStat}: <span class="${classOne}"></span></li>`;
        secondUl.innerHTML +=`<li>${displayStat}: <span class="${classTwo}"></span></li>`;
        document.querySelector('.'+classOne).textContent = charOneStats[stat];
        document.querySelector('.'+classTwo).textContent = charTwoStats[stat];

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
        let bannerOne = document.querySelector('.portraitBanner'), bannerTwo = document.querySelectorAll('.portraitBanner')[1];

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
    bannerOne = document.querySelector('.portraitBanner'), bannerTwo = document.querySelectorAll('.portraitBanner')[1];

    let defaultHTML = "<li>Full Name: <span class='fullName'></span></li> <li>Alignment: <span class='alignment'></span></li> <li>Base: <span class='base'></span> </li> <li>First Appearance: <span class='firstAppear'></span></li> <li>Publisher: <span class='publisher'></span></li>";

    midPanel.classList.remove('stat', 'statPanel', 'fadeOutTop'), midPanel.classList.add('fadeInTop');
    document.querySelectorAll('.text p')[1].innerHTML = `<p>${msg}<br>Win Streak: ${winStreak}</p>`;

    setTimeout(()=> {
        let newBtn = document.createElement('button'), newBtnTwo = document.createElement('button');
        let nextOpponentBtnClicked = false;

        newBtn.classList.add('btn', 'animate', 'battleBtnTwo', 'appear');
        newBtn.innerHTML = "<strong>NEXT OPPONENT</strong>";
        midRow.appendChild(newBtn);

        newBtnTwo.classList.add('btn', 'animate', 'battleBtnTwo', 'appear', 'top');
        newBtnTwo.innerHTML = "<strong>RETURN HOME</strong>";
        midRow.appendChild(newBtnTwo);

        newBtnTwo.addEventListener('click', () => {
            location.href = "index.html" //refresh the page
        })

        newBtn.addEventListener('click', ()=> {
            //wipe the 2nd character's data
            if (nextOpponentBtnClicked === false) {
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
                        let newestBtnClicked = false;
                        newestBtn = document.createElement('button')
                        newestBtn.classList.add('btn', 'animate', 'battleBtn', 'appear')
                        newestBtn.innerHTML = "<strong>BEGIN</strong>"

                        //reset the popup banners' text from "winner"
                        bannerOne.innerText = "ADVANTAGE", bannerTwo.innerText = "ADVANTAGE"

                        midRow.appendChild(newestBtn)
                        newestBtn.addEventListener('click', ()=> {
                            if (newestBtnClicked === false) {
                                midPanel.classList.add('fadeOutTop'), midPanel.classList.remove('fadeInTop')
                                newestBtn.classList.add('btnDisappear')
                                newestBtn.classList.remove('appear')
                                setTimeout(updateBattleUi, 400);
                                newestBtnClicked = true;
                            }
                        }); //end event listener
                    }, 1200); 
                }, 600);
                nextOpponentBtnClicked = true;
            } //end var check
        });
    }, 1100);
};