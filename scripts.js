
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

    const removeAllListeners = () => {
        Array.from(boardDiv.children).forEach(child => {
            child.removeEventListener('click', gridCellPressed)
        });
    }

    const playAgain = () => {
        clearGameboard();
        addListeners();
    }

    const clearGameboard = () => {
        Array.from(boardDiv.children).forEach(child => {
            child.textContent = '';
        });
    };

    return {addListeners, removeAllListeners, playAgain};

})();

const game =(() => {

    let playerOne = undefined; 
    let playerTwo = undefined;
    let gameCount = 0; //How many games have been played
    let previousWinnner = undefined; //Who won the previous game
    let currentPlayer = undefined; //Who the current player is
    let currentBoard = Array(9).fill(''); //Empty array for the board
    const STATE = {
        START: 'start',
        PLAYING: 'playing',
        WIN: 'win',
        TIE: 'tie'
    };
    let gameState = STATE.START;

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
        gameState = STATE.PLAYING;

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

        //Set the piece on the board array
        currentBoard[Number(gridCell.dataset.index)] = gridCell.textContent;

        gameState = checkState();

        //Check for win
        if(gameState === STATE.PLAYING) {
            //Change player
            currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
            display.changeTurn(currentPlayer.getName());
        } else {

            //End game
            gameOver();
            
        }
    };

    const gameOver = () => {

        //Remove all event listeners
        gameboard.removeAllListeners();

        //Add to information
        updateInformation();

        //Update display
        display.gameOver(gameCount);
    };

    const updateInformation = () => {
        //Increase game count
        gameCount += 1;

        //Set previous winner if the game was won
        if(gameState === STATE.WIN) {
            //Set previous winner
            previousWinnner = currentPlayer;

            //Increase that players wins
            if(currentPlayer === playerOne) {
                //Add win
                playerOne.addWin();
            } else {
                //Add win
                playerTwo.addWin();
            }
        }

    };

    const playAgain = () => {

        //Update gameboard module
        gameboard.playAgain();

        //Clear board
        currentBoard.fill('');

        //Set turn to the previous winner
        currentPlayer = previousWinnner

        //Update display module
        display.setDisplayForAnotherGame(currentPlayer);

    };

    const checkState = () => {

        //Get the players letter
        let letter = currentPlayer.getLetter();

        //Look for the potential wins
        if(currentBoard[0] === letter && currentBoard[1] === letter && currentBoard[2] === letter) {
            return STATE.WIN;
       } else
       if(currentBoard[3] === letter && currentBoard[4] === letter && currentBoard[5] === letter) {
            return STATE.WIN;
       } else
       if(currentBoard[6] === letter && currentBoard[7] === letter && currentBoard[8] === letter) {
            return STATE.WIN;
       } else
       if(currentBoard[0] === letter && currentBoard[3] === letter && currentBoard[6] === letter) {
           return STATE.WIN;
       } else
       if(currentBoard[1] === letter && currentBoard[4] === letter && currentBoard[7] === letter) {
           return STATE.WIN;
       } else
       if (currentBoard[2] === letter && currentBoard[5] === letter && currentBoard[8] === letter) {
            return STATE.WIN;
       } else
       if(currentBoard[0] === letter && currentBoard[4] === letter && currentBoard[8] === letter) {
           return STATE.WIN;
       } else
       if(currentBoard[2] === letter && currentBoard[4] === letter && currentBoard[6] === letter){
           return STATE.WIN;
       } else 
       if(checkTie() === false){
           return STATE.PLAYING;
       } else {
           return STATE.TIE;
       }
    }

    const checkTie = () => {
        for(x=0;x<currentBoard.length;x++) {
            if(currentBoard[x] === '') {
                return false;
            }
        }

        return true;
    }

    return {startGame, playMove, playAgain};
})();

const display =(() => {
    let playerOneInput = document.getElementById('player_one_name');
    let playerTwoInput = document.getElementById('player_two_name');
    let playerOneName  = document.getElementById('player_one');
    let playerTwoName  = document.getElementById('player_two');
    let playerOneWins  = document.getElementById('player_one_wins');
    let playerTwoWins  = document.getElementById('player_two_wins');
    let playButton     = document.getElementById('play_button');
    let gamesPlayed    = document.getElementById('games_played');

    const startGame = (event) => {
        //Validate form before continuing
        //If form is good, start the game
        if(checkForm()) {
            //Start game
            game.startGame(playerOneInput.value, playerTwoInput.value);

            //Remove event listener from button
            playButton.removeEventListener('click', startGame);
        }
    };

    //Returns true or false based on if the forms have something in them
    const checkForm = () => {

        if(playerOneInput.value === '' || playerTwoInput.value === ''){
            return false;
        } else 
        if(playerOneInput.value === playerTwoInput.value){
            return false;
        } else {
            return true;
        }
    };

    //Displays the name in their respective div
    const displayNames = (one, two) => {
        playerOneName.textContent = one;
        playerTwoName.textContent = two;
    };

    //Adds a class to the name to emphasize who's turn it is
    const changeTurn = (name) => {
        console.log("Changing turn");
        console.log(typeof name);
        console.log(typeof playerOneName.textContent);
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
    };

    const updateWins = (letter, number) => {
        if(letter === 'x') {
            playerOneWins.textContent = number;
        } else {
            playerTwoWins.textContent = number;
        }
    };

    const gameOver = (gameCount) => {

        //Change play button text
        playButton.value = "Play Again";

        //Add event listener back to play button
        playButton.addEventListener('click', playAgain);

        //Update game count
        gamesPlayed.textContent = gameCount;
    };

    const playAgain = () => {
        game.playAgain();
    };

    const setDisplayForAnotherGame = (currentPlayer) => {

        //Update whos turn it is
        changeTurn(currentPlayer.getName());

        //Change play button text
        playButton.value = "Play";

        //Remove event listener from button
        playButton.removeEventListener('click', startGame);

    }

    playButton.addEventListener('click', startGame);

    return {displayNames, changeTurn, disableInputs, updateWins, gameOver, setDisplayForAnotherGame};
})();

//Factories
const Player = (name, letter) => {
    let wins = 0;
    const addWin = () => {
        wins += 1;

        display.updateWins(letter, wins);
    }
    const getWins = () => wins;
    const getName = () => name;
    const getLetter = () => letter;

    return {addWin, getWins, getName, getLetter};
};