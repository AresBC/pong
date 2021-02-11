"use strict"
// let imported = document.createElement('script');
// imported.src = '/odin.js';
// document.head.appendChild(imported);

////////////////////////ODIN LIBRARY skeleton///////////////////////////
let $ = (selector = undefined) => {
    if (selector === undefined) return document;
    return document.querySelectorAll(selector);
}

let event = (eventName, elements, callback) => {
    elements.forEach((element) => {
        element.addEventListener(eventName, () => {
            callback(element);
        }, false);
    });
}

function modify(elements, feature) {
    if (NodeList.prototype.isPrototypeOf(elements)) {
        elements.forEach((element) => {
            feature(element);
        });
        return elements;
    }
    feature(elements);
    return elements;
}

let wait = false;
setInterval(() => {
    wait = false;
}, 50)

function showCoords(event) {
    if (wait) return;
    let x = event.clientX;
    let y = event.clientY;
    let coords = "X coords: " + x + ", Y coords: " + y;
    document.getElementById("showCoords").innerHTML = coords;
    wait = true;
}

////////////////////////EVENT FUNCTIONS///////////////////////////

let toggle = (elements) => {
    return modify(elements, (elements) => {
        if (elements.style.display === "none") {
            elements.style.display = "inline-block";
        } else {
            elements.style.display = "none";
        }
    });
}

let hide = (elements) => {
    return modify(elements, (elements) => {
        elements.style.display = "none";
    });
}

let show = (elements) => {
    return modify(elements, (elements) => {
        elements.style.display = "inline-block";
    });
}

let click = (elements, callback) => {
    event("click", elements, (element) => {
        callback(element);
    });
}

let log = (elements) => {
    return modify(elements, (element) => {
        console.log(element);
    });
    return elements;
}

/////////////////////////////////////////////////////////////////////////////////////////////////

// event("click", $("p"), (element) => {
//     log(toggle(element));
// });
//
// click($("#game"), () => {
//     log(toggle($("a")));
// });

// document.addEventListener('keyup', function (evt) {
//     if (evt.keyCode === 81) {
//         console.clear();
//     }
// });

class Logger {

    constructor() {
        this.is_timeout = false;
    }

    delay(sec) {
        setTimeout(() => {
            this.is_timeout = false;
        }, sec);
    }

    logAfterSeconds(messages, sec) {
        if (!this.is_timeout) {
            this.is_timeout = true;
            this.delay(sec);
            messages.forEach(message => console.log(message));
        }
    }

}


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

class DevFunc {

    constructor(gameField) {
        this.gameField = gameField;
    }

    relPosX() {
        return getOffsetLeft(this.gameField.gameField)
    }

    relPosY() {
        let bodyRect = document.body.getBoundingClientRect(),
            elemRect = this.gameField.gameField.getBoundingClientRect(),
            offset = elemRect.top - bodyRect.top;
        return offset;
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

    setBottom() {
        this.bottom = this.relPosY + this.height;
    }

    getBottom() {
        this.setBottom();
        return this.bottom;
    }

    setTop() {
        this.top = this.relPosY;
    }

    getTop() {
        this.setTop();
        return this.top;
    }

    setRight() {
        this.right = this.relPosX + this.width;
    }

    getRight() {
        this.setRight();
        return this.right;
    }

    setLeft() {
        this.left = this.relPosX;
    }

    getLeft() {
        this.setLeft();
        return this.left;
    }

    getMiddleX() {
        return this.getRight() + this.width / 2;
    }
    getMiddleY() {
        return this.getBottom() + this.height / 2;
    }

    constructor(gameField, width, height, x, y, color) {
        this.gameField = gameField;
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

    preRender() {

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
        this.borderCollusion();
        this.preRender();
    }

    borderCollusion() {
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

    collusion() {
        this.speeds.x *= -1;
    }

    randomSpeed(ballSpeed) {
        let percent = Math.floor(this.randomNumber(0, 0.75) * 100) / 100;
        let x = (1 - percent) * ballSpeed;
        let y = percent * ballSpeed;
        if (Math.random() > 0.5) x *= -1;
        if (Math.random() > 0.5) y *= -1;
        return [x, y];
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

class Ball extends Object {
    constructor(game, gameField, width, x, y, color) {
        super(gameField, width, width, x, y, color);
        this.game = game;
        this.points = {
            playerOne: 0,
            playerTwo: 0,
        }
    }

    move(x, y) {
        this.relPosX += x;
        this.relPosY += y;
    }

    randomNumber(min, max) {
        return Math.random() * (min + max) - min;
    }


    speed(ballSpeed) {
        let speedXY = this.randomSpeed(ballSpeed);
        let x = speedXY[0];
        let y = speedXY[1];

        this.startSpeeds = {
            x: x,
            y: y
        }
        this.speeds = {
            start: ballSpeed,
            x: x,
            y: y
        }
    }
    preRender() {
        console.log(this.width);
        if (this.height > this.width) {
            this.width = this.height;
        } else {
            this.height = this.width;
        }

    }

    render() {
        super.render();
        this.obj.style.width = px(this.width);
        this.obj.style.height = px(this.width);
        this.obj.style.borderRadius = px(10000);
    }

    resetPos() {
        this.relPosX = this.game.sc.absoluteWidth / 2;
        this.relPosY = this.game.sc.absoluteHeight / 2;
    }

}

class Rectangle extends Object {

}

class Player extends Rectangle {


    render() {
        super.render();
    }

    move(x, y) {
        if (
            this.getTop() >= 0 + this.speeds.y
            && this.getBottom() <= this.sc.absoluteHeight
        ) {
            this.relPosY += y;
        } else {
            if (this.getTop() < 0 - this.relPosY) this.relPosY = 0;
            if (this.getBottom() > this.sc.absoluteHeight) this.relPosY = this.sc.absoluteHeight - this.height;
        }
        this.relPosX += x;
    }
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
