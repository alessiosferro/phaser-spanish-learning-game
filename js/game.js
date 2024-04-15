// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {

  this.words = this.words = [{
    key: 'building',
    setXY: {
      x: 90,
      y: 240
    },
    spanish: 'edificio'
  },
    {
      key: 'house',
      setXY: {
        x: 260,
        y: 270
      },
      spanish: 'casa'
    },
    {
      key: 'car',
      setXY: {
        x: 440,
        y: 290
      },
      spanish: 'automóvil'
    },
    {
      key: 'tree',
      setXY: {
        x: 570,
        y: 260
      },
      spanish: 'árbol'
    }
  ];
}

// load asset files for our game
gameScene.preload = function() {
  this.load.image('background', 'assets/images/background-city.png');
  this.load.image('building', 'assets/images/building.png');
  this.load.image('car', 'assets/images/car.png');
  this.load.image('house', 'assets/images/house.png');
  this.load.image('tree', 'assets/images/tree.png');

  this.load.audio('treeAudio', 'assets/audio/arbol.mp3');
  this.load.audio('carAudio', 'assets/audio/auto.mp3');
  this.load.audio('houseAudio', 'assets/audio/casa.mp3');
  this.load.audio('correctAudio', 'assets/audio/correct.mp3');
  this.load.audio('wrongAudio', 'assets/audio/wrong.mp3');
  this.load.audio('buildingAudio', 'assets/audio/edificio.mp3');
};

// executed once, after assets were loaded
gameScene.create = function() {
  this.items = this.add.group(this.words);

  this.add.sprite(0, 0, 'background').setOrigin(0);

  this.items.setDepth(1);

  this.correctSound = this.sound.add('correctAudio');
  this.wrongSound = this.sound.add('wrongAudio');

  const sprites = this.items.getChildren();

  for (let i = 0; i < sprites.length; i++) {
    const item = sprites[i];

    item.setInteractive();

    item.on('pointerdown', function () {
      if (this.words[i].spanish === this.nextWord.spanish) {

        this.tweens.add({
          targets: item,
          scaleX: .9,
          scaleY: .9,
          duration: 200,
          yoyo: true,
        });

        this.correctSound.play();

        return this.showNextQuestion();
      }

      this.wrongSound.play();

      this.tweens.add({
        targets: item,
        angle: 90,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 200,
        yoyo: true,
      });

    }, this);

    item.on('pointerover', () => {
      this.tweens.addCounter({
        from: 255,
        to: 188,
        onUpdate: (tween) => {
          const value = Math.floor(tween.getValue());
          const color = Phaser.Display.Color.GetColor(value, value, value);
          item.setTint(color);
        },
        duration: 200,
      });
    });

    item.on('pointerout', () => {
      this.tweens.addCounter({
        from: 188,
        to: 255,
        onUpdate: (tween) => {
          const value = Math.floor(tween.getValue());
          const color = Phaser.Display.Color.GetColor(value, value, value);
          item.setTint(color);
        },
        duration: 200,
      });
    });

    this.words[i].sound = this.sound.add(`${item.texture.key}Audio`);
  }

  this.wordText = this.add.text(30, 20, '', {
    font: '40px Arial',
    fill: '#fff'
  });

  this.showNextQuestion();
};

gameScene.showNextQuestion = function () {
  this.nextWord = Phaser.Math.RND.pick(this.words);
  this.nextWord.sound.play();
  this.wordText.setText(this.nextWord.spanish);
}

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
  title: 'Spanish Learning Game',
  pixelArt: false,
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
