//CONSTANTS
const GAME_STATE = {
    START: 'start',
    PLAYING: 'playing',
    WIN: 'win',
    TIE: 'tie'
}

//FACTORIES
const Player = (name, letter) => {
    let wins = 0;
    const addWin = () => {
        wins += 1;

        display.updateWins(name, wins);
    }
    const getWins = () => wins;
    const getName = () => name;
    const getLetter = () => letter;

    return {addWin, getWins, getName, getLetter};
};

//MODULES

const display = (() => {
    let playerOneInput = document.getElementById('player_one_name');
    let playerTwoInput = document.getElementById('player_two_name');
    let playerOneName  = document.getElementById('player_one');
    let playerTwoName  = document.getElementById('player_two');
    let playerOneWins  = document.getElementById('player_one_wins');
    let playerTwoWins  = document.getElementById('player_two_wins');
    let playButton     = document.getElementById('play_button');
    let gamesPlayed    = document.getElementById('games_played');

    const checkInputs = () => {
        if(playerOneInput.value === '' || playerTwoInput.value === ''){
            console.log("Both inputs need to be filled");
        } else 
        if(playerOneInput.value === playerTwoInput.value){
            console.log("Inputs cannot be equal to each other");
        } else {
            game.startGame(playerOneInput.value, playerTwoInput.value);
        }
    };

    const disableInputs = () => {
        playerOneInput.disabled = true;
        playerTwoInput.disabled = true;
    };

    const updateNames = (oneName, twoName) => {
        playerOneName.textContent = oneName;
        playerTwoName.textContent = twoName;
    };

    const updateTurn = (name) => {
        if(name === playerOneName.textContent) {
            playerOneName.classList.add('players_turn');
            playerTwoName.classList.remove('players_turn');
        } else {
            playerTwoName.classList.add('players_turn');
            playerOneName.classList.remove('players_turn');
        }
    };

    const setButton = (gameState) => {
        if(gameState === GAME_STATE.PLAYING) {
            //Update text
            playButton.value = 'Playing';

            //Remove event listener from button
            playButton.removeEventListener('click', checkInputs);
            playButton.removeEventListener('click', game.playAgain);
        } else {
            //Update text
            playButton.value = 'Play Again';

            //Add event listener
            playButton.addEventListener('click', game.playAgain);
        }
    };

    const updateGameCount = (count) => {
        gamesPlayed.textContent = count;
    }

    const updateWins = (name, wins) => {
        if(name == playerOneName.textContent) {
            playerOneWins.textContent = wins;
        } else {
            playerTwoWins.textContent = wins;
        }
    };

    //Set event listener for play button before functions
    playButton.addEventListener('click', checkInputs);

    return {updateNames, disableInputs, updateTurn, setButton, updateGameCount, updateWins}

})();

