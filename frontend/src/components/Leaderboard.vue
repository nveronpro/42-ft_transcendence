<template>
    <div class="container">
        <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Login</th>
              <th scope="col">Wins</th>
              <th scope="col">Looses</th>
        <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) of users" :key="user.id" :fields="fields">
              <td>{{index}}</td>
              <td>{{user.user_login}}</td>
              <td>{{user.user_wins}}</td>
              <td>{{user.user_looses}}</td>
              <td>{{user.user_wins * 3 - user.user_looses * 2}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>


<script>
  import axios from "axios";

  export default {
    data(){
      return {
        users: null,
      }
    },
    mounted () {
      axios
      .get('/api/users/all/')
      .then((response) => {
        this.users = response.data.sort((a, b) => {
          return ((b.user_wins * 3 - b.user_loosses * 2) - (a.user_wins * 3 - a.user_loosses * 2));
        })
      })
    },
  }
</script>