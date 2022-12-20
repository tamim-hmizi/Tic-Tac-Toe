const items = document.querySelectorAll(".item");
const body = document.querySelector("body");
const restartbtn = document.querySelector(".restart");
const settingbtn = document.querySelector(".settings");
const formcontainer = document.querySelector(".form");
const form = document.querySelector("form");
const player1AI = document.querySelector('input[name="player1AI"');
const player2AI = document.querySelector('input[name="player2AI"');
const player1input = document.querySelector('input[name="player1"]');
const player2input = document.querySelector('input[name="player2"]');

const player = (mark, name, turn, AI) => ({ mark, name, turn, AI });

const player1 = player("X", "X", true, false);
const player2 = player("O", "O", false, false);

const Gameboard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const render = () => {
    for (let i = 0; i < items.length; i += 1) items[i].textContent = board[i];
  };

  const addToBoard = (index, mark) => {
    board[index] = mark;
  };

  const gameOver = () => {
    for (let i = 0; i < board.length; i += 1) if (board[i] === "") return false;
    return true;
  };

  const winner = () => {
    const combinations = [
      [0, 1, 2],
      [0, 3, 6],
      [3, 4, 5],
      [6, 7, 8],
      [1, 4, 7],
      [2, 4, 6],
      [2, 5, 8],
      [0, 4, 8],
    ];
    for (let i = 0; i < combinations.length; i += 1) {
      if (
        player1.mark === board[combinations[i][0]] &&
        player1.mark === board[combinations[i][1]] &&
        player1.mark === board[combinations[i][2]]
      )
        return player1.name;

      if (
        player2.mark === board[combinations[i][0]] &&
        player2.mark === board[combinations[i][1]] &&
        player2.mark === board[combinations[i][2]]
      )
        return player2.name;
    }
    if (gameOver()) return "draw";

    return null;
  };
  const clearBoard = () => {
    for (let i = 0; i < board.length; i += 1) {
      board[i] = "";
    }
  };
  const AIrandom = () => {
    let index = -1;
    let random;
    while (index === -1) {
      random = Math.floor(Math.random() * 9);
      if (board[random] === "") index = random;
    }
    return index;
  };

  return { render, addToBoard, winner, clearBoard, AIrandom };
})();

const flow = (() => {
  const stopEvent = () => {
    items.forEach((item) => item.setAttribute("disabled", "true"));
  };
  const startEvent = () => {
    items.forEach((item) => item.removeAttribute("disabled"));
  };
  const congratulations = (name) => {
    const div = document.createElement("div");
    div.classList.add("congratulations");
    if (name !== "draw") div.textContent = `${name} is the winner !`;
    else div.textContent = "It's a Draw !";
    body.appendChild(div);
  };
  const restart = () => {
    restartbtn.addEventListener("click", () => {
      if (body.lastChild.classList.contains("congratulations")) {
        body.removeChild(body.lastChild);
        items.forEach((item) => item.removeAttribute("disabled"));
      }

      for (let i = 0; i < items.length; i += 1) {
        items[i].textContent = "";
      }
      player1.turn = true;
      player2.turn = false;
      Gameboard.clearBoard();
      if (player1.AI === true && player1.turn === true) {
        Gameboard.addToBoard(Gameboard.AIrandom(), player1.mark);
        Gameboard.render();
        player1.turn = false;
        player2.turn = true;
      }
    });
  };

  const play = () => {
    for (let i = 0; i < items.length; i += 1) {
      items[i].addEventListener("click", () => {
        if (
          player1.turn &&
          items[i].textContent === "" &&
          player1.AI === false
        ) {
          Gameboard.addToBoard(i, player1.mark);
          Gameboard.render();
          player1.turn = false;
          player2.turn = true;
          if (player2.turn === true && player2.AI === true) {
            Gameboard.addToBoard(Gameboard.AIrandom(), player2.mark);
            Gameboard.render();
            player1.turn = true;
            player2.turn = false;
          }
          if (Gameboard.winner() !== null) {
            stopEvent();
            congratulations(Gameboard.winner());
          }
        }
        if (
          player2.turn &&
          items[i].textContent === "" &&
          player2.AI === false
        ) {
          Gameboard.addToBoard(i, player2.mark);
          Gameboard.render();
          player1.turn = true;
          player2.turn = false;
          if (player1.turn === true && player1.AI === true) {
            Gameboard.addToBoard(Gameboard.AIrandom(), player1.mark);
            Gameboard.render();
            player1.turn = false;
            player2.turn = true;
          }
          if (Gameboard.winner() !== null) {
            stopEvent();
            congratulations(Gameboard.winner());
          }
        }
      });
    }
  };
  const AISettings = () => {
    player1AI.addEventListener("click", () => {
      if (player1AI.checked) {
        player1input.value = "";
        player1input.setAttribute("disabled", "true");
        player2AI.setAttribute("disabled", "true");
        player1.name = "PC 1";
        player1.AI = true;
      } else {
        player1input.removeAttribute("disabled");
        player2AI.removeAttribute("disabled");
        player1.name = "X";
        player1.AI = false;
      }
    });
    player2AI.addEventListener("click", () => {
      if (player2AI.checked) {
        player2input.value = "";
        player2input.setAttribute("disabled", "true");
        player1AI.setAttribute("disabled", "true");
        player2.name = "PC 2";
        player2.AI = true;
      } else {
        player2input.removeAttribute("disabled");
        player1AI.removeAttribute("disabled");
        player2.name = "O";
        player2.AI = false;
      }
    });
  };
  const setting = () => {
    settingbtn.addEventListener("click", () => {
      formcontainer.style.scale = 1;
      AISettings();
      stopEvent();
    });
  };

  const submit = () => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (e.srcElement[0].value !== "") player1.name = e.srcElement[0].value;
      if (e.srcElement[2].value !== "") player2.name = e.srcElement[2].value;
      formcontainer.style.scale = 0;
      e.srcElement[0].value = "";
      e.srcElement[2].value = "";
      restartbtn.click();
      startEvent();
      if (player1.AI === true && player1.turn === true) {
        Gameboard.addToBoard(Gameboard.AIrandom(), player1.mark);
        Gameboard.render();
        player1.turn = false;
        player2.turn = true;
      }
    });
  };
  return { play, restart, setting, submit };
})();

flow.play();
flow.restart();
flow.setting();
flow.submit();
