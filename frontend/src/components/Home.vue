<template>
  <div class="canvas-wrapper">
    <div v-if="this.role == -1" class="play-buttons">
      <h1 v-if="user">Welcome in the pong game, {{user.nickname}} </h1>
      <h1>There are actually {{this.totalRooms}} rooms</h1>
      <h1>Role : {{this.role}}</h1>
      <div class="play-buttons">
        <h1 v-if="this.totalRooms > 0">Click on a room to join it as spectator :</h1>
        <button v-for="i in this.totalRooms" :key="i" v-on:click="joinSpect(i)">Room {{i}}</button>
        <h1>Or click on 'Play' to join a game :</h1>
        <button v-on:click="play()">Play</button>
        <button v-on:click="test()">Test</button>
      </div>
    </div>
    <canvas ref="pong"> </canvas>
    <div v-if="this.role != -1">
      <div class="play-buttons">
        <h1 v-if="this.coords.full">There are 2 players in the room, game can start</h1>
        <h1 v-else>Waiting for a 2nd player...</h1>
        <h1 v-if="this.role == 0">You are a spectator in the room {{this.coords.room}} </h1>
        <h1 v-if="this.role == 1">You are a player 1 in the room {{this.coords.room}} </h1>
        <h1 v-if="this.role == 2">You are a player 2 in the room {{this.coords.room}} </h1>
        <h1>Score : {{this.coords.score1}} - {{this.coords.score2}} </h1>
        <button v-if="this.role != 0 && !this.coords.end" v-on:click="move()">Play</button>
        <button v-if="this.role != 0 && this.coords.end" v-on:click="replay()">Replay</button>
        <button v-on:click="test()">Test</button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import axios from "axios";
import io from 'socket.io-client'
var socket = io('http://localhost:8080', { withCredentials: true });

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export default {
  data() {
    return {
      user: null,
      provider: {
        context: null,
        canvas: null,
      },
      Ballradius: 10,
      raf: this.raf,
      colorBall: "black",
      coords: {
        player1: null,
        player2: null,
        moving: false,
        room: '-1',
        height: 500,
        width: 700,
        posX: getRandomInt(200, 500),
        posY: 0,
        bar1X: 0,
        bar1Y: 220,
        bar2X: 685,
        bar2Y: 220,
        vxBall: -3,
        vyBall: 7,
        score1: 0,
        score2: 0,
        full: false,
        end: false
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

    axios
    .get('/auth/me')
    .then(response => (this.user = response.data))

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
	});

    socket.on("new-coords", coords => {
      let ctx = this.provider.context;
      let height = this.provider.canvas.height;
      let width = this.provider.canvas.width;
      this.coords = coords;
      if (coords.posY == 0 &&
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

    socket.on("end-game", matchHist => {
      console.log('end of the game');
      matchHist.looser.looses++;
      matchHist.winner.wins++;
      axios
      .post('/match-histories/', {
        winner: matchHist.winner,
        looser: matchHist.looser,
        score: matchHist.score
      })
      .then()
      axios
      .patch('/users/same/', matchHist.winner)
      .then()
      axios
      .patch('/users/same/', matchHist.looser)
      .then()
	});

    socket.on("test", data => {
      console.log(data);
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
      socket.emit('play', {
        coords: this.coords,
        user: this.user});
    },
    test: function() {
      //socket.emit('test', 'test first');
      console.log(this.user);
    },
    move: function() {
      console.log('move');
      if (this.coords.moving == false && this.role > 0 && this.coords.full && !this.coords.end) {
        this.coords.moving = true;
        this.moveBall();
      } else {
        return;
      }
    },
    replay: function() {
      socket.emit('replay', this.coords.room);
    },
    moveBall: function() {
      if (this.role < 1)
        return;
      if (!this.coords.moving)
        return;
      socket.emit('move', this.coords.room);
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
