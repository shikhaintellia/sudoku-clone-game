import React, { useState, useEffect } from "react";
import "../style/sudoku.css";
import "../style/winModal.css";
import "../style/modal.css";
import { fillBoard } from "../utils/fillTheBoard";
import sodukoStore from "../utils/sudokuStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../CommonComponents/CustomModal";
import {
  faUndo,
  faEraser,
  faPencil,
  faInfoCircle,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { generateHint } from "../utils/generateHint";
import Confetti from "react-confetti";
import Tooltip from "../CommonComponents/Tooltip";

const difficulties = {
  easy: 40,
  medium: 30,
  hard: 20,
};

function generateSudoku(difficulty) {
  const board = Array(9)
    .fill()
    .map(() => Array(9).fill(0));

  // To Fill the board completely
  fillBoard(board);

  // Remove numbers to create the puzzle
  let cellsToRemove = 81 - difficulties[difficulty];
  while (cellsToRemove > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      cellsToRemove--;
    }
  }

  return board;
}

const SudokuGame = () => {
  const {
    setBoard,
    board,
    initialCells,
    setInitialCells,
    selectedCell,
    setSelectedCell,
    difficulty,
    setDifficulty,
    invalidCells,
    setInvalidCells,
    moveHistory,
    setMoveHistory,
  } = sodukoStore();

  const [mistakesCount, setMistakesCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [mistakesModal, setMistakesModal] = useState(false);
  const [winModal, setWinModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [hint, setHint] = useState(null);
  const [hintCount, setHintCount] = useState(3);

  const [notes, setNotes] = useState(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()))
  );
  const [noteMode, setNoteMode] = useState(false);

  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const startNewGame = (diff) => {
    const newBoard = generateSudoku(diff);
    setBoard(newBoard);
    const initial = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (newBoard[i][j] !== 0) {
          initial.push(`${i}-${j}`);
        }
      }
    }
    setInitialCells(initial);
    setSelectedCell(null);
    setMoveHistory([]);
    setInvalidCells([]);
    setTimer(0);
    setIsPaused(false);
    setNoteMode(false);
    setNotes(
      Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => new Set())
      )
    );
  };

  const handleCellClick = (row, col) => {
    if (!isPaused && !initialCells.includes(`${row}-${col}`)) {
      setSelectedCell({ row, col });
      setHint(null);
    }
  };

  const isValidMove = (row, col, value) => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === value) return false;
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === value) return false;
    }

    // Check 3x3 box
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === value) return false;
      }
    }

    return true;
  };

  const handleKeyDown = (event) => {
    if (!isPaused && selectedCell) {
      const { row, col } = selectedCell;
      if (event.key === "Backspace" || event.key === "Delete") {
        if (noteMode) {
          const newNotes = notes.map((row) => row.map((cell) => new Set(cell)));
          newNotes[row][col].clear();
          setNotes(newNotes);
        } else {
          const oldValue = board[row][col];
          const newBoard = board.map((row) => [...row]);
          newBoard[row][col] = 0;
          setBoard(newBoard);
          setInvalidCells(
            invalidCells.filter((cell) => cell !== `${row}-${col}`)
          );
          setMoveHistory([...moveHistory, { row, col, oldValue, newValue: 0 }]);
        }
      } else if (/^[1-9]$/.test(event.key)) {
        const value = parseInt(event.key);
        handleNumberButtonClick(value);
      }
    }
  };

  const updateCellValue = (row, col, value) => {
    const oldValue = board[row][col];
    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = value;
    setBoard(newBoard);

    if (!isValidMove(row, col, value)) {
      setMistakesCount((prevCount) => {
        const newCount = prevCount + 1;
        return newCount;
      });
      setInvalidCells([
        ...invalidCells.filter((cell) => cell !== `${row}-${col}`),
        `${row}-${col}`,
      ]);
    } else {
      setInvalidCells(invalidCells.filter((cell) => cell !== `${row}-${col}`));
    }
    setMoveHistory([...moveHistory, { row, col, oldValue, newValue: value }]);
  };

  const handleNumberButtonClick = (number) => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      if (noteMode) {
        const newNotes = notes.map((row) => row.map((cell) => new Set(cell)));
        if (newNotes[row][col].has(number)) {
          newNotes[row][col].delete(number);
        } else {
          newNotes[row][col].add(number);
        }
        setNotes(newNotes);
      } else {
        updateCellValue(row, col, number);
      }
    }
  };

  function isBoardCompleteAndCorrect(arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (arr[i][j] === 0) {
          return true;
        }
      }
    }
    return false;
  }

  useEffect(() => {
    if (board.length && !isBoardCompleteAndCorrect(board)) {
      if (invalidCells?.length === 0) {
        setTimeout(() => {
          setWinModal(true);
        }, 1);
      } else {
        setTimeout(() => {
          setErrorModal(true);
        }, 1);
      }
    }
  }, [board, invalidCells]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedCell,
    board,
    notes,
    invalidCells,
    moveHistory,
    noteMode,
    isPaused,
  ]);

  useEffect(() => {
    setTimeout(() => {
      if (mistakesCount >= 3) {
        setMistakesModal(true);
      }
    }, 0);
  }, [board, mistakesCount]);

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (isPaused && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPaused, timer]);

  const handleUndo = () => {
    if (moveHistory.length > 0) {
      const lastMove = moveHistory.pop();
      const newBoard = board.map((row) => [...row]);
      newBoard[lastMove.row][lastMove.col] = lastMove.oldValue;
      setBoard(newBoard);
      setMoveHistory(moveHistory);
      setInvalidCells(
        invalidCells.filter(
          (cell) => cell !== `${lastMove.row}-${lastMove.col}`
        )
      );
    }
  };

  const handleErase = () => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      const oldValue = board[row][col];
      const newBoard = board.map((row) => [...row]);
      newBoard[row][col] = 0;
      setBoard(newBoard);
      setInvalidCells(invalidCells.filter((cell) => cell !== `${row}-${col}`));
      setMoveHistory([...moveHistory, { row, col, oldValue, newValue: 0 }]);
    }
  };

  const handleStartNewGameAndCloseModal = () => {
    setMistakesModal(false);
    setWinModal(false);
    setErrorModal(false);
    startNewGame(difficulty);
    setMistakesCount(0);
  };

  const formatTime = (time) => {
    const getSeconds = `0${time % 60}`.slice(-2);
    const minutes = `${Math.floor(time / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);
    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  const showHint = () => {
    if (!isPaused) {
      const newHint = generateHint(board);
      if (newHint) {
        setHint(newHint);
        setHintCount((pre) => pre - 1);
        setSelectedCell({ row: newHint.cell[0], col: newHint.cell[1] });
      } else {
        // For No any hint available
        alert("No obvious hints available at this time.");
      }
    }
  };

  return (
    <>
      <div className={`game-container ${darkMode ? "dark-mode" : ""}`}>
        <div>Ads</div>
        <div className="sudoku-game">
          <div className="controls">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>
          <div className="sudoku-board" tabIndex="0">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="sudoku-row">
                {row.map((cell, colIndex) => {
                  const isHighlighted =
                    selectedCell &&
                    (selectedCell.row === rowIndex ||
                      selectedCell.col === colIndex ||
                      (Math.floor(selectedCell.row / 3) ===
                        Math.floor(rowIndex / 3) &&
                        Math.floor(selectedCell.col / 3) ===
                          Math.floor(colIndex / 3)));

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`sudoku-cell 
                                            ${
                                              selectedCell &&
                                              selectedCell.row === rowIndex &&
                                              selectedCell.col === colIndex
                                                ? "selected"
                                                : ""
                                            } 
                                            ${
                                              isHighlighted ? "highlighted" : ""
                                            }
                                            ${
                                              initialCells.includes(
                                                `${rowIndex}-${colIndex}`
                                              )
                                                ? "initial"
                                                : ""
                                            }
                                            ${
                                              invalidCells.includes(
                                                `${rowIndex}-${colIndex}`
                                              )
                                                ? "invalid"
                                                : ""
                                            }
                                            ${
                                              hint &&
                                              hint.cell[0] === rowIndex &&
                                              hint.cell[1] === colIndex
                                                ? "hint"
                                                : ""
                                            }`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {cell !== 0 ? (
                        cell
                      ) : (
                        <div className="notes">
                          {[...notes[rowIndex][colIndex]].sort().map((note) => (
                            <span key={note}>{note}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
         <div className="button-container">
          <div className="btn-head">
            <span>Mistakes: {mistakesCount}/3</span>
            <span>{formatTime(timer)}</span>
            <span>
              <FontAwesomeIcon
                icon={isPaused ? faPlay : faPause}
                onClick={() => (setIsPaused(!isPaused), setSelectedCell(null))}
              />
            </span>
          </div>
          <div className="btn-row button_section">
            <button
              className="top-btn-col"
              onClick={handleUndo}
              disabled={isPaused}
            >
              <FontAwesomeIcon icon={faUndo} />
            </button>
            <button
              className="top-btn-col"
              onClick={handleErase}
              disabled={isPaused}
            >
              <FontAwesomeIcon icon={faEraser} />
            </button>
            <button
              className="top-btn-col"
              style={{ position: "relative" }}
              onClick={() => setNoteMode((pre) => !pre)}
              disabled={isPaused}
            >
              <div
                className={`${noteMode ? "hint-count" : "hint-count-deactive"}`}
              >
                {noteMode ? "ON" : "OFF"}
              </div>
              <FontAwesomeIcon icon={faPencil} />
            </button>
            <Tooltip content="Get hint to solve the puzzle">
              <button
                className="top-btn-col"
                style={{ position: "relative" }}
                onClick={showHint}
                disabled={hintCount <= 0 || isPaused}
              >
                <div className="hint-count">{hintCount}</div>
                <FontAwesomeIcon icon={faInfoCircle} />
              </button>
            </Tooltip>
          </div>
          <div className="btn-row">
            {[1, 2, 3].map((number) => (
              <button
                key={number}
                disabled={isPaused}
                className="btn-col"
                onClick={() => handleNumberButtonClick(number)}
              >
                {number}
              </button>
            ))}
          </div>
          <div className="btn-row">
            {[4, 5, 6].map((number) => (
              <button
                key={number}
                disabled={isPaused}
                className="btn-col"
                onClick={() => handleNumberButtonClick(number)}
              >
                {number}
              </button>
            ))}
          </div>
          <div className="btn-row">
            {[7, 8, 9].map((number) => (
              <button
                key={number}
                disabled={isPaused}
                className="btn-col"
                onClick={() => handleNumberButtonClick(number)}
              >
                {number}
              </button>
            ))}
          </div>
          <div className="btn-row">
            <button
              className="last-btn-col"
              disabled={isPaused}
              onClick={() => startNewGame(difficulty)}
            >
              New Game
            </button>
          </div>
        </div>
        <div>Ads</div>
      </div>
      <Modal show={mistakesModal} darkMode={darkMode}>
        <>
          <h1 style={{ color: "red" }}>Game Over</h1>
          <p style={{ fontSize: "20px" }}>
            You have made 3 mistakes and lost this Game
          </p>
          <button
            className="modal-button"
            onClick={() => handleStartNewGameAndCloseModal()}
          >
            New Game
          </button>
        </>
      </Modal>
      <Modal show={winModal} darkMode={darkMode}>
        <>
          <h1 style={{ color: "green" }}>Congratulations..</h1>
          <p style={{ fontSize: "20px" }}>You won the game...!!</p>
          <button
            className="modal-button"
            onClick={() => handleStartNewGameAndCloseModal()}
          >
            Start New Game
          </button>
        </>
      </Modal>

      <Modal show={errorModal} darkMode={darkMode}>
        <>
          <h1 style={{ color: "red" }}>Error...</h1>
          <p style={{ fontSize: "20px" }}>Please Enter valid moves...!</p>
          <button className="modal-button" onClick={() => setErrorModal(false)}>
            Ok
          </button>
        </>
      </Modal>
      {hint && (
        <div className="hint-box">
          <p>{hint.message}</p>
        </div>
      )}
      {winModal && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={700}
          recycle={true}
        />
      )}
    </>
  );
};

export default SudokuGame;
