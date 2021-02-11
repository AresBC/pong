class PongBall extends Ball {
    borderCollusion() {
        if (this.sc.absoluteWidth < (this.relPosX + this.width + (this.speeds.x * this.speeds.x * 2))) {
            this.points.playerTwo++;
            this.game.updatePointsP2(this.points.playerTwo);
            this.resetPos();
            let speedXY = this.randomSpeed(this.speeds.start);
            this.speeds.x = speedXY[0];
            this.speeds.y = speedXY[1];
        }

        if (0 > (this.relPosX - (this.speeds.x * this.speeds.x * 2))) {
            this.points.playerOne++;
            this.game.updatePointsP1(this.points.playerOne);
            this.resetPos();
            let speedXY = this.randomSpeed(this.speeds.start);
            this.speeds.x = speedXY[0];
            this.speeds.y = speedXY[1];
        }
        if (0 > (this.relPosY + this.speeds.y)) {
            this.speeds.y *= -1;
        }
        if (this.sc.absoluteHeight < (this.relPosY + this.height)) {
            this.speeds.y *= -1;
        }
    }
}


class Pong {

    addPlayerOnePoints() {
        this.playerOnePoints++;
    }

    addPlayerTwoPoints() {
        this.playerTwoPoints++;
    }

    constructor(ai = false) {
        this.is_ai = ai;
        this.playerOnePoints = 0;
        this.playerTwoPoints = 0;
    }

    initializeRelPos() {
        this.devFunc = new DevFunc(this.field);
    }

    initialize() {
        this.createGameField();
        this.initializeRelPos();
        this.createPlayers();
        this.createBall();
        this.test("yellow", 900, 1600);
        this.ai1 = this.is_ai === true ? new AI(this.rectangle2, this.ball) : undefined;
        this.ai2 = this.is_ai === true ? new AI(this.rectangle1, this.ball) : undefined;
        this.gameLoop();
        this.keyEvents();
    }

    updatePointsP1(points) {
        this.counterLeft.obj.innerHTML = points;
    }

    updatePointsP2(points) {
        this.counterRight.obj.innerHTML = points;
    }

    test(color, height, width) {
        //Test zur Erfassung von der Position des Spielfeldes
        let devFunc = new DevFunc(this.field);
        // devFunc.devPoint(color, this.sc.width(0), this.sc.height(0));

        let sizeX = 100;
        let sizeY = 21;

        this.counter = new Rectangle(
            this.field,
            sizeX,
            sizeY,
            this.sc.width(width) / 2 - 100 / 2,
            this.sc.height(height) / 40,
            "rgb(20,20,25)"
        );
        this.counter.render();
        this.counter.obj.style.borderRadius = px(5);
        this.counter.obj.style.border = "0.01px solid white";

        this.counterRight = new Rectangle(
            this.field,
            sizeX / 2,
            sizeY,
            this.sc.width(width) / 2 - 100 / 2,
            this.sc.height(height) / 40,
            "rgba(0,0,0,0)"
        );
        this.counterRight.render();
        this.counterRight.obj.innerHTML = "0";
        this.counterRight.obj.style.color = "white";
        this.counterRight.obj.style.textAlign = "center";

        this.counterLeft = new Rectangle(
            this.field,
            sizeX / 2,
            sizeY,
            this.sc.width(width) / 2,
            this.sc.height(height) / 40,
            "rgba(0,0,0,0)"
        );
        this.counterLeft.render();
        this.counterLeft.obj.innerHTML = "0";
        this.counterLeft.obj.style.color = "white";
        this.counterLeft.obj.style.textAlign = "center";
        this.counterLeft.obj.style.borderLeft = "2px dotted white";


    }

    createPlayers() {
        this.rectangle1 = new Player(this.field, this.sc.width(30), this.sc.height(250), this.sc.width(20), this.sc.height(30), "white");
        this.rectangle2 = new Player(this.field, this.sc.width(30), this.sc.height(250), this.sc.width(1550), this.sc.height(30), "white");
    }

    createBall() {
        this.ball = new PongBall(
            this,
            this.field,
            this.sc.width(50),
            this.sc.absoluteWidth / 2,
            this.sc.absoluteHeight / 2,
            "white");

        this.ball.speed(1);
    }

    createGameField() {
        this.sc = new Scaler(16, 9, 670);
        this.field = new GameField(this.sc, "game", "black");
    }

    playerCollusionDirectory() {
        this.ball.collusion();
        this.directionChange = true;
        setTimeout(() => {
            this.directionChange = false;
        }, 1000);
        this.ball.speeds.x *= 1.1;
        this.ball.speeds.y *= 1.1;
    }

    playerCollusion() {
        if (
            !this.directionChange
            && this.ball.getTop() > this.rectangle1.getTop()
            && this.ball.getBottom() < this.rectangle1.getBottom()
            && this.ball.getLeft() < this.rectangle1.getRight()
        ) {
            this.playerCollusionDirectory();
        }

        if (
            !this.directionChange
            && this.ball.getTop() > this.rectangle2.getTop()
            && this.ball.getBottom() < this.rectangle2.getBottom()
            && this.ball.getRight() > this.rectangle2.getLeft()
        ) {
            this.playerCollusionDirectory();
        }
    }

    gameLoop() {
        this.directionChange = false;
        let speedX = this.ball.speeds.x;
        let speedY = this.ball.speeds.y;
        loop(() => {
            this.playerCollusion();

            this.field.render();
            this.rectangle1.render();
            this.rectangle2.render();
            if (this.is_ai) this.ai1.render();
            if (this.is_ai) this.ai2.render();
            this.ball.render();
            this.counter.render();
            this.counterRight.render();
            this.counterLeft.render();
            // if ((
            //     this.ball.getTop() > this.rectangle1.getTop()
            //     && this.ball.getTop() < this.rectangle1.getBottom()
            // ) || (
            //     this.ball.getBottom() > this.rectangle1.getBottom()
            //     && this.ball.getBottom() < this.rectangle1.getTop()
            // )) {
            //     this.ball.speeds.x = 0;
            //     this.ball.speeds.y = 0;
            // }
        }, 1000);
    }

    keyEvents() {
        let keyState = {};
        window.addEventListener('keydown', function (e) {
            keyState[e.key] = true;
        }, true);
        window.addEventListener('keyup', function (e) {
            keyState[e.key] = false;
        }, true);

        let keyLoop = () => {
            if (keyState["w"]) this.rectangle1.move(0, -1);
            if (keyState["s"]) this.rectangle1.move(0, 1);
            if (keyState["ArrowDown"]) this.rectangle2.move(0, 1);
            if (keyState["ArrowUp"]) this.rectangle2.move(0, -1);

            setTimeout(keyLoop, 1);
        }
        keyLoop();
    }

}

class AI {
    constructor(player, ball) {
        this.player = player;
        this.ball = ball;
    }

    render() {
        // let posBall = this.ball.getMiddleY() + this.ball.relPosY;
        // let posPlayer = this.player.getMiddleY() + this.player.relPosY;
        let posBall = this.ball.relPosY + this.ball.width / 2;
        let posPlayer = this.player.relPosY + this.player.height / 2;
        if (posBall < posPlayer) {
            this.player.move(0, -0.8);
        }
        if (posBall > posPlayer) {
            this.player.move(0, 0.8);
        }

    }


}
