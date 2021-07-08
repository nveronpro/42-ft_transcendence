<template>
  <div class="hello">
    <p>
      Hello
      <button v-on:click="test()">Test</button>
    </p>
  </div>
</template>

<script>
import io from 'socket.io-client'
var socket = io('localhost:3000')
export default {
  name: 'HelloWorld',
  created() {
    console.log(socket);
  },
  mounted() {
    socket.on("test", data => {
			console.log(data);
		});
  },
  methods: {
    test() { socket.emit('test', 'coucou'); }
  }
}
</script>
