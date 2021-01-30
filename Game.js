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

function devPoint(color, posX, posY) {
    let div = document.createElement("div");
    document.body.appendChild(div);
    div.style.position = "absolute";
    div.style.backgroundColor = color;
    div.style.borderRadius = px(50);
    div.style.borderTopLeftRadius = px(0);
    div.style.left = px(posX);
    div.style.top = px(posY);
    div.style.width = px(25);
    div.style.height = px(25);
    console.log(div);
}

function getOffsetLeft(elem) {
    let offsetLeft = 0;
    do {
        if (!isNaN(elem.offsetLeft)) {
            offsetLeft += elem.offsetLeft;
        }
    } while (elem = elem.offsetParent);
    return offsetLeft;
}

function initalize() {
    gameField = new GameField(670, 450, "game");
    gameField.render();
    ball = new Ball(
        50,
        gameField.getMiddle().width,
        gameField.getMiddle().height
    );
    //Test zur Erfassung von der Position des Spielfeldes
    console.log(gameField.getMiddle().width);
    console.log(gameField.getMiddle().height);
    ball.render();

    let bodyRect = document.body.getBoundingClientRect(),
        elemRect = gameField.gameField.getBoundingClientRect(),
        offset = elemRect.top - bodyRect.top;
    devPoint("yellow",getOffsetLeft(gameField.gameField), offset);
}


class Ball {
    constructor(size, x, y) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.setColor("blue");
        this.ball = document.createElement("div");
        document.body.appendChild(this.ball);
        this.ball.style.position = "absolute";
    }

    setColor(color) {
        this.color = color;
    }

    render() {
        this.ball.style.width = px(this.size);
        this.ball.style.height = px(this.size);
        this.ball.style.backgroundColor = this.color;
        this.ball.style.borderRadius = px(50);
        this.ball.style.pos = pz(50);
        this.ball.style.left = px(this.x);
        this.ball.style.top = px(this.x);
    }
}

class BrowserWindow {
    constructor() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
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

        this.browserWindow = new BrowserWindow();
    }

    render() {
        this.gameField.style.width = this.width + "px";
        this.gameField.style.height = this.height + "px";
        this.gameField.style.backgroundColor = "red";
        this.gameField.style.margin = "20px";
    }

    getMiddle() {
        return {
            // width: (this.browserWindow.width / 2) + (this.width / 2),
            // height: (this.browserWindow.height / 2) + (this.height / 2)
            width: (this.browserWindow.width / 2),
            height: (this.browserWindow.height / 2)
        };
    }
}

initalize();
