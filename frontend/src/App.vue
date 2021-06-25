<template>
	<div class="container-fluid">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
		<div v-if="user === null">
			<div class="px-4 py-5 my-5 text-center">
				<h1 class="display-5 fw-bold">FT_TRANSCENDENCE</h1>
				<div class="col-lg-6 mx-auto">
				<p class="lead mb-4">Connect with your 42 account</p>
					<div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
						<button type="button" class="btn btn-primary" onclick='window.location.href="http://localhost:3000/auth/login"'>Login</button>
					</div>
				</div>
			</div>
		</div>
		<div v-else>
			<div class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
				<div class="justify-content-center row">
					<div class="col">
						<router-link to="/home">Home</router-link>
					</div>
					<div class="col">
						<router-link to="/friends">Friends</router-link>
					</div>
					<div class="col">
						<router-link to="/stats">Stats</router-link>
					</div>
					<div class="col">
						<router-link to="/profile">Profile</router-link>
					</div>
					<div class="col">
						<router-link to="/test">Test</router-link>
					</div>
				</div>
				<div class="col col-md-2">
					<h1> FT_TRANSCENDENCE </h1>
				</div>
				<div class="col-md-3 text-end">
					<div v-if="user !== null">
						<button type="button" class="btn btn-primary" onclick='window.location.href="http://localhost:3000/auth/logout"'>Logout as {{ user.login }}</button>
					</div>
				</div>
			</div>
			<div id="router-vue">
				<footer-view/>
				<router-view/>
			</div>
		</div>
	</div>
</template>

<style>

#router-vue {
	width: 100%;
	height: 85vh;
	position: relative;
	background: #eae9e9;
}

</style>


<script>
	import ChatComponent from './components/Chat.vue';
	import axios from "axios";

	export default {
		name: 'App',
		components: {
			"footer-view" : ChatComponent
		},
		data(){
			return {
				user: null,
			}
		},
		mounted () {
			axios
			.get('/api/auth/me')
			.then(response => (this.user = response.data))
		}
	}
</script>