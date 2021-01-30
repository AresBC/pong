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

function initalize() {
    let sc = new Scaler(16, 9, 670);
    let gameField = new GameField(sc.absoluteWidth, sc.absoluteHeight, "game");
    gameField.render();
    let ball = new Ball(
        50,
        gameField.getMiddle().width,
        gameField.getMiddle().height
    );

    ball.render();


    //Test zur Erfassung von der Position des Spielfeldes
    let devFunc = new DevFunc(gameField);
    devFunc.devPoint("yellow", 10, 10);

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
            console.log("loop");
        }, 60);
    }

}

class Scaler {
    constructor(displayWidth, displayHeight, absoluteWidth) {
        this.displayWidth = displayWidth;
        this.displayHeight = displayHeight;
        this.absoluteWidth = absoluteWidth;
        this.absoluteHeight = this.calcAbsoluteHeight();
    }

    calcAbsoluteHeight() {
        return this.absoluteHeight = this.absoluteWidth / this.displayWidth * this.displayHeight;
    }

    width(px) {
        return this.absoluteWidth / this.displayWidth / 100 * px;
    }

    height(px) {
        return this.absoluteHeight/ this.displayHeight / 100 * px;
    }

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
