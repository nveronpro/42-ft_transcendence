<template>
	<div class="container">
		<div class="row">
			<div class="col-4">
				<div class="card">
					<div class="card-body text-center">
						<img :src="'data:image/png;base64,' + user[0].user_avatar" class="card-img" alt="...">
					</div>
				</div>
			</div>
			<div class="col-8">
				<div class="card h-100">
					<div class="card-body">
						<h5 class="card-title fs-1 mb-1">{{user[0].user_login}}</h5>
						<p class="card-text mb-5">Joueur pro de pong</p>
					</div>
					<div class="card-footer bg-transparent border-Secondary">
						<p class="card-text mb-auto"><small class="text-muted">{{user[0].user_current_status}}</small></p>
						<button v-on:click="send(user[0].user_id)" type="button" class="btn btn-outline-success ml-auto mb-3">
								<i class="fas fa-plus"></i>
						</button>
						<button v-on:click="remove(user[0].user_id)" type="button" class="btn btn-outline-danger ml-auto mb-3">
							<i class="fas fa-minus"></i>
						</button>
					</div>
				</div>
			</div>
			<div class="col-12">
				<div class="p-3 border bg-light h-100 overflow-auto">
					<div v-for="match_history in match_histories" :key="match_history.id" class="row mb-3 mr-1 ml-1 p-2">
						<div class="col-3">
							<div class="card">
								<div class="card-body">
									<div class="row">
										<div class="col-4">
											<img :src="'data:image/png;base64,' + match_history.winner_avatar" class="card-img-top w-75" alt="...">
										</div>
										<div class="col-6 d-flex align-items-center">
												<p class="card-text">
													{{match_history.winner_login}}<br>
												</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-6">
							<div class="card">
								<div class="card-body">
									<div class="row text-center">
										<div class="col-12 fs-4">
										{{match_history.score}}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-3">
							<div class="card text-end">
								<div class="card-body">
									<div class="row">
										<div class="col-6 d-flex align-items-center">
											<p class="card-text">
												{{match_history.looser_login}}<br>
											</p>
										</div>
										<div class="col-4">
											<img :src="'data:image/png;base64,' + match_history.looser_avatar" class="card-img-top w-75" alt="...">
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from "axios";

	export default {
		data(){
			return {
				user: null,
				friends: null,
				match_histories: null,
			}
		},
		mounted () {
			axios
			.get('/api/users/' + this.$route.params.id)
			.then(response => (this.user = response.data))

			axios
			.get('/api/friends/')
			.then(response => (this.friends = response.data))

			axios
			.get('/api/match-histories/friend/' + this.$route.params.id)
			.then(response => (this.match_histories = response.data))
		},
		methods: {
			send: function (id) {
				let _id = id;
				axios
				.post('/api/friends/send/'+ _id)
				.then()
			},
			remove: function (id) {
				let _id = id;
				axios
				.delete('/api/friends/'+ _id)
				.then()
			},
		},
	}
</script>