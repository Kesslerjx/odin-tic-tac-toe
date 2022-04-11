//HTML Elements
let playerOneInput = document.getElementById('player_one_name');
let playerTwoInput = document.getElementById('player_two_name');
let playButton    = document.getElementById('play_button');

//Event listeners
playButton.addEventListener('click', playPressed);

//Modules
const gameboard =(() => {
    //Get gameboard div
    let boardDiv = document.querySelector('.gameboard');

    //Add event listeners to each grid cell in the div
    const addListeners = () => {
        Array.from(boardDiv.children).forEach(child => {
            child.addEventListener('click', gridCellPressed)
        });
    };

    const gridCellPressed = (event) => {
        //PLay the move
        game.playMove(event.target);

        //Remove the listener
        event.target.removeEventListener('click', gridCellPressed);
    };

    return {addListeners};

})();

const game =(() => {

    let playerOne = undefined; 
    let playerTwo = undefined;
    let gameCount = 0; //How many games have been played
    let previousWinnner = undefined; //Who won the previous game
    let gamePlaying = false; //If a game is currently being played
    let currentPlayer = undefined; //Who the current player is

    //Creates the two players with the names they chose
    const createPlayers = (one, two) => {
        playerOne = Player(one, 'x');
        playerTwo = Player(two, 'o');

        //Set player 1 to the current player
        currentPlayer = playerOne;
    };

    const startGame = (one, two) => {
        //Create players
        createPlayers(one, two);

        //Start
        gamePlaying = true;

        //Disable inputs
        display.disableInputs();

        //Display user names
        display.displayNames(playerOne.getName(), playerTwo.getName());

        //Set who's turn it is
        display.changeTurn(currentPlayer.getName());

        //Add event listeners to the board
        gameboard.addListeners();
    };

    const playMove = (gridCell) => {
        //Set the letter
        gridCell.textContent = (currentPlayer === playerOne) ? playerOne.getLetter() : playerTwo.getLetter();

        //Check for win
        if(checkWin() === false) {
            //Change player
            currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
            display.changeTurn(currentPlayer.getName());
        }
    };

    const checkWin = () => {
        return false;
    }

    return {startGame, playMove};
})();

const display =(() => {
    let playerOneName = document.getElementById('player_one');
    let playerTwoName = document.getElementById('player_two');

    //Displays the name in their respective div
    const displayNames = (one, two) => {
        playerOneName.textContent = one;
        playerTwoName.textContent = two;
    };

    //Adds a class to the name to emphasize who's turn it is
    const changeTurn = (name) => {
        if(name === playerOneName.textContent) {
            playerOneName.classList.add('players_turn');
            playerTwoName.classList.remove('players_turn');
        } else {
            playerTwoName.classList.add('players_turn');
            playerOneName.classList.remove('players_turn');
        }
    };

    const disableInputs = () => {
        playerOneInput.disabled = true;
        playerTwoInput.disabled = true;
        playButton.disabled = true;
    };

    return {displayNames, changeTurn, disableInputs};
})();

//Factories
const Player = (name, letter) => {
    let wins = 0;
    const addWin = () => {
        win += 1;
    }
    const getWins = () => wins;
    const getName = () => name;
    const getLetter = () => letter;

    return {addWin, getWins, getName, getLetter};
};

//Functions
function playPressed(event) {
    //Validate form before continuing
    //If form is good, start the game
    if(checkForm()) {
        //Start game
        game.startGame(playerOneInput.value, playerTwoInput.value);
    }
}

//Returns true or false based on if the forms have something in them
function checkForm() {

    if(playerOneInput.value === '' || playerTwoInput.value === ''){
        return false;
    } else {
        return true;
    }
}