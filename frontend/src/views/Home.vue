<template>
    <div class="container-fluid">
      <div class="text-center">
        <h1>Nest Customer List App Tutorial</h1>
       <p> Built with Nest.js and Vue.js</p>
       <button> UPDATE </button>
       <button v-on:click="login()">LOGIN</button>
       <input id="server_address" value="/api/users/"/>
       <button v-on:click="pingContainer()">PingTheServer !</button>
       <div v-if="customers.length === 0">
            <h2> No customer found at the moment </h2>
        </div>
      </div>

        <div class="">
            <table class="table table-bordered">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Firstname</th>
                  <th scope="col">Lastname</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Address</th>
                  <th scope="col">Description</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="customer in customers" :key="customer._id">
                  <td>{{ customer.first_name }}</td>
                  <td>{{ customer.last_name }}</td>
                  <td>{{ customer.email }}</td>
                  <td>{{ customer.phone }}</td>
                  <td>{{ customer.address }}</td>
                  <td>{{ customer.description }}</td>
                  <td>
                    <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group" style="margin-bottom: 20px;">
                                  <router-link :to="{name: 'Edit', params: {id: customer._id}}" class="btn btn-sm btn-outline-secondary">Edit Customer </router-link>
                                  <button class="btn btn-sm btn-outline-secondary" v-on:click="deleteCustomer(customer._id)">Delete Customer</button>
                                </div>
                              </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
    </div>
</template>
<script>
import { server } from "../helper";
import axios from "axios";
export default {
  data() {
    return {
      customers: []
    };
  },
  created() {
    //this.fetchCustomers();
    //this.pingContainer();
  },
  methods: {
    fetchCustomers() {
      axios
        .get(`${server.baseURL}/customer/customers`)
        .then((data) => {
          this.customers = data.data;
          console.log("all user received:");
          console.log(data);
        });
    },
    /*
    deleteCustomer(id) {
      axios
        .delete(`${server.baseURL}/customer/delete?customerID=${id}`)
        .then(data => {
          console.log(data);
          window.location.reload();
        });
    },
    */
    pingContainer() {
        axios
            .get(document.getElementById('server_address').value)
            .then((data) => {
                console.log("the container has been reached !");
                console.log(data);
        console.log(data.url);
        window.location.href = data.url;
            })
            .catch((data) => {
                console.log("An error has occured...");
                console.log(data);
            });
    }, 
    login() {
        axios
            .get("/api/auth/login")
            .then((data) => {
                console.log("the container has been reached !");
                console.log("data: " + data);
                console.log("data.url: " + data.url);
                console.log("data.data: " + data.data);
                console.log("data.data.url: " + data.data.url);
				console.log("data.data.url: " + "\"" + data.data.url + "\"");
                window.location.href = "\"" + data.data.url + "\"";
            })
            .catch((data) => {
                console.log("An error has occured...");
                console.log(data);
            });
    }
  }
};
</script>