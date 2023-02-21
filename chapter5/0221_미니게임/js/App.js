import Background from "./Background.js";
import Coin from "./Coin.js";
import GameHandler from "./GameHandler.js";
import Player from "./Player.js";
import Score from "./Score.js";
import Wall from "./Wall.js";

export default class App {
  static canvas = document.querySelector("canvas");
  static ctx = App.canvas.getContext("2d");
  static dpr = devicePixelRatio > 1 ? 2 : 1;
  static interval = 1000 / 60;
  static width = 1024;
  static height = 768;

  // 처음엔 this가 app class를 가르키고 있지만, resize를 할 경우 this가 window를 가르키게 됨
  // 따라서 bind this를 해줌으로써 resize할 때도 this가 app class를 가르키게 해줌
  constructor() {
    // 가장 가까이 있는 이미지는 가장 빠르게, 가장 멀리 있는 이미지는 가장 느리게 움직이게 해서 입체감을 줌
    this.backgrounds = [
      new Background({ img: document.querySelector("#bg3-img"), speed: -1 }),
      new Background({ img: document.querySelector("#bg2-img"), speed: -2 }),
      new Background({ img: document.querySelector("#bg1-img"), speed: -4 }),
    ];

    this.gameHandler = new GameHandler(this);
    this.reset();
  }

  reset() {
    this.walls = [new Wall({ type: "SMALL" })];
    this.player = new Player();
    this.coins = [];
    this.score = new Score();
  }

  init() {
    App.canvas.width = App.width * App.dpr;
    App.canvas.height = App.height * App.dpr;
    App.ctx.scale(App.dpr, App.dpr);

    this.backgrounds.forEach((background) => {
      background.draw();
    });
  }

  render() {
    let now, delta;
    let then = Date.now();
    const frame = () => {
      requestAnimationFrame(frame);
      now = Date.now();
      delta = now - then;
      if (delta < App.interval) return;

      if (this.gameHandler.status !== "PLAYING") return;

      App.ctx.clearRect(0, 0, App.width, App.height);

      // 배경
      this.backgrounds.forEach((background) => {
        background.update();
        background.draw();
      });

      // 벽
      for (let i = this.walls.length - 1; i >= 0; i--) {
        this.walls[i].update();
        this.walls[i].draw();

        // 벽 제거
        if (this.walls[i].isOutside) {
          this.walls.splice(i, 1);
          continue;
        }

        // 벽 생성
        if (this.walls[i].canGenerateNext) {
          this.walls[i].generateNext = true;
          const newWall = new Wall({
            type: Math.random() > 0.3 ? "SMALL" : "BIG",
          });
          this.walls.push(newWall);

          // 코인 생성
          if (Math.random() < 0.5) {
            const x = newWall.x + newWall.width / 2;
            const y = newWall.y2 - newWall.gapY / 2;
            this.coins.push(new Coin(x, y, newWall.vx));
          }
        }

        // 벽과 플레이어 충돌
        if (this.walls[i].isColliding(this.player.boundingBox)) {
          this.gameHandler.status = "FINISHED";
        }
      }

      // 플레이어
      this.player.update();
      this.player.draw();

      // 벽에 부딪히는 경우 외에 하늘 or 땅으로 벗어나는 경우에도 끝나도록 설정
      if (
        this.player.y >= App.height ||
        this.player.y + this.player.height <= 0
      ) {
        this.gameHandler.status = "FINISHED";
      }

      // 코인
      for (let i = this.coins.length - 1; i >= 0; i--) {
        this.coins[i].update();
        this.coins[i].draw();

        if (this.coins[i].x + this.coins[i].width < 0) {
          this.coins.splice(i, 1);
          continue;
        }

        if (this.coins[i].boundingBox.isColliding(this.player.boundingBox)) {
          this.coins.splice(i, 1);
          this.score.coinCount += 1;
        }
      }

      then = now - (delta % App.interval);

      // 점수
      this.score.update();
      this.score.draw();
    };
    requestAnimationFrame(frame);
  }
}
