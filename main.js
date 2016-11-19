const assert = require("assert");

// a board takes the form:
// [_, _, _, _, _, _, _, _, _]
// each spot is 0 if the spot is free, 1 if the first player has it, and 2 if the second

// makes a random, valid move on the board
// board is an array and the player is either 1 or 2
const randomMove = (board, player) => {
  assert(board.hasOwnProperty("length")); // make sure board is an array
  assert(player === 1 || player === 2);

  // if the board is full
  if (board.filter((spot) => !spot).length === 0) {
    return board;
  }

  const randomLocation = Math.floor(Math.random() * board.length);

  // if someone already made a move, try again
  if (board[randomLocation]) {
    return randomMove(board, player);
  }

  // if it's free, then make the move and return the new board
  const newBoard = board.slice(); // make a copy
  newBoard[randomLocation] = player;
  return newBoard;
};

// tries to make a move based on the board and memory
// if it doesn't have a saved move for that board, it will make a random move
const makeMove = (board, memory, player) => {
  assert(board.hasOwnProperty("length")); // make sure board is an array
  assert(typeof(memory) === "object");
  assert(player === 1 || player === 2);

  // if if doesn't have a remembered move, then make one and remember it
  if (!memory[String(board)]) {
    memory[String(board)] = randomMove(board, player);
  }

  return memory[String(board)];
};

// returns 0 if there is no winner yet, 1 if the player1 won, and 2 for player2
const winner = (board) => {
  // check for if someone made a horizontal row
  for (let row of [0, 3, 6]) {
    // if that row has an empty spot, go to the next gone
    if (!board[row]) {
      continue;
    }
    // if all of them are the same value, there is a winner
    if (board[row] === board[row + 1] && board[row + 1] === board[row + 2]) {
      return board[row];
    }
  }

  // check for if someone made a vertical column
  for (let column of [0, 1, 2]) {
    // if that row has an empty spot, go to the next gone
    if (!board[column]) {
      continue;
    }
    // if all of them are the same value, there is a winner
    if (board[column] === board[column + 3] && board[column + 3] === board[column + 6]) {
      return board[column];
    }
  }

  // check for diagonals
  if (board[0] && board[0] === board[4] && board[4] === board[8]) {
    return board[0];
  }
  if (board[2] && board[2] === board[4] && board[4] === board[6]) {
    return board[2];
  }

  // if no winner was found, return 0
  return 0;
};

// runs a game of tic-tac-toe and returns 1 if the first won, 2 if the second won, and 0 if neither
const winnerOfGame = (memory1, memory2) => {
  let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  while (true) {
    board = makeMove(board, memory1, 1);
    if (winner(board)) {
      return 1;
    }

    board = makeMove(board, memory2, 2);
    if (winner(board)) {
      return 2;
    }

    // if the board is full, then it's a draw
    if (board.filter((spot) => !spot).length === 0) {
      return 0;
    }
  }
};

for (let oiehgioehg = 0; oiehgioehg < 10000; oiehgioehg++) {
  // now, we do the AI part
  let memories = [{}, {}, {}, {}];
  // for every other board, compete it with the next one
  assert(memories.length % 2 === 0); // must be an even number of memories

  // fight
  for (let i = 0; i < memories.length; i += 2) {
    const winningMemory = winnerOfGame(memories[i], memories[i+1]);
    // if they had a draw, then randomly remove one
    if (!winningMemory) {
      memories[i + Math.round(Math.random())] = null;
    } else {
      const losingMemory = (winningMemory === 1 ? 2 : 1);
      memories[losingMemory] = null;
    }
  }

  // breed the survivors
  let originalLength = memories.length;
  memories = memories.filter(memory => memory !== null); // only the living
  while (memories.length !== originalLength) {
    const randomFather = memories[Math.floor(Math.random() * memories.length)];
    const randomMother = memories[Math.floor(Math.random() * memories.length)];

    const child = {};
    for (let board in randomFather) {
      child[board] = randomFather[board];
    }
    for (let board in randomMother) {
      child[board] = randomMother[board];
    }
    memories.push(child);
  }
}

console.log(memories);
