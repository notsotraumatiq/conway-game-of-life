import React from "react";
import Game from "./StatelessFunctionalComponents/Game/Game";

import classes from "./App.module.css";

function App() {
  return (
    <div className={classes.App}>
      <h1>This game is dedicated to John Horton Conway 1937 - 2020</h1>
      <Game />
    </div>
  );
}

export default App;
