<template>
  <div class="canvas-wrapper">
    <div v-if="this.role == -1" class="play-buttons">
      <h1 v-if="user">Welcome in the pong game, {{user.nickname}} </h1>
      <h1>There are actually {{this.totalRooms}} rooms</h1>
      <div class="play-buttons">
        <h1 v-if="this.totalRooms > 0">Click on a room to join it as spectator :</h1>
        <button class="btn btn-secondary" v-for="i in this.totalRooms" :key="i" v-on:click="joinSpect(i)">Room {{i}}</button>
        <h1>Or click on 'Play' to join a game :</h1>
        <button class="btn btn-secondary" v-on:click="play()">Play</button>
      </div>
    </div>
    
    <div v-if="this.role != -1">
      <div class="play-buttons">
        
        <h1 v-if="this.role == 0">You are a spectator in the room {{this.coords.room}} </h1>
        <h1 v-if="this.role == 1">You are a player 1 in the room {{this.coords.room}} </h1>
        <h1 v-if="this.role == 2">You are a player 2 in the room {{this.coords.room}} </h1>

        <h3 v-if="this.coords.full">There are 2 players in the room, game can start</h3>
        <h3 v-else>Waiting for a 2nd player...</h3>

        <h1>{{this.coords.score1}} - {{this.coords.score2}} </h1>

                <button class="m-1 btn btn-success" v-if="this.role != 0 && !this.coords.end" v-on:click="move()">Play</button>
                <button class="m-1 btn btn-danger" v-on:click="quit()">Quit</button>
                <button class="m-1 btn btn-secondary" v-if="this.role > 0 && this.coords.vxBall != 3 && this.coords.vxBall != -3" v-on:click="normal()">Normal mode</button>
                <button class="m-1 btn btn-secondary" v-if="this.role > 0 && this.coords.vxBall != 4 && this.coords.vxBall != -4" v-on:click="hard()">Hard mode</button>
                <button class="m-1 btn btn-secondary" v-if="this.role > 0 && this.coords.vxBall != 5 && this.coords.vxBall != -5" v-on:click="insane()">Insane mode</button>
                <button class="m-1 btn btn-secondary" v-if="this.role > 0" v-on:click="normalBg()">Normal background</button>
                <button class="m-1 btn btn-secondary" v-if="this.role > 0" v-on:click="greenBg()">Green background</button>

        <!--<h4 v-if="this.coords.spects.length">They are looking the game :</h4>
        <p v-for="s in this.coords.spects" :key="s">- {{s}}, </p>-->
      </div>
    </div>
    <canvas id="pong" ref="pong"> </canvas>
  </div>
</template>

