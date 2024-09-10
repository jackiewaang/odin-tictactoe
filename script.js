const intro = document.querySelector('#intro');
const resultsContainer = document.querySelector('#results-container');
const results = document.querySelector('#results');


function game(turn){
    this.board = [['','',''],['','',''],['','','']];
    this.turn = turn;
    this.restart = function(){
        this.board = [['','',''],['','',''],['','','']];
    };
}

function player(name, symbol){
    this.name = name;
    this.symbol = symbol;
}

function checkWinner(board){
    for(let row=0;row < 3;row++){
        if(board[row][0] === board[row][1] && board[row][1] === board[row][2] && board[row][0] !== ''){
            return board[row][0];
        }
    }

    for(let col = 0;col < 3;col++){
        if(board[0][col] === board[1][col] && board[1][col] === board[2][col] && board[0][col] !== ''){
            return board[0][col];
        }
    }

    if(board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== ''){
        return board[0][0];
    }

    if(board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== ''){
        return board[0][2];
    }
    
    return null;
}

function checkDraw(board){
    for(let row=0;row<3;row++){
        for(let col=0;col<3;col++){
            if(board[row][col] === ''){
                return false;
            }
        }
    }
    return true;
}

function place(game, row, col, player){
    if(game.board[row][col] === ''){
        game.board[row][col] = player.symbol;
    }
}

const cells = document.querySelectorAll('.cell');


function startGame(playerName){
    const player1 = new player(playerName, 'x');
    const player2 = new player('Bot', 'o');
    const gameplay = new game(player1);


    cells.forEach(cell => {
        cell.addEventListener('click', function handleClick(event){

            if(cell.textContent === ''){
                const cellId = event.target.id;
                const row = Math.floor(cellId[4] / 3);
                const col = cellId[4] % 3;

                place(gameplay, row, col, player1);

                event.target.textContent = gameplay.turn.symbol;
                
                if(checkWinner(gameplay.board) !== null){
                    endGame(gameplay.turn.name);
                } else if(checkDraw(gameplay.board)){
                    endGame('Draw');
                } else{
                    while(true){
                        const random = Math.floor(Math.random() * cells.length);
                        if(cells[random].textContent === ''){
                            const rowBot = Math.floor(cells[random].id[4] / 3);
                            const colBot = cells[random].id[4] % 3;
                            cells[random].textContent = player2.symbol;
                            place(gameplay, rowBot,colBot, player2);
                            break;
                        }
                    }
                }
            }
             
        })
    })

    const restartButtons = document.querySelectorAll('#restart');
    restartButtons.forEach( restartButton => {
        restartButton.addEventListener('click', function(){
            gameplay.restart();
            close.click();
            cells.forEach(cell => {
                cell.textContent = '';
                cell.disabled = false;
            })
        })
    }
    )
    
    const symbols = document.querySelectorAll('#symbol');
    symbols.forEach(sym => {
        sym.addEventListener('click', function(){
            symbols.forEach(symb => {
                symb.classList.remove('chosen');
            })
            sym.classList.add('chosen');
            player1.symbol =  sym.textContent;
            player2.symbol = (player1.symbol === 'x') ? 'o' : 'x';
            gameplay.turn.symbol;
            restartButtons[0].click();
        })
    })

}


intro.showModal();
const introButton = document.querySelector('#choose-name');
introButton.addEventListener('click', closeIntro);

const form = document.querySelector('form');
form.addEventListener('submit', closeIntro)

function closeIntro(event){
    event.preventDefault();
    intro.close();
    const playerName = document.querySelector('#player-name').value;
    startGame(playerName);
}

function endGame(winner){
    if(winner === 'Draw'){
        results.textContent = `It's a draw!`;
    } else{
        results.textContent = `${winner} has won!`;    
    }
    cells.forEach(cell => cell.disabled = true);
    resultsContainer.showModal();
}

const close = document.querySelector('#close');
close.addEventListener('click', function(){
    resultsContainer.close();
})

