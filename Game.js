let leftPlayerScore, rightPlayerScore;

function initalize() {
  gameField = new GameField(670, 450, "game");
  gameField.render();
}

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class GameField {
  constructor(width, height, id) {
    this.width = width;
    this.height = height;
    this.id = id;
    leftPlayerScore = 0;
    rightPlayerScore = 0;
    this.gameField = document.getElementById(id);
  }

  render() {
    this.gameField.style.width = this.width + "px";
    this.gameField.style.height = this.height + "px";
    this.gameField.style.backgroundColor = "red";
    this.gameField.style.margin = "20px";
  }
}

initalize();
