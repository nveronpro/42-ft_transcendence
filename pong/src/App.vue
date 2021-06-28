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
};
</script>

<style>
html {
  background-color: rgb(212, 228, 220);
}
</style>
