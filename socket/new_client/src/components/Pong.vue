<template>
  <div class="canvas-wrapper">
    <canvas ref="pong"> </canvas>
    <div @click="alert()"> </div>
    <div class="play-buttons">
      <h1 v-if="this.coords.spect == false">You are a player</h1>
      <h1 v-else>You are a spectator</h1>
    </div>
    <div class="play-buttons">
      <button v-if="this.coords.spect == false" v-on:click="beSpect()">Be a spectator</button>
      <button v-if="this.coords.spect == false" v-on:click="move()">Play</button>
      <button v-if="this.coords.spect == true" v-on:click="bePlayer()">Be a player</button>
      <button v-if="this.coords.spect == true" v-on:click="moveSpect()">Follow the game</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
var socket = io('localhost:3000')
export default {
  data() {
    return {
      provider: {
        context: null,
        canvas: null,
      },
      Ballradius: 10,
      raf: this.raf,
      colorBall: "black",
      coords: {
        moving: false,
        height: 500,
        width: 700,
        posX: 300,
        posY: 0,
        barX: 0,
        barY: 220,
        vxBall: -2,
        vyBall: 5,
        spect: false
      },
    };
  },

  provide() {
    return {
      provider: this.provider,
    };
  },

  created() {
    console.log(socket);
    socket.emit('new-co', this.coords);
    socket.on("is-spect", coords => {
      console.log('spect mode : ' + coords.spect);
			this.coords = coords;
		});
  },

  mounted() {
    this.provider.context = this.$refs["pong"].getContext("2d");
    this.provider.canvas = this.$refs["pong"];
    this.provider.canvas.width = "700";
    this.provider.canvas.height = "500";
    var spect = this.coords.spect;

    window.addEventListener('keydown', (e) =>{
    if(e.keyCode === 38 && this.coords.barY > 0 && spect == false){
      socket.emit('bar-top', this.coords);
    }else if (e.keyCode === 40 && this.coords.barY < this.provider.canvas.height-100 && spect == false){
      console.log(this.coords.barX)
      socket.emit('bar-bottom', this.coords);
    }
    });

    socket.on("is-spect", coords => {
      console.log('spect mode : ' + coords.spect);
			this.coords = coords;
		});

    socket.on("new-coords", coords => {
      let ctx = this.provider.context;
      this.coords = coords;
      if (coords.posX == 250 &&
        coords.posY == 0 &&
        coords.barX == 0 &&
        coords.barY == 220) {
        ctx.clearRect(0, 0, coords.width, coords.height);
        this.drawBar();
      }
      let height = this.provider.canvas.height;
      let width = this.provider.canvas.width;
      this.clear();
      ctx.clearRect(0, 0, width, height);
      this.drawBall();
      this.drawBar();
		});
  },
  methods: {
    drawBar: function() {
      let ctx = this.provider.context;
      ctx.beginPath();
      ctx.fillRect(this.coords.barX, this.coords.barY, 15, 100);
      ctx.fill();
    },
    drawBall: function() {
      let ctx = this.provider.context;
      ctx.beginPath();
      ctx.arc(this.coords.posX, this.coords.posY, this.Ballradius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.colorBall;
      ctx.fill();
    },
    clear: function() {
      let ctx = this.provider.context;
      let canvas = this.provider.canvas;
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    bePlayer: function() {
      socket.emit('be-player', this.coords);
    },
    beSpect: function() {
      socket.emit('be-spect', this.coords);
    },
    move: function() {
      console.log('move');
      if (!this.coords.moving || this.coords.spect == false) {
        this.coords.moving = true;
        this.moveBall();
      } else {
        return;
      }
    },
    moveSpect: function() {
      let height = this.provider.canvas.height;
      let width = this.provider.canvas.width;
      let ctx = this.provider.context;
      this.clear();
      ctx.clearRect(0, 0, width, height);
      this.drawBall();
      this.drawBar();
      this.raf = window.requestAnimationFrame(this.moveSpect);
    },
    moveBall: function() {
      socket.emit('move', this.coords);
      this.raf = window.requestAnimationFrame(this.moveBall);
    },
  },
};
</script>

<style scope>
canvas {
  border: 3px solid black;
  border-radius: 5px;
  background-color: darkgray;
}
.canvas-wrapper {
  padding-top: 35px;
  margin: 0px auto;
  text-align: center;
}

</style>
