<template>
  <div id="app">
    <pong
    >
    </pong>
  </div>
</template>

<script>
import Pong from "./components/Pong.vue";
export default {
  name: "App",
  components: {
    Pong,
  },
  data() {
    return {
      startingX: 250,
    };
  },
  methods: {
    setDeath: function() {
      this.start = true;
      this.showDeath = true;
      console.log(this.hasDied);
      setTimeout(() => {
        this.showDeath = false;
        this.score = 0;
        console.log(this.showDeath);
      }, 2000);
    },
  },
};
</script>

<style>
html {
  background-color: rgb(212, 228, 220);
}
</style>
