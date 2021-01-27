let leftPlayerScore, rightPlayerScore;

function px(num) {
  return num + "px";
}
function pz(num) {
  return num + "%";
}
function pt(num) {
  return num + "pt";
}

function initalize() {
  gameField = new GameField(670, 450, "game");
  gameField.render();
  ball = new Ball(50, gameField.getMiddle().width, gameField.getMiddle().height);
  ball.render();
}



class Ball {
  constructor(size, x, y) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.setColor("blue");
  }

  setColor(color) {
    this.color = color;
  }

  render() {
    this.ball = document.createElement("div");
    document.body.appendChild(this.ball);
    this.ball.style.width = px(this.size);
    this.ball.style.height = px(this.size);
    this.ball.style.backgroundColor = this.color;
    this.ball.style.borderRadius = pz(50);
    this.ball.style.pos = pz(50);
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

  getMiddle() {
    return {
      width: this.width / 2,
      height: this.height / 2
    };
  }
}

initalize();
