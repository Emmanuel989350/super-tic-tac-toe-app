import React, { useState, useEffect } from 'react';

// Main App component for the Super Tic Tac Toe game
const App = () => {
  // State for the main 3x3 grid of Super Tic Tac Toe boards.
  // Each element in the outer array represents a small board.
  // Each small board is a 3x3 array of cells (null, 'X', or 'O').
  const [board, setBoard] = useState(
    Array(9).fill(null).map(() => Array(9).fill(null))
  );

  // State for the current player ('X' or 'O')
  const [player, setPlayer] = useState('X');

  // State to track the active small board where the next move must be made.
  // -1 means any board can be played (e.g., start of game or sent to a full/won board).
  const [activeBoard, setActiveBoard] = useState(-1);

  // State to track the winner of each small board (null, 'X', 'O', or 'draw').
  const [smallBoardWinners, setSmallBoardWinners] = useState(Array(9).fill(null));

  // State for the overall game winner (null, 'X', 'O', or 'draw').
  const [gameWinner, setGameWinner] = useState(null);

  // Function to check for a winner on a given 3x3 board.
  // Takes a 1D array representing the 9 cells of a small board.
  const checkWinner = (currentBoard) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6],           // Diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a]; // Return 'X' or 'O'
      }
    }

    // Check for a draw if no winner and all cells are filled
    if (currentBoard.every(cell => cell !== null)) {
      return 'draw';
    }

    return null; // No winner yet
  };

  // Effect to check for overall game winner whenever smallBoardWinners changes
  useEffect(() => {
    const overallWinner = checkWinner(smallBoardWinners);
    if (overallWinner) {
      setGameWinner(overallWinner);
    }
  }, [smallBoardWinners]);

  // Handle a click on a cell
  const handleClick = (bigBoardIndex, smallBoardIndex) => {
    // If the game is already won, or the clicked cell is not on the active board (unless activeBoard is -1),
    // or the cell is already occupied, or the small board itself is already won/drawn, do nothing.
    if (gameWinner || (activeBoard !== -1 && bigBoardIndex !== activeBoard) || board[bigBoardIndex][smallBoardIndex] !== null || smallBoardWinners[bigBoardIndex] !== null) {
      return;
    }

    // Create a copy of the board to modify
    const newBoard = board.map(row => [...row]);
    newBoard[bigBoardIndex][smallBoardIndex] = player;
    setBoard(newBoard);

    // Check for a winner on the small board that was just played on
    const smallBoardWinner = checkWinner(newBoard[bigBoardIndex]);
    if (smallBoardWinner && smallBoardWinners[bigBoardIndex] === null) {
      const newSmallBoardWinners = [...smallBoardWinners];
      newSmallBoardWinners[bigBoardIndex] = smallBoardWinner;
      setSmallBoardWinners(newSmallBoardWinners);
    }

    // Determine the next active board
    let nextActiveBoard = smallBoardIndex; // The index of the cell played determines the next active board

    // If the next active board is already won or is a draw, the next player can play anywhere (-1)
    if (smallBoardWinners[nextActiveBoard] !== null) {
      nextActiveBoard = -1;
    }

    setActiveBoard(nextActiveBoard);
    setPlayer(player === 'X' ? 'O' : 'X'); // Switch player
  };

  // Render a single cell
  const renderCell = (bigBoardIndex, smallBoardIndex) => {
    const isOccupied = board[bigBoardIndex][smallBoardIndex] !== null;
    const isClickable = !gameWinner && (activeBoard === -1 || bigBoardIndex === activeBoard) && !isOccupied && smallBoardWinners[bigBoardIndex] === null;

    return (
      <button
        key={smallBoardIndex}
        className={`
          w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20
          flex items-center justify-center text-3xl md:text-5xl lg:text-6xl font-bold
          rounded-md
          transition-colors duration-200 ease-in-out
          ${isClickable ? 'cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900' : 'cursor-not-allowed'}
          ${isOccupied ? (board[bigBoardIndex][smallBoardIndex] === 'X' ? 'text-red-600' : 'text-blue-600') : 'text-gray-700 dark:text-gray-300'}
          ${smallBoardWinners[bigBoardIndex] ? 'bg-gray-200 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
          border border-gray-300 dark:border-gray-700
        `}
        onClick={() => handleClick(bigBoardIndex, smallBoardIndex)}
        disabled={!isClickable}
      >
        {board[bigBoardIndex][smallBoardIndex]}
      </button>
    );
  };

  // Render a single small Tic Tac Toe board
  const renderSmallBoard = (bigBoardIndex) => {
    const isSmallBoardWon = smallBoardWinners[bigBoardIndex] !== null;
    const isActiveBoard = activeBoard === -1 || activeBoard === bigBoardIndex;

    return (
      <div
        key={bigBoardIndex}
        className={`
          relative
          grid grid-cols-3 gap-1
          p-2 md:p-3
          rounded-lg shadow-lg
          transition-all duration-300 ease-in-out
          ${gameWinner
            ? 'bg-gray-300 dark:bg-gray-700'
            : isActiveBoard && !isSmallBoardWon
              ? 'bg-green-200 dark:bg-green-800 border-4 border-green-500 dark:border-green-400'
              : 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700'
          }
          ${isSmallBoardWon ? 'opacity-70' : ''}
        `}
      >
        {isSmallBoardWon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg z-10">
            <span className={`text-7xl md:text-9xl font-extrabold ${smallBoardWinners[bigBoardIndex] === 'X' ? 'text-red-500' : 'text-blue-500'}`}>
              {smallBoardWinners[bigBoardIndex] === 'draw' ? 'DRAW' : smallBoardWinners[bigBoardIndex]}
            </span>
          </div>
        )}
        {board[bigBoardIndex].map((cell, smallBoardIndex) =>
          renderCell(bigBoardIndex, smallBoardIndex)
        )}
      </div>
    );
  };

  // Reset the game to its initial state
  const resetGame = () => {
    setBoard(Array(9).fill(null).map(() => Array(9).fill(null)));
    setPlayer('X');
    setActiveBoard(-1);
    setSmallBoardWinners(Array(9).fill(null));
    setGameWinner(null);
  };

  // Determine game status message
  const status = gameWinner
    ? (gameWinner === 'draw' ? 'Game Over: It\'s a Draw!' : `Game Over: Player ${gameWinner} Wins!`)
    : `Player ${player}'s Turn`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-900 dark:to-black text-gray-900 dark:text-white font-inter flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-white text-shadow-lg drop-shadow-xl">
        Super Tic Tac Toe
      </h1>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-xl shadow-2xl flex flex-col items-center">
        <div className="text-2xl md:text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
          {status}
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-5 max-w-sm md:max-w-xl lg:max-w-3xl">
          {Array(9).fill(null).map((_, bigBoardIndex) =>
            renderSmallBoard(bigBoardIndex)
          )}
        </div>

        <button
          className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>

      {/* Tailwind CSS CDN script */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Inter font for better aesthetics */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
          }
          .text-shadow-lg {
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          }
        `}
      </style>
    </div>
  );
};

export default App;