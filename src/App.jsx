import Log from "./components/Log";
import GameOver from "./components/GameOver.jsx";

import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import { WINNING_COMBINATIONS } from "./winning-combinations.js";

import { useState } from "react";

const PLAYERS = {
  'X': 'PLAYER 1',
  'O': 'PLAYER 2',
}


const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X';

  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  };
  return currentPlayer;
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);

  const activePlayer = deriveActivePlayer(gameTurns);

  function deriveGameBoard(gameTurns) {
    let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];

    for (const turn of gameTurns) {
      const { square, player } = turn;
      const { row, col } = square;
      gameBoard[row][col] = player;
    }
    return gameBoard;
  }

  function deriveWinner(gameBoard, players) {
    let winner;

    for (const combination of WINNING_COMBINATIONS) {
      const firstSquare = gameBoard[combination[0].row][combination[0].column];
      const secondSquare = gameBoard[combination[1].row][combination[1].column];
      const thirdSquare = gameBoard[combination[2].row][combination[2].column];

      if (firstSquare && firstSquare === secondSquare && firstSquare === thirdSquare) {
        winner = players[firstSquare];
      }
    }
    return winner;
  }

  const gameBoard = deriveGameBoard(gameTurns);

  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns(prevTurns => {
      const currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [{ square: { row: rowIndex, col: colIndex }, player: currentPlayer },
      ...prevTurns];

      return updatedTurns;
    });

  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(playerSymbol, newName) {
    setPlayers(prevPlayers => {
      {
        return {
          ...prevPlayers,
          [playerSymbol]: newName,
        }
      }
    })
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName={PLAYERS.X} symbol="X"
            isActive={activePlayer === 'X'}
            onChangeName={handlePlayerNameChange} />
          <Player initialName={PLAYERS.O} symbol="O"
            isActive={activePlayer === 'O'}
            onChangeName={handlePlayerNameChange} />
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart} />}
        <GameBoard
          onSelectSquare={handleSelectSquare}
          activePlayerSymbol={activePlayer}
          board={gameBoard}
        />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App
