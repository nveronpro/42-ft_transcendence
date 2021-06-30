<template>
    <div class="container-fluid">
      <div class="text-center">
       <input id="server_address" value="/api/users/"/>
       <button v-on:click="pingContainer()">PingTheServer !</button>
      </div>
    </div>
</template>

<script>
  import axios from "axios";
  export default {
    created() {
      this.pingContainer();
    },
    methods: {
      pingContainer() {
        axios
          .get(document.getElementById('server_address').value)
          .then((data) => {
            console.log("the container has been reached !");
            console.log(data);
          })
          .catch((data) => {
            console.log("An error has occured..." + data);
          });
      }
    }
  };
</script>