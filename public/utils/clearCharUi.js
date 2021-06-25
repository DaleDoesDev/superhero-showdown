const clearCharUI = char => {
    document.querySelectorAll('.portrait')[char].src="unknownChar.jpg";
    //place the character's html UI pieces in an array
    const ui = [ document.querySelectorAll('.charName')[char], document.querySelectorAll('.fullName')
    [char], document.querySelectorAll('.alignment')[char], document.querySelectorAll('.base')[char],
    document.querySelectorAll('.firstAppear')[char], document.querySelectorAll('.publisher')[char] ];

    for (piece in ui) {
        ui[piece].textContent = ''; //clear the data
    }
};