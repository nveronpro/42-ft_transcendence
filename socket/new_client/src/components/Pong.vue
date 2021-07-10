<template>
  <div class="canvas-wrapper">
    <div v-if="this.role == -1" class="play-buttons">
      <h1>Welcome in the pong game</h1>
      <h1>There are actually {{this.totalRooms}} rooms</h1>
      <h1>Role : {{this.role}}</h1>
      <div class="play-buttons">
        <h1 v-if="this.totalRooms > 0">Click on a room to join it as spectator :</h1>
        <button v-for="i in this.totalRooms" :key="i" v-on:click="joinSpect(i)">Room {{i}}</button>
        <h1>Or click on 'Play' to join a game :</h1>
        <button v-on:click="play()">Play</button>
      </div>
    </div>
    <canvas ref="pong"> </canvas>
    <div @click="alert()"> </div>
    <div v-if="this.role != -1">
      <div class="play-buttons">
        <h1 v-if="this.coords.full">There are 2 players in the room, game can start</h1>
        <h1 v-else>Waiting for a 2nd player...</h1>
        <h1 v-if="this.role == 0">You are a spectator in the room {{this.coords.room}} </h1>
        <h1 v-if="this.role == 1">You are a player 1 in the room {{this.coords.room}} </h1>
        <h1 v-if="this.role == 2">You are a player 2 in the room {{this.coords.room}} </h1>
        <h1>Score : {{this.coords.score1}} - {{this.coords.score2}} </h1>
        <button v-if="this.role != 0" v-on:click="move()">Play</button>
      </div>
    </div>
  </div>
</template>

<script>

import io from 'socket.io-client'
var socket = io('10.11.12.23:3000')
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
        room: '-1',
        height: 500,
        width: 700,
        posX: 300,
        posY: 0,
        bar1X: 0,
        bar1Y: 220,
        bar2X: 685,
        bar2Y: 220,
        vxBall: -4,
        vyBall: 10,
        score1: 0,
        score2: 0,
        full: false
      },
      role: -1,
      totalRooms: 0
    };
  },

  provide() {
    return {
      provider: this.provider,
    };
  },

  created() {
    console.log(socket);
    socket.on("rooms", totalRooms => {
			this.totalRooms = totalRooms;
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

    socket.on("role", data => {
      console.log('Role : ' + data.role);
      console.log('Room : ' + data.room);
			this.role = data.role;
			this.totalRooms = data.totalRooms;
      this.coords.room = data.room;
      if (this.role != 0)
        this.coords.full = data.full;
		});

    socket.on("is-full", full => {
      this.coords.full = full;
		});

    socket.on("new-coords", coords => {
      let ctx = this.provider.context;
      let height = this.provider.canvas.height;
      let width = this.provider.canvas.width;
      this.coords = coords;
      if (coords.posX == 300 &&
        coords.posY == 0 &&
        coords.bar1X == 0 &&
        coords.bar1Y == 220 &&
        coords.bar2X == 685 &&
        coords.bar2Y == 220) {
        ctx.clearRect(0, 0, coords.width, coords.height);
        this.drawBar();
      }
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
    joinSpect: function(roomNo) {
      socket.emit('spect', roomNo);
    },
    play: function() {
      socket.emit('play', this.coords);
    },
    move: function() {
      console.log('move');
      if (this.coords.moving == false && this.role != 0 && this.coords.full) {
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
