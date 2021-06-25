const updateBattleUi = () => {
    let firstUl = document.querySelector('ul'),
    secondUl = document.querySelectorAll('ul')[1];

    //if stats about to appear for the first time
    if (statsShown === 0) {
        document.querySelector('.btn:nth-of-type(1)').remove();
        firstUl.classList.add('btnDisappear');
        secondUl.classList.add('btnDisappear');
    };

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
        displayBattleStat(Object.keys(charOneStats)[statsShown], icons[statsShown]);
    }, 600)
}