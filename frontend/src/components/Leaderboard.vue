<template>
    <div class="container">
        <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nickname</th>
              <th scope="col">Wins</th>
              <th scope="col">Looses</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) of users" :key="user.id" :fields="fields">
              <td>{{index + 1}}</td>
              <td>{{user.user_nickname}}</td>
              <td>{{user.user_wins}}</td>
              <td>{{user.user_looses}}</td>
              <td>{{(user.user_wins * 3) + (user.user_looses * -2)}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>


<script>
  import axios from "axios";
	export default {
    name: "Leaderboard",
    data(){
      return {
        users: null,
      }
    },
    mounted () {
      axios
      .get('/users/all/')
      .then((response) => {
        this.users = response.data.sort((a, b) => {
          return ((b.user_wins * 3 - b.user_looses * 2) - (a.user_wins * 3 - a.user_looses * 2));
          })
      })
    },
  }
</script>