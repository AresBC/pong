"use strict"

// document.addEventListener('keyup', function (evt) {
//     if (evt.keyCode === 81) {
//         console.clear();
//     }
// });
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
    let field = new GameField(sc, "game", "black");
    let rectangle1 = new Rectangle(field,  sc.width(30), sc.height(250),sc.width(20),sc.height(30),"white");
    let rectangle2 = new Rectangle(field,  sc.width(30), sc.height(250),sc.width(1550),sc.height(30),"white");

//Test zur Erfassung von der Position des Spielfeldes
    let devFunc = new DevFunc(field);
    devFunc.devPoint("yellow", sc.height(1600), sc.width(900));

    let ball = new Ball(field, sc.width(50), 100, 100, "white");
    ball.speed(1, 1);

// pre render
    loop(() => {
        field.render();
        rectangle1.render();
        rectangle2.render();
        ball.render();
    }, 1000);


    document.addEventListener('keydown', function (evt) {
        if (evt.key === "s") {
            rectangle1.move(0, 7)
        }
        if (evt.key === "w") {
            rectangle1.move(0, -7)
        }
        if (evt.key === "ArrowDown") {
            rectangle2.move(0, 7)
        }
        if (evt.key === "ArrowUp") {
            rectangle2.move(0, -7)
        }
    });


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
            ele.style.left = px(relPosX() + posX);
            ele.style.top = px(relPosY() + posY);
        }, 60);
    }

}

class Object {
    constructor(gameField, width, height, x, y, color) {
        this.sc = gameField.sc;
        this.x = this.sc.relPosX + x;
        this.y = this.sc.relPosY + y;
        this.relPosX = x;
        this.relPosY = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.obj = document.createElement("div");
        document.body.appendChild(this.obj);
        this.obj.style.position = "absolute";
        this.speed();
    }

    move(x, y) {
        this.relPosX += x;
        this.relPosY += y;
    }

    speed(x = 0, y = 0) {
        this.speeds = {
            x: x,
            y: y
        }
    }

    render() {
        this.relPosX += this.speeds.x;
        this.relPosY += this.speeds.y;
        this.x = this.sc.relPosX + this.relPosX + this.speeds.x;
        this.y = this.sc.relPosY + this.relPosY + this.speeds.y;
        this.obj.style.width = px(this.width);
        this.obj.style.height = px(this.height);
        this.obj.style.backgroundColor = this.color;
        this.obj.style.left = px(this.x);
        this.obj.style.top = px(this.y);
        this.collusion();
    }

    collusion() {
        if (this.sc.absoluteWidth < (this.relPosX + this.width)) {
            this.speeds.x *= -1;
        }
        if (0 > (this.relPosX + this.speeds.x)) {
            this.speeds.x *= -1;
        }
        if (0 > (this.relPosY + this.speeds.y)) {
            this.speeds.y *= -1;
        }
        if (this.sc.absoluteHeight < (this.relPosY + this.height)) {
            this.speeds.y *= -1;
        }
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

class Ball extends Object{
    constructor(gameField, width, x, y, color) {
        super(gameField, width, width, x, y, color);
    }

    move(x, y) {
        this.relPosX += x;
        this.relPosY += y;
    }

    speed(x = 0, y = 0) {
        this.speeds = {
            x: x,
            y: y
        }
    }

    render() {
        super.render();
        this.obj.style.borderRadius = px(50);
    }

}

class Rectangle extends Object{

}

class GameField {
    constructor(sc, id, color) {
        this.sc = sc;
        this.width = this.sc.absoluteWidth;
        this.height = this.sc.absoluteHeight;
        this.id = id;
        this.color = color;
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
        this.gameField.style.backgroundColor = this.color;
        this.gameField.style.margin = px(20);
    }

}

initialize();
