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
    let field = new GameField(sc.absoluteWidth, sc.absoluteHeight, "game");
    sc.calcRelPositions(field);
    field.setRelPositions(sc.relPosX, sc.relPosY);

    //Test zur Erfassung von der Position des Spielfeldes
    let devFunc = new DevFunc(field);
    devFunc.devPoint("yellow", 0, 0);
    devFunc.devPoint("green", 20, 100);

    let ball = new Ball(25, sc.relPosX, sc.relPosY);

    loop(() => {
        ball.render();
        field.render();
    }, 60);
}


class DevFunc {

    constructor(gameField) {
        this.gameField = gameField;
    }

    devPoint(color, posX = 0, posY = 0) {
        let ele = document.createElement("div");
        document.body.appendChild(ele);

        let relPosY = () => {
            return getOffsetLeft(this.gameField.gameField)
        };
        let relPosX = () => {
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
            ele.style.left = px(relPosY() + posY);
            ele.style.top = px(relPosX() + posX);
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

    calcRelPosY(gameField) {
        return getOffsetLeft(gameField.gameField)
    }

    calcRelPosX(gameField) {
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

class Ball {
    constructor(size, x, y) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = "blue";
        this.ball = document.createElement("div");
        document.body.appendChild(this.ball);
        this.ball.style.position = "absolute";
    }

    render() {
        this.ball.style.width = px(this.size);
        this.ball.style.height = px(this.size);
        this.ball.style.backgroundColor = this.color;
        this.ball.style.borderRadius = px(50);
        this.ball.style.left = px(this.x);
        this.ball.style.top = px(this.y);
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

        this.relPosX = undefined;
        this.relPosY = undefined;
    }

    render() {
        this.gameField.style.width = px(this.width);
        this.gameField.style.height = px(this.height);
        this.gameField.style.backgroundColor = "red";
        this.gameField.style.margin = px(20);
    }

    setRelPositions(relPosX, relPosY) {
        this.relPosX = relPosX;
        this.relPosY = relPosY;
    }

    getMiddle() {
        return {
            width: (this.relPosX + this.width / 2),
            height: (this.relPosY + this.height / 2)
        };
    }
}

initialize();
