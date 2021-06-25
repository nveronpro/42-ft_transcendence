<template>
    <div class="container-fluid">
      <div class="text-center">
       <input id="server_address" value="/api/users/"/>
       <button v-on:click="pingContainer()">PingTheServer !</button>
       <button v-on:click="ft_login()">LOGIN !</button>
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
      async ft_login() {
        window.location.href = "http://localhost:3000/auth/login";
      },
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