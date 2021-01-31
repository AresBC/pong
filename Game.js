"use strict"

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

function getOffsetLeft(elem) {
    let offsetLeft = 0;
    do {
        if (!isNaN(elem.offsetLeft)) {
            offsetLeft += elem.offsetLeft;
        }
    } while (elem = elem.offsetParent);
    return offsetLeft;
}

let loop = (gameLoop, fps) => {
    setInterval(() => {
        gameLoop();
    }, 1000 / fps);
}

function initialize() {
    let sc = new Scaler(16, 9, 670);
    let field = new GameField(sc, "game");

    //Test zur Erfassung von der Position des Spielfeldes
    let devFunc = new DevFunc(field);
    devFunc.devPoint("yellow", 0, 0);
    devFunc.devPoint("green", 20, 100);

    let ball = new Ball(sc,25, 100, 100);

    // pre render
    loop(() => {
        ball.move(1,1)

        field.render();
        ball.render();
    }, 60);

}


class DevFunc {

    constructor(gameField) {
        this.gameField = gameField;
    }

    devPoint(color, posX = 0, posY = 0) {
        let ele = document.createElement("div");
        document.body.appendChild(ele);

        let relPosX = () => {
            return getOffsetLeft(this.gameField.gameField)
        };
        let relPosY = () => {
            let bodyRect = document.body.getBoundingClientRect(),
                elemRect = this.gameField.gameField.getBoundingClientRect(),
                offset = elemRect.top - bodyRect.top;
            return offset;
        }

        loop(() => {
            ele.style.position = "absolute";
            ele.style.width = px(25);
            ele.style.height = px(25);
            ele.style.backgroundColor = color;
            ele.style.borderRadius = px(50);
            ele.style.borderTopLeftRadius = px(0);
            ele.style.pos = pz(50);
            ele.style.left = px(relPosX() + posY);
            ele.style.top = px(relPosY() + posX);
        }, 60);
    }

}

class Scaler {
    constructor(displayWidth, displayHeight, absoluteWidth) {
        this.displayWidth = displayWidth;
        this.displayHeight = displayHeight;
        this.absoluteWidth = absoluteWidth;
        this.absoluteHeight = this.calcAbsoluteHeight();
        this.relPosX = undefined;
        this.relPosY = undefined;
    }

    calcAbsoluteHeight() {
        return this.absoluteHeight = this.absoluteWidth / this.displayWidth * this.displayHeight;
    }

    calcRelPositions(gameField) {
        this.relPosX = this.calcRelPosX(gameField);
        this.relPosY = this.calcRelPosY(gameField);
    }

    calcRelPosX(gameField) {
        return getOffsetLeft(gameField.gameField)
    }

    calcRelPosY(gameField) {
        let bodyRect = document.body.getBoundingClientRect(),
            elemRect = gameField.gameField.getBoundingClientRect(),
            offset = elemRect.top - bodyRect.top;
        return offset;
    }

    width(px) {
        return this.absoluteWidth / this.displayWidth / 100 * px;
    }

    height(px) {
        return this.absoluteHeight / this.displayHeight / 100 * px;
    }

}

class Ball{
    constructor(sc, size, x, y) {
        this.sc = sc;
        this.x = this.sc.relPosX + x;
        this.y = this.sc.relPosY + y;
        this.relPosX = x;
        this.relPosY = y;
        this.size = size;
        this.color = "blue";
        this.ball = document.createElement("div");
        document.body.appendChild(this.ball);
        this.ball.style.position = "absolute";
    }

    move(x, y) {
        this.relPosX += x;
        this.relPosY += y;
    }

    render() {
        this.x = this.sc.relPosX + this.relPosX;
        this.y = this.sc.relPosY + this.relPosY;
        this.ball.style.width = px(this.size);
        this.ball.style.height = px(this.size);
        this.ball.style.backgroundColor = this.color;
        this.ball.style.borderRadius = px(50);
        this.ball.style.left = px(this.x);
        this.ball.style.top = px(this.y);
    }
}

class GameField {
    constructor(sc, id) {
        this.sc = sc;
        this.width = this.sc.absoluteWidth;
        this.height = this.sc.absoluteHeight;
        this.id = id;
        leftPlayerScore = 0;
        rightPlayerScore = 0;
        this.gameField = document.getElementById(id);

        this.render();
        this.sc.calcRelPositions(this);
        this.x = this.sc.relPosX;
        this.y = this.sc.relPosY;
    }

    render() {
        this.sc.calcRelPositions(this);
        this.gameField.style.width = px(this.width);
        this.gameField.style.height = px(this.height);
        this.gameField.style.backgroundColor = "red";
        this.gameField.style.margin = px(20);
    }


    getMiddle() {
        return {
            width: (this.x + this.width / 2),
            height: (this.y + this.height / 2)
        };
    }
}

initialize();
