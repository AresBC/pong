class FunkyPongBall extends PongBall {
    setRandomColor() {
        let r = Math.floor(this.randomNumber(0, 255));
        let g = Math.floor(this.randomNumber(0, 255));
        let b = Math.floor(this.randomNumber(0, 255));
        this.color = "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

class FunkyPong extends Pong {
    createBall() {
        this.ball = new FunkyPongBall(
            this,
            this.field,
            this.sc.width(100),
            this.sc.absoluteWidth / 2,
            this.sc.absoluteHeight / 2,
            "white");

        this.ball.speed(1);
    }

    playerCollusion() {
        let ballTop = this.ball.getTop()
        let ballBottom = this.ball.getBottom()
        let rectangleTop = this.rectangle1.getTop()
        let rectangleBottom = this.rectangle1.getBottom()
        if (
            !this.directionChange
            && (((
                ballTop < rectangleTop
                && ballTop > rectangleBottom
            ) || (
                ballBottom < rectangleBottom
                && ballBottom > rectangleTop
            )) || ((
                ballTop > rectangleTop
                && ballTop < rectangleBottom
            ) || (
                ballBottom > rectangleBottom
                && ballBottom < rectangleTop
            )))
            && this.ball.getLeft() <= this.rectangle1.getRight()
        ) {
            this.playerCollusionDirectory();
            this.ball.setRandomColor();
            this.ball.width += 10;
            this.rectangle1.color = this.ball.color;
        }
        rectangleTop = this.rectangle2.getTop()
        rectangleBottom = this.rectangle2.getBottom()

        if (
            !this.directionChange
            && (((
                ballTop < rectangleTop
                && ballTop > rectangleBottom
            ) || (
                ballBottom < rectangleBottom
                && ballBottom > rectangleTop
            )) || ((
                ballTop > rectangleTop
                && ballTop < rectangleBottom
            ) || (
                ballBottom > rectangleBottom
                && ballBottom < rectangleTop
            )))
            && this.ball.getRight() > this.rectangle2.getLeft()
        ) {
            this.playerCollusionDirectory();
            this.ball.setRandomColor();
            this.ball.width += 10;
            this.rectangle2.color = this.ball.color;
        }
    }

    gameLoop() {
        super.gameLoop();
        loop(() => {
            this.ball.setRandomColor();
        }, 5);
    }


}

let funkyPong = new FunkyPong(true);
funkyPong.initialize();