const game = (() => {
    let gameState = GAME_STATE.START;
    let gameCount = 0;
    let currentPlayer = undefined;
    let previousWinnner = undefined;
    let playerOne = undefined;
    let playerTwo = undefined;

    const startGame = (oneName, twoName) => {

        //Create players
        playerOne = Player(oneName, 'x');
        playerTwo = Player(twoName, 'o');

        //Set current player to playerOne to start
        currentPlayer = playerOne;

        //Change game state
        gameState = GAME_STATE.PLAYING;

        //Update names in DOM
        display.updateNames(playerOne.getName(), playerTwo.getName());

        //Disable inputs
        display.disableInputs();

        //Update turn in DOM
        display.updateTurn(currentPlayer.getName());

        //Set play button in DOM
        display.setButton(gameState);

        //Start gameboard
        gameboard.startBoard();
    };

    const endGame = () => {
        //Update game count counter
        gameCount += 1;

        //Update count in DOM
        display.updateGameCount(gameCount);

        //Set previousWinner if applicable
        if(gameState == GAME_STATE.WIN) {
            previousWinnner = currentPlayer;

            //Update player wins
            if(currentPlayer.getName() === playerOne.getName()) {
                playerOne.addWin();
            } else {
                playerTwo.addWin();
            }
        } else {
            changePlayer();
        }

        //End board
        gameboard.endBoard();

        //Set button in DOM
        display.setButton(gameState);
    };

    const playAgain = () => {

        //Change game state
        gameState = GAME_STATE.PLAYING;

        //Clear board and array
        gameboard.clearBoard();

        //Start board again
        gameboard.startBoard();

        //Update whos turn it is in DOM
        display.updateTurn(currentPlayer.getName());

        //Set the button in the DOM
        display.setButton(gameState);

    };

    const checkState = (boardArray) => {
        updateGameState(boardArray);
        
        //Check for win
        if(gameState === GAME_STATE.PLAYING) {
            //Change player
            changePlayer();

            //Update turn in DOM
            display.updateTurn(currentPlayer.getName());
        } else {
            endGame();            
        }
    };

    const updateGameState = (boardArray) => {
        //Get the current letter
        let letter = getCurrentLetter();

        //Update the game state
        if(boardArray[0] === letter && boardArray[1] === letter && boardArray[2] === letter) {
            gameState = GAME_STATE.WIN;
        } else
        if(boardArray[3] === letter && boardArray[4] === letter && boardArray[5] === letter) {
            gameState = GAME_STATE.WIN;
        } else
        if(boardArray[6] === letter && boardArray[7] === letter && boardArray[8] === letter) {
            gameState = GAME_STATE.WIN;
        } else
        if(boardArray[0] === letter && boardArray[3] === letter && boardArray[6] === letter) {
            gameState = GAME_STATE.WIN;
        } else
        if(boardArray[1] === letter && boardArray[4] === letter && boardArray[7] === letter) {
            gameState = GAME_STATE.WIN;
        } else
        if (boardArray[2] === letter && boardArray[5] === letter && boardArray[8] === letter) {
            gameState = GAME_STATE.WIN;
        } else
        if(boardArray[0] === letter && boardArray[4] === letter && boardArray[8] === letter) {
            gameState = GAME_STATE.WIN;
        } else
        if(boardArray[2] === letter && boardArray[4] === letter && boardArray[6] === letter){
            gameState = GAME_STATE.WIN;
        } else 
        if(checkTie(boardArray) === false){
            gameState = GAME_STATE.PLAYING;
        } else {
            gameState = GAME_STATE.TIE;
        }
    };

    const checkTie = (boardArray) => {
        for(x=0;x<boardArray.length;x++) {
            if(boardArray[x] === '') {
                return false;
            }
        }

        return true;
    };

    const getCurrentLetter = () => {
        return (currentPlayer === playerOne) ? playerOne.getLetter() : playerTwo.getLetter();
    };

    const changePlayer = () => {
        if(currentPlayer === playerOne) {
            currentPlayer = playerTwo;
        } else {
            currentPlayer = playerOne;
        }
    }

    return {startGame, getCurrentLetter, checkState, playAgain};

})();

const gameboard = (() => {
    let boardElement = document.querySelector('.gameboard');
    let boardArray = Array(9).fill('');

    const startBoard = () => {
        Array.from(boardElement.children).forEach(child => {
            child.addEventListener('click', playMove);
        });
    };

    const endBoard = () => {
        Array.from(boardElement.children).forEach(child => {
            child.removeEventListener('click', playMove)
        });
    };

    const clearBoard = () => {
        //Clear board element
        Array.from(boardElement.children).forEach(child => {
            child.textContent = '';
        });

        //Clear array
        boardArray.fill('');
    };

    const playMove = (event) => {
        //Remove event listener from the grid cell
        event.target.removeEventListener('click', playMove);

        //Set the letter
        event.target.textContent = game.getCurrentLetter();

        //Set the piece on the board array
        boardArray[Number(event.target.dataset.index)] = event.target.textContent;

        //Check for win or tie
        game.checkState(boardArray);

    };

    return {startBoard, endBoard, clearBoard};

})();

