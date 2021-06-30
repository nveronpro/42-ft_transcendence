<template>
	<div>
		<div v-if="user === null">
			<div class="px-4 py-5 my-5 text-center">
				<h1 class="display-5 fw-bold">FT_TRANSCENDENCE</h1>
				<div class="col-lg-6 mx-auto">
				<p class="lead mb-4">Connect you with your 42 account</p>
					<div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
						<button type="button" class="btn btn-primary" onclick='window.location.href="http://localhost:3000/auth/login"'>Login</button>
					</div>
				</div>
			</div>
		</div>
		<div v-else>
			<nav class="navbar navbar-expand-md navbar-dark bg-dark mb-3">
				<div class="container-fluid">
					<a href="#" class="navbar-brand mr-3">FT_TRANSCENDENCE</a>
					<button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="collapse navbar-collapse" id="navbarCollapse">
						<div class="navbar-nav">
							<router-link class="nav-item nav-link" to="/home">Home</router-link>
							<router-link class="nav-item nav-link" to="/Leaderboard">Leaderboard</router-link>
							<router-link class="nav-item nav-link" to="/friends">Friends</router-link>
							<router-link class="nav-item nav-link" to="/stats">Stats</router-link>
							<router-link class="nav-item nav-link" to="/profile">Profile</router-link>
							<router-link class="nav-item nav-link" to="/test">Test</router-link>

						</div>
						<div class="navbar-nav ml-auto">
							<div v-if="user !== null">
								<button type="button" class="btn btn-primary" onclick='window.location.href="http://localhost:3000/auth/logout"'>Logout as {{ user.login }}</button>
							</div>
						</div>
					</div>
				</div>    
			</nav>
			<router-view/>
			<footer-view/>
		</div>
	</div>
</template>

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