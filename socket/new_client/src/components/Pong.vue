<template>
  <div class="canvas-wrapper">
    <canvas ref="pong"> </canvas>
    <div @click="alert()"> </div>
    <div class="play-buttons">
      <h1 v-if="this.role == 0">You are a spectator</h1>
      <h1 v-if="this.role == 1">You are a player 1</h1>
      <h1 v-if="this.role == 2">You are a player 2</h1>
    </div>
    <div class="play-buttons">
      <button v-if="this.role != 0" v-on:click="beSpect()">Be a spectator</button>
      <button v-if="this.role != 0" v-on:click="move()">Play</button>
      <button v-if="this.role == 0" v-on:click="bePlayer1()">Be a player 1</button>
      <button v-if="this.role == 0" v-on:click="bePlayer2()">Be a player 2</button>
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
        bar1X: 0,
        bar1Y: 220,
        bar2X: 685,
        bar2Y: 220,
        vxBall: -2,
        vyBall: 5,
        score1: 0,
        score2: 0
      },
      role: 0
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
    socket.on("role", role => {
      console.log('role mode : ' + role);
			this.role = role;
		});
  },

  mounted() {
    this.provider.context = this.$refs["pong"].getContext("2d");
    this.provider.canvas = this.$refs["pong"];
    this.provider.canvas.width = "700";
    this.provider.canvas.height = "500";

    window.addEventListener('keydown', (e) =>{
    if(e.keyCode === 38 && this.coords.bar1Y > 0 && this.role == 1){
      console.log('haut');
      socket.emit('bar1-top', this.coords);
    }else if (e.keyCode === 40 && this.coords.bar1Y < this.provider.canvas.height-100 && this.role == 1){
      socket.emit('bar1-bottom', this.coords);
    }
    });

    window.addEventListener('keydown', (e) =>{
    if(e.keyCode === 38 && this.coords.bar2Y > 0 && this.role == 2){
      socket.emit('bar2-top', this.coords);
    }else if (e.keyCode === 40 && this.coords.bar2Y < this.provider.canvas.height-100 && this.role == 2){
      socket.emit('bar2-bottom', this.coords);
    }
    });

    socket.on("role", role => {
      console.log('role mode : ' + role);
			this.role = role;
		});

    socket.on("new-coords", coords => {
      let ctx = this.provider.context;
      this.coords = coords;
      if (coords.posX == 300 &&
        coords.posY == 0 &&
        coords.bar1X == 0 &&
        coords.bar2Y == 220 &&
        coords.bar2X == 685 &&
        coords.bar2Y == 220) {
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
      ctx.fillRect(this.coords.bar1X, this.coords.bar1Y, 15, 100);
      ctx.fillRect(this.coords.bar2X, this.coords.bar2Y, 15, 100);
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
    bePlayer1: function() {
      this.role = 1;
      console.log('role mode : ' + this.role);
    },
    bePlayer2: function() {
      this.role = 2;
      console.log('role mode : ' + this.role);
    },
    beSpect: function() {
      this.role = 0;
      console.log('role mode : ' + this.role);
    },
    move: function() {
      console.log('move');
      if (this.coords.moving == false && this.role != 0) {
        this.coords.moving = true;
        this.moveBall();
      } else {
        return;
      }
    },
    moveBall: function() {
      if (!this.coords.moving)
        return;
      if (this.role != 0)
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
