(() => {
  const config = {
    dotMinRad: 4,
    dotMaxRad: 10,
    sphereRad: 300,
    bigDotRad: 25,
    mouseSize: 120,
    massFactor: 0.002,
    defColor: "rgba(250, 10, 30, 0.9)",
    smooth: 0.85,
  }

  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  let w, h, mouse, dots;

  class Dot {
    constructor(r) {
      this.pos = {x: mouse.x, y: mouse.y}
      this.vel = {x: 0, y: 0}
      this.rad = r || (Math.random() * (config.dotMaxRad - config.dotMinRad) + config.dotMinRad);
      this.mass = this.rad * config.massFactor;
      this.color = config.defColor;
    }

    draw(x, y) {
      this.pos.x = x || this.pos.x + this.vel.x;
      this.pos.y = y || this.pos.y + this.vel.y;
      createHearth(this.pos.x, this.pos.y, this.rad, true, this.color);
      createHearth(this.pos.x, this.pos.y, this.rad, false, config.defColor);
    }
  }

  function updateDots() {
    for(let i = 1; i < dots.length; i++) {
      let acc = {x: 0, y: 0}

      for(let j = 0; j < dots.length; j++) {
        if (i == j) continue;
        let [a, b] = [dots[i], dots[j]];

        let delta = {x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y}
        let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
        let force = (dist - config.sphereRad) / dist * b.mass;

        if (j == 0) {
          let alpha = config.mouseSize / dist;
          a.color = `rgba(250, 10, 30, ${alpha})`;
          dist < config.mouseSize ? force = (dist - config.mouseSize) * b.mass : force = a.mass;
        }

        acc.x += delta.x * force;
        acc.y += delta.y * force;
      }

      dots[i].vel.x = dots[i].vel.x * config.smooth + acc.x * dots[i].mass;
      dots[i].vel.y = dots[i].vel.y * config.smooth + acc.y * dots[i].mass;
    }

    dots.map(e => e == dots[0] ? e.draw(mouse.x, mouse.y) : e.draw());
  }

  function createHearth(x, y, rad, fill, color) {
    ctx.fillStyle = ctx.strokeStyle = color;

    if (rad === 25){
      rad = 3
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x, y - (3/rad), x - (5/rad), y - (15/rad), x - (25/rad), y - (15/rad));
    ctx.bezierCurveTo(x-(55/rad), y-(15/rad), x-(55/rad), y+(22.5/rad), x-(55/rad), y+(22.5/rad));
    ctx.bezierCurveTo(x-(55/rad), y+(40/rad), x-(35/rad), y+(62/rad), x, y+(80/rad));
    ctx.bezierCurveTo(x+(35/rad), y+(62/rad), x+(55/rad), y+(40/rad), x+(55/rad), y+(22.5/rad));
    ctx.bezierCurveTo(x+(55/rad), y+(22.5/rad), x+(55/rad), y-(15/rad), x+(25/rad), y-(15/rad));
    ctx.bezierCurveTo(x+(10/rad), y-(15/rad), x, y-(3/rad), x, y);
    ctx.closePath();
    
    fill ? ctx.fill() : ctx.stroke();
  }

  function init() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;

    mouse = {x: w / 2, y: h / 2, down: false}
    dots = [];

    dots.push(new Dot(config.bigDotRad))
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);

    if (mouse.down) { dots.push(new Dot()); }
    updateDots();

    window.requestAnimationFrame(loop);
  }

  init();
  loop();

  function setPos({layerX, layerY}) {
    [mouse.x, mouse.y] = [layerX, layerY];
  }

  function isDown() {
    mouse.down = !mouse.down;
  }

  ["mousemove", "touchmove"].forEach((i) => {
    canvas.addEventListener(i, setPos);
  });

  ["mousedown", "touchstart"].forEach((i) => {
    window.addEventListener(i, isDown);
  });

  ["mouseup", "touchend"].forEach((i) => {
    window.addEventListener(i, isDown);
  });
  
})();