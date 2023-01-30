import CanvasOption from "./js/CanvasOption.js";
import Particle from "./js/Particle.js";
import { hypotenuse, randomNumBetween } from "./js/utils.js";

class Canvas extends CanvasOption {
  constructor() {
    // 부모에서 선언된 함수를 자식 class에서 사용할 수 있도록 하는 method
    super();

    this.particles = [];
  }

  init() {
    this.canvasWidth = innerWidth;
    this.canvasHeight = innerHeight;
    this.canvas.width = this.canvasWidth * this.dpr;
    this.canvas.height = this.canvasHeight * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    this.canvas.style.width = this.canvasWidth + "px";
    this.canvas.style.height = this.canvasHeight + "px";

    this.createParticles();
  }

  createParticles() {
    const PARTICLE_NUM = 400;
    const x = randomNumBetween(0, this.canvasWidth);
    const y = randomNumBetween(0, this.canvasHeight);

    for (let i = 0; i < PARTICLE_NUM; i++) {
      const r =
        randomNumBetween(2, 100) * hypotenuse(innerWidth, innerHeight) * 0.0001;
      const angle = (Math.PI / 180) * randomNumBetween(0, 360);

      const vx = r * Math.cos(angle);
      const vy = r * Math.sin(angle);

      const opacity = randomNumBetween(0.6, 0.9);
      this.particles.push(new Particle(x, y, vx, vy, opacity));
    }
  }

  render() {
    let now, delta;
    let then = Date.now();

    const frame = () => {
      requestAnimationFrame(frame);
      now = Date.now();
      delta = now - then;

      if (delta < this.interval) return;

      // #00000010 과 같은 뜻
      this.ctx.fillStyle = this.bgColor + "40";
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      this.particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        if (particle.opacity < 0) this.particles.splice(index, 1);
      });

      then = now - (delta % this.interval);
    };
    requestAnimationFrame(frame);
  }
}

const canvas = new Canvas();

window.addEventListener("load", () => {
  canvas.init();
  canvas.render();
});

window.addEventListener("resize", () => {
  canvas.init();
});
