const BAR_MOVE_LEFT = 0;
const BAR_MOVE_RIGHT = 1;
const GAME_PLAYING = 2;
const GAME_OVER = 3;
const ROCK_BALL_COLLIDED = 4;
const ROCK_BAR_COLLIDED = 5;
let score = 0;
let highScore = 0;

class Bar {
    constructor() {
        this.x = 250;
        this.y = 600;
        this.width = 80;
        this.height = 20;
        this.direction = null;
        this.update = function () {
            if (this.direction === BAR_MOVE_LEFT) {
                if (this.x > 0) {
                    this.x -= 7;
                }
            } else if (this.direction === BAR_MOVE_RIGHT) {
                if (this.x < 500 - this.width) {
                    this.x += 7;
                }
            }
        };
        this.draw = function (ctx) {
            ctx.beginPath();
            let grd = ctx.createLinearGradient(this.x, this.y, this.x, this.y + 15);
            grd.addColorStop(0, "black");
            grd.addColorStop(1, "darkgrey");
            ctx.fillStyle = grd;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }
}

class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.vX = 3;
        this.vY = 6;
        this.update = function () {
            this.y += this.vY;
            this.x += this.vX;
        };
        this.draw = function (ctx) {
            ctx.beginPath();
            let grd = ctx.createRadialGradient(this.x, this.y, this.radius, this.x + 2, this.y - 2, 2);
            grd.addColorStop(0, "darkred");
            grd.addColorStop(1, "white");
            ctx.fillStyle = grd;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

class Rock {
    constructor() {
        this.x = Math.random() * 460 + 25;
        this.y = Math.random() * 350 + 30;
        this.width = 5;
        this.height = 10;
        this.status = null;
        this.update = function () {
            if (this.status === ROCK_BALL_COLLIDED) {
                if (score > 200) {
                    this.y += 10;
                } else if (score > 100) {
                    this.y += 8;
                } else if (score > 50) {
                    this.y += 6;
                } else {
                    this.y += 4;
                }
            }
            if (this.y > 700 || this.status === ROCK_BAR_COLLIDED) {
                this.status = null;
                this.y = Math.random() * 200;
                this.x = Math.random() * 470;
            }
        };
        this.draw = function (ctx) {
            ctx.beginPath();
            let grd = ctx.createRadialGradient(this.x, this.y,3, this.x, this.y - 3,2);
            grd.addColorStop(0, "orange" + "red");
            grd.addColorStop(1, "white");
            ctx.fillStyle = grd;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fill();
            ctx.fillStyle = "white"
        }
    }
}

class Game {
    constructor() {
        this.bar = new Bar();
        this.ball = new Ball(this.bar.x, this.bar.y - 50);
        this.rocks = [
            new Rock(),
            new Rock(),
            new Rock(),
            new Rock(),
            new Rock(),
            new Rock(),
            new Rock(),
            new Rock(),
            new Rock(),
            new Rock(),
            new Rock(),
            new Rock(),
            new Rock(),
            new Rock(),
            new Rock(),
            new Rock(),
            new Rock(),
            new Rock(),
        ];
        this.status = null;
        this.update = function () {
            if (this.status === GAME_PLAYING) {
                this.bar.update();
                this.ball.update();
                this.rocks.forEach((rock) => rock.update());
                this.checkCollision();
            }
        };
        this.draw = function (ctx) {
            ctx.beginPath();
            ctx.clearRect(0, 0, 1000, 1000);
            ctx.drawImage(imgBackground, 0, 0, 500, 700);
            this.bar.draw(ctx);
            this.ball.draw(ctx);
            this.rocks.forEach((rock) => rock.draw(ctx));
            if (this.status === GAME_OVER) {
                ctx.beginPath();
                ctx.font = "30px arial";
                ctx.fillText("Your score : " + score, 140, 250, 300);
                ctx.fillText("Press Space to play again!", 100, 300, 350);
            } else if (game.status === null) {
                ctx.font = "30px arial";
                ctx.fillText("Press Space to play!", 110, 270, 300);
                ctx.font = "18px arial";
                ctx.fillText("Collect orange energy gain extra points.", 80, 300, 500);

            }
            ctx.font = "15px arial";
            ctx.fillText("score: " + score, 290, 20, 100);
            ctx.fillText("high score: " + highScore, 370, 20, 100);
        };
        this.checkCollision = function () {
            ballAndWall();
            ballAndBar();
            rockAndBall();
            rockAndBar();
        };

        this.onLeftArrowPressed = function () {
            this.bar.direction = BAR_MOVE_LEFT;
        };
        this.onRightArrowPressed = function () {
            this.bar.direction = BAR_MOVE_RIGHT;
        };
        this.onSpaceButtonPressed = function () {
            if (game.status === GAME_OVER) {
                game = new Game();
                highScore = score;
                score = 0;
            }
            game.status = GAME_PLAYING;
            if(score === 0) {
                gameScore();
            }
        };
        this.onLeftArrowUp = function () {
            if (this.bar.direction === BAR_MOVE_LEFT) {
                this.bar.direction = null;
            }
        };
        this.onRightArrowUp = function () {
            if (this.bar.direction === BAR_MOVE_RIGHT) {
                this.bar.direction = null;
            }
        };
        this.onUpArrowPressed = function (){};
        this.onDownArrowPressed = function (){}
    }
}

let game = new Game();

function rockAndBall() {
    for (let i = 0; i < game.rocks.length; i++) {
        // va cham tren
        if (game.ball.x + 6 >= game.rocks[i].x && game.ball.x - game.ball.radius <= game.rocks[i].x + game.rocks[i].width + 6) {
            if (game.ball.y + game.ball.radius >= game.rocks[i].y && game.ball.y + game.ball.radius <= game.rocks[i].y + game.ball.vY) {
                game.ball.vY = -game.ball.vY;
                game.rocks[i].status = ROCK_BALL_COLLIDED;
            }
        }
        // va cham duoi
        if (game.ball.x + 6 >= game.rocks[i].x && game.ball.x - game.ball.radius <= game.rocks[i].x + game.rocks[i].width + 6) {
            if (game.ball.y - game.ball.radius <= game.rocks[i].y + game.rocks[i].height && game.ball.y - game.ball.radius >= game.rocks[i].y + game.rocks[i].height + game.ball.vY) {
                game.ball.vY = -game.ball.vY;
                game.rocks[i].status = ROCK_BALL_COLLIDED;
            }
        }
        // va cham trai
        if (game.ball.y + 3 >= game.rocks[i].y && game.ball.y - game.ball.radius <= game.rocks[i].y + game.rocks[i].height + 3) {
            if (game.ball.x + game.ball.radius >= game.rocks[i].x && game.ball.x + game.ball.radius <= game.rocks[i].x + game.ball.vX) {
                game.ball.vX = -game.ball.vX;
                game.rocks[i].status = ROCK_BALL_COLLIDED;
            }
        }
        // va cham phai
        if (game.ball.y + 3>= game.rocks[i].y && game.ball.y - game.ball.radius <= game.rocks[i].y + game.rocks[i].height + 3) {
            if (game.ball.x - game.ball.radius <= game.rocks[i].x + game.rocks[i].height && game.ball.x - game.ball.radius >= game.rocks[i].x + game.rocks[i].height + game.ball.vX) {
                game.ball.vX = -game.ball.vX;
                game.rocks[i].status = ROCK_BALL_COLLIDED;
            }
        }
    }
}

function rockAndBar() {
    for (let i = 0; i < game.rocks.length; i++) {
        if (game.rocks[i].y + game.rocks[i].height >= game.bar.y && game.rocks[i].y + game.rocks[i].height <= game.bar.y + game.bar.height) {
            if (game.rocks[i].x + game.rocks[i].width >= game.bar.x && game.rocks[i].x <= game.bar.x + game.bar.width) {
                game.rocks[i].status = ROCK_BAR_COLLIDED;
                score += 3;
            }
        }
    }
}

function ballAndBar() {
    // va cham tren
    if (game.ball.x + 6>= game.bar.x && game.ball.x - game.ball.radius <= game.bar.x + game.bar.width +6) {
        if (game.ball.y + game.ball.radius >= game.bar.y && game.ball.y + game.ball.radius <= game.bar.y + game.ball.vY) {
            game.ball.vY = -game.ball.vY;
            // if(game.bar.direction === BAR_MOVE_LEFT){
            //     game.ball.vX += game.ball.vX*20/100;
            //     game.ball.vY -= game.ball.vY*20/100;
            //     console.log(Math.abs( game.ball.vX)  + "       " + Math.abs( game.ball.vY));
            // }
            // if(game.bar.direction === BAR_MOVE_RIGHT){
            //     game.ball.vX -= game.ball.vX*20/100;
            //     game.ball.vY += game.ball.vY*20/100;
            //     console.log(Math.abs( game.ball.vX)  + "       " + Math.abs( game.ball.vY));
            // }
        }
    }
    // va cham duoi
    if (game.ball.x + 6 >= game.bar.x && game.ball.x - game.ball.radius <= game.bar.x + game.bar.width + 6) {
        if (game.ball.y - game.ball.radius <= game.bar.y + game.bar.height && game.ball.y - game.ball.radius >= game.bar.y + game.bar.height + game.ball.vY) {
            game.ball.vY = -game.ball.vY;
        }
    }
    // va cham trai
    if (game.ball.y + 3>= game.bar.y && game.ball.y - game.ball.radius <= game.bar.y + game.bar.height + 3) {
        if (game.ball.x + game.ball.radius >= game.bar.x && game.ball.x + game.ball.radius <= game.bar.x + game.ball.vX) {
            game.ball.vX = -game.ball.vX;
            // game.ball.x += 2*game.ball.vX;
            // game.ball.y += 2*game.ball.vY;
        }
    }
    // va cham phai
    if (game.ball.y + 3>= game.bar.y && game.ball.y - game.ball.radius <= game.bar.y + game.bar.height +3) {
        if (game.ball.x - game.ball.radius <= game.bar.x + game.bar.height && game.ball.x - game.ball.radius >= game.bar.x + game.bar.height + game.ball.vX) {
            game.ball.vX = -game.ball.vX;
        }
    }
}

function ballAndWall() {
    if (game.ball.x >= 10) {
        game.ball.vX = -game.ball.vX;
    }
    if (game.ball.x <= 500 - 10) {
        game.ball.vX = -game.ball.vX;
    }
    if (game.ball.y >= 700 - 10) {
        game.ball.vY = -game.ball.vY;
        game.status = GAME_OVER;
    }
    if (game.ball.y <= 10) {
        game.ball.vY = -game.ball.vY;
    }
}

function gameScore() {
    if (game.status === GAME_PLAYING) {
        score += 1;
        setTimeout(gameScore, 1000);
    }
}