<script>
/* eslint-disable */
import axios from "axios";
import io from 'socket.io-client'
var socket = io('http://localhost:8080/', {
    path: '/pong/',
    withCredentials: true });
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
        player1: null, // Player1 user object
        player2: null, // Player2 user object
        spects: [], // Spects nicknames array
        socketId1: '', // Socket Id of the player1
        socketId2: '', // Socket Id of the player2
        spectsId: [], // Spects socket Ids array
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
        end: false,
        bar1Top: false,
        bar1Bottom: false,
        bar2Top: false,
        bar2Bottom: false,
        needShift: false,
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
    socket.on("rooms", totalRooms => {
      console.log('total rooms ' + totalRooms)
			this.totalRooms = totalRooms;
    });

    axios
    .get('/auth/me')
    .then(response => {
        this.user = response.data;
        socket.emit('init', response.data.id);
    })
  },

  mounted() {
    this.provider.context = this.$refs["pong"].getContext("2d");
    this.provider.canvas = this.$refs["pong"];
    this.provider.canvas.width = "700";
    this.provider.canvas.height = "500";

    socket.on("rooms", totalRooms => {
      console.log('total rooms2 ' + totalRooms)
			this.totalRooms = totalRooms;
		});

    window.addEventListener('keydown', (e) =>{
    if(e.keyCode === 38 && this.role == 1){
      socket.emit('bar1-top', {
        room: this.coords.room,
        bol: true});
    }else if (e.keyCode === 40 && this.role == 1){
      socket.emit('bar1-bottom', {
        room: this.coords.room,
        bol: true});
    }
    });
    
    window.addEventListener('keyup', (e) =>{
    if(e.keyCode === 38 && this.role == 1){
      socket.emit('bar1-top', {
        room: this.coords.room,
        bol: false});
    }else if (e.keyCode === 40 && this.role == 1){
      socket.emit('bar1-bottom', {
        room: this.coords.room,
        bol: false});
    }
    });
    
    window.addEventListener('keydown', (e) =>{
    if(e.keyCode === 38 && this.role == 2){
      socket.emit('bar2-top', {
        room: this.coords.room,
        bol: true});
    }else if (e.keyCode === 40 && this.role == 2){
      socket.emit('bar2-bottom', {
        room: this.coords.room,
        bol: true});
    }
    });
    
    window.addEventListener('keyup', (e) =>{
    if(e.keyCode === 38 && this.role == 2){
      socket.emit('bar2-top', {
        room: this.coords.room,
        bol: false});
    }else if (e.keyCode === 40 && this.role == 2){
      socket.emit('bar2-bottom', {
        room: this.coords.room,
        bol: false});
    }
    });
    

    socket.on("rooms", totalRooms => {
			this.totalRooms = totalRooms;
      console.log('total rooms3 ' + totalRooms)
	});

    socket.on("role", data => {
			this.role = data.role;
			this.totalRooms = data.totalRooms;
      this.coords.room = data.room;
      if (this.role > -1)
        document.getElementById("pong").style.opacity='1';
      else
        document.getElementById("pong").style.opacity='0';
      if (this.role > 0) {
        axios.post('/users/status/ingame').then()}
      else if (this.role == 0)
        axios.post('/users/status/spectator').then()
      else
        axios.post('/users/status/online').then()
  	});

    socket.on("reset", totalRooms => {
      //console.log('reset');
      socket.leave(this.coords.room);
			this.role = -1;
			this.totalRooms = totalRooms;
      this.coords.room = "-1";
	  });

    socket.on("stop-move", data => {
      this.coords.moving = false;
	  });

    socket.on("new-coords", coords => {
      //console.log(coords)
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

    socket.on("normal-bg", data => {
      document.getElementById("pong").style.removeProperty('background-color');
      document.getElementById("pong").style.backgroundImage='url("../../public/background.jpg")';
      document.getElementById("pong").style.backgroundSize='cover';
	  });

    socket.on("green-bg", data => {
      document.getElementById("pong").style.removeProperty('background-image');
      document.getElementById("pong").style.removeProperty('background-size');
      document.getElementById("pong").style.backgroundColor='darkgray';
	  });

    socket.on("end-game", matchHist => {
      axios
      .post('/match-histories/', {
        winner: matchHist.winner,
        looser: matchHist.looser,
        score: matchHist.score
      })
      .then()
  	});

      socket.on("test", data => {
      socket.emit('test', data);
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
    joinSpect: function(room) {
      socket.emit('spect', {
        room: room,
        user: this.user});
    },
    play: function() {
      socket.emit('play', {
        coords: this.coords,
        user: this.user});
    },
    normalBg: function() {
      if (!this.coords.moving)
        socket.emit('normal-bg', this.coords.room);
    },
    greenBg: function() {
      if (!this.coords.moving)
        socket.emit('green-bg', this.coords.room);
    },
    normal: function() {
      if (!this.coords.moving)
        socket.emit('normal', this.coords.room);
    },
    hard: function() {
      if (!this.coords.moving)
        socket.emit('hard', this.coords.room);
    },
    insane: function() {
      if (!this.coords.moving)
        socket.emit('insane', this.coords.room);
    },
    quit: function() {
      if (this.coords.moving)
        return ;
      socket.emit('quit', null);
    },
    move: function() {
      if (this.coords.moving == false && this.role > 0 && this.coords.full && !this.coords.end) {
        this.coords.moving = true;
        socket.emit('set-move', this.coords.room);
        this.moveBall();
      } else {
        return;
      }
    },
    moveBall: function() {
      if (this.role < 1 || !this.coords.moving)
        return;
      socket.emit('move', this.coords.room);
      if (!this.coords.moving)
        return ;
    },
  },
};
</script>

<style scope>
canvas {
  border: 3px solid black;
  border-radius: 5px;
  background-color: darkgray;
  background-image: url("../../public/background.jpg");
  background-size:cover;
  opacity: 0;
}
.canvas-wrapper {
  padding-top: 35px;
  margin: 0px auto;
  text-align: center;
}

</style>
