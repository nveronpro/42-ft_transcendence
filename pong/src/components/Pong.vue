
<template>
  <div class="canvas-wrapper">
    <canvas ref="pong" @click="move"> </canvas>
    <div @click="alert()"> </div>
    <div class="play-buttons">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    startingX: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      provider: {
        context: null,
        canvas: null,
      },
      moving: false,
      Ballradius: 10,
      raf: this.raf,
      posX: 300,
      posY: 0,
      barX: 0,
      barY: 220,
      vxBall: -2,
      vyBall: 5,
      colorBall: "black",
    };
  },
  provide() {
    return {
      provider: this.provider,
    };
  },
  mounted() {
    this.provider.context = this.$refs["pong"].getContext("2d");
    this.provider.canvas = this.$refs["pong"];
    this.provider.canvas.width = "700";
    let width = this.provider.canvas.width;
    this.provider.canvas.height = "500";
    window.addEventListener('keydown', (e) =>{
    if(e.keyCode === 38 && this.barY > 0){
      console.log("haut");
      this.barY -= 15;
    }else if (e.keyCode === 40 && this.barY < this.provider.canvas.height-100){
      console.log(this.barX)
      console.log(width);
      console.log("bas");
      this.barY += 15;
    }
    });
    this.drawBar();
  },
  methods: {
    drawBar: function() {
      let ctx = this.provider.context;
      ctx.beginPath();
      ctx.fillRect(this.barX, this.barY, 15, 100);
      ctx.fill();
    },
    drawBall: function() {
      let ctx = this.provider.context;
      ctx.beginPath();
      ctx.arc(this.posX, this.posY, this.Ballradius, 0, Math.PI * 2, true);
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
    move: function() {
      if (!this.moving) {
        this.moving = true;
        this.moveBall();
      } else {
        return;
      }
    },
    moveBall: function() {
      let height = this.provider.canvas.height;
      let width = this.provider.canvas.width;
      let ctx = this.provider.context;
      this.$emit("drawing-made");
      this.clear();
      ctx.clearRect(0, 0, width, height);
      this.drawBall();
      this.drawBar();
      this.posX += this.vxBall;
      this.posY += this.vyBall;
      console.log(this.posX, this.posY)
      if (
        this.posY <= this.barY + 100 &&
        this.posY >= this.barY &&
        this.posX <= 15 && this.posX >= 0
      ) {
        this.vxBall = -this.vxBall;
        console.log(this.barX, this.barY)
        console.log(this.posX, this.posY)
      }
      else if (this.posX + this.vxBall < 0) {
        console.log("died!");
        console.log(this.barX, this.barY)
        console.log(this.posX, this.posY)
        this.moving = false;
        this.$emit("ball-death");
        this.posX = 250;
        this.posY = 0;
        this.barX = 0;
        this.barY = 220;
        ctx.clearRect(0, 0, width, height);
        this.drawBar();
        return;
      }
      if (this.posY + this.vyBall < 0) {
        this.vyBall = -this.vyBall;
      }
      if (this.posY + this.vyBall > height) {
        this.vyBall = -this.vyBall;
      }
      if (this.posX + this.vxBall > width) {
        this.vxBall = -this.vxBall;
      }
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