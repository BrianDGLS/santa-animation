window.onload = () => init();

const $ = document.querySelector('canvas').getContext('2d');

const w = ($.canvas.width = window.innerWidth);
const h = ($.canvas.height = window.innerHeight);

const GRAVITY = 0.125;
const limit = 60;
const snow = [];
const presentLimit = 8;
const presents = [];
const presentImages = [...document.querySelectorAll('.present')];

const sample = arr => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.random() * (max - min) + min;

const inScreen = ({ x, y }) => x > 0 && x < w && y > 0 && y < h;

const renderSnow = snow =>
  snow.map(flake => {
    $.save();
    $.translate(flake.x, flake.y);
    $.fillStyle = `rgba(255,255,255,${flake.alpha})`;
    switch (flake.type) {
      case 1:
        $.fillRect(0, 0, 4, 4);
        break;
      case 2:
        $.fillRect(-4, 0, 4, 4);
        $.fillRect(0, -4, 4, 4);
        $.fillRect(0, 4, 4, 4);
        $.fillRect(4, 0, 4, 4);
        break;
    }
    $.restore();
  });

const updateSnow = snow =>
  snow.map((flake, index) => {
    flake.x = flake.dir
      ? flake.x + Math.sin(flake.angle) * 0.6
      : flake.x - Math.cos(flake.angle) * 0.6; //+= flake.vx;
    flake.y += flake.vy;
    flake.updateAlpha();
    flake.angle += 0.01;
    if (!inScreen(flake)) {
      snow[index] = SnowFlakeFactory.randomSnowFlake();
    }
  });

const renderPresents = presents =>
  presents.map(present => {
    $.save();
    $.translate(present.x, present.y);
    if(present.image instanceof Image) {
      $.drawImage(present.image, 0, 0);
    }
    $.restore();
  });

const updatePresents = presents =>
  presents.map((present, index) => {
    present.vy += GRAVITY;

    present.y += present.vy;
    present.x += present.vx;

    if (!inScreen(present)) {
      presents[index] = PresentFactory.randomPresent();
    }
  });

const drawFrame = () => {
  requestAnimationFrame(drawFrame);
  $.clearRect(0, 0, w, h);

  updateSnow(snow);
  renderSnow(snow);
  updatePresents(presents);
  renderPresents(presents);
};

const init = () => {
  document.body.appendChild($.canvas);

  for (let i = 20; i > 0; i--) {
    snow.push(SnowFlakeFactory.randomSnowFlake());
  }

  for (let i = 0; i < presentLimit; i++) {
    presents.push(PresentFactory.randomPresent());
  }

  const addSnow = setInterval(() => {
    if (snow.length < limit) {
      snow.push(SnowFlakeFactory.randomSnowFlake());
    } else {
      clearInterval(addSnow);
    }
  }, 500);

  const addPresent = setInterval(() => {
    if (presents.length < presentLimit) {
      presents.push(PresentFactory.randomPresent());
    } else {
      clearInterval(addPresent);
    }
  }, 500);

  drawFrame();
};

class SnowFlakeFactory {
  static create(options = {}, id = Math.random()) {
    return Object.assign(new SnowFlake(), options);
  }

  static randomSnowFlake() {
    return SnowFlakeFactory.create({
      x: randomInt(0, w),
      y: randomInt(0, h / 2),
      vy: randomInt(0.5, 1.5),
      vx: randomInt(-0.5, 0.5),
      alpha: 0.1,
      type: Math.random() > 0.1 ? 1 : 2,
      dir: Math.random() > 0.5
    });
  }
}

class SnowFlake {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.vx = 0;
    this.angle = 0;
    this.alpha = 0;
    this.dir = false;

    this.type = 1;

    this.fade = 'in';
    this.fadeIn = 0.003;
    this.fadeOut = 0.008;
  }

  updateAlpha() {
    if (this.alpha > 0.8) {
      this.fade = 'out';
    }

    if (this.fade === 'out') {
      this.alpha -= this.fadeOut;
    } else if (this.fade === 'in') {
      this.alpha += this.fadeIn;
    }
  }
}

class PresentFactory {
  static create(options = {}, id = Math.random()) {
    return Object.assign(new Present(), options);
  }

  static randomPresent() {
    return PresentFactory.create({
      image: sample(presentImages),
      x: w / 2 - 150,
      y: h / 2 - 120,
      vx: randomInt(-6, 0),
      vy: randomInt(-4, 4)
    });
  }
}

class Present {
  constructor() {
    this.image = undefined;
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.vx = 0;
    this.rotation = 0;
    this.vr = 0.05;
    this.image = undefined;
  }
}
