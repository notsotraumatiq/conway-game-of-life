import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import classes from "./Game.module.css";

// Global  Variables

const NUM_ROWS = 50;
const NUM_COLUMNS = 50;

const NEIGHBORS = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const GENERATE_EMPTY_GRID = () => {
  const rows = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    rows.push(Array.from(Array(NUM_COLUMNS), () => 0));
  }
  return rows;
};

const Game = () => {
  const [grid, setGrid] = useState(() => {
    return GENERATE_EMPTY_GRID();
  });
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);

  runningRef.current = running;
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    //   Simulate
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let rowIndex = 0; rowIndex < NUM_ROWS; rowIndex++) {
          for (let columnIndex = 0; columnIndex < NUM_COLUMNS; columnIndex++) {
            let neighborsCount = 0;
            NEIGHBORS.forEach(([x, y]) => {
              const newRowIndex = rowIndex + x;
              const newColumnIndex = columnIndex + y;
              if (
                newRowIndex >= 0 &&
                newRowIndex < NUM_ROWS &&
                newColumnIndex >= 0 &&
                newColumnIndex < NUM_COLUMNS
              ) {
                neighborsCount += g[newRowIndex][newColumnIndex];
              }
            });

            if (neighborsCount < 2 || neighborsCount > 3) {
              // DIES
              gridCopy[rowIndex][columnIndex] = 0;
            } else if (g[rowIndex][columnIndex] === 0 && neighborsCount === 3) {
              // LIVES
              gridCopy[rowIndex][columnIndex] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, 1000);
  }, []);

  let outputRows = grid.map((row, rowIndex) =>
    row.map((column, columnIndex) => (
      <div
        key={`${rowIndex}-${columnIndex}`}
        className={classes.Grid}
        onClick={() => {
          const newGrid = produce(grid, (gridCopy) => {
            gridCopy[rowIndex][columnIndex] = grid[rowIndex][columnIndex]
              ? 0
              : 1;
          });
          setGrid(newGrid);
        }}
        style={{
          backgroundColor: grid[rowIndex][columnIndex]
            ? "lightblue"
            : undefined,
        }}
      ></div>
    ))
  );
  return (
    <>
      <div
        className={classes.Main}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${NUM_COLUMNS}, 20px)`,
        }}
      >
        {outputRows}
      </div>
      <button
        className={classes.Button}
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "Stop" : "Start"}
      </button>

      <button
        className={classes.Button}
        onClick={() => setGrid(GENERATE_EMPTY_GRID())}
      >
        Clear
      </button>
      <button
        className={classes.Button}
        onClick={() => {
          let rows = [];
          for (let i = 0; i < NUM_ROWS; i++) {
            rows.push(
              Array.from(Array(NUM_COLUMNS), () =>
                Math.random() > 0.5 ? 1 : 0
              )
            );
          }
          console.log(rows);
          setGrid(rows);
        }}
      >
        Randomize
      </button>
    </>
  );
};

export default Game;
