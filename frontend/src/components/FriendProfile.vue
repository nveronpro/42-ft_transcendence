<template>
	<div class="container-lg">
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
						<h5 class="card-title fs-1 mb-1">{{user[0].user_nickname}}</h5>
						<small class="text-muted">Current status: {{user[0].user_current_status}}</small>
						<p class="card-text mb-5">Joueur pro de pong</p>
					</div>
					<div class="card-footer bg-transparent border-Secondary d-flex justify-content-between">
						<div>
							<button :id="user[0].user_id" v-if="already_friend == false" v-on:click="send(user[0].user_id)" type="button" class="btn btn-outline-success ml-auto mb-3">
								Ajouter cet amis  <i class="fas fa-plus"></i>
							</button>
							<button :id="user[0].user_id" v-if="already_friend == true" v-on:click="remove(user[0].user_id)" type="button" class="btn btn-outline-danger ml-auto mb-3">
								Enleve cet amis  <i class="fas fa-minus"></i>
							</button>
						</div>
						<div>
							<button :id="user[0].user_id" v-if="is_block == false" v-on:click="block(user[0].user_id)" type="button" class="btn btn-outline-warning ml-auto mb-3">
								Bloquer
							</button>
							<button :id="user[0].user_id" v-if="is_block == true" v-on:click="unblock(user[0].user_id)" type="button" class="btn btn-outline-warning ml-auto mb-3">
								Debloquer
							</button>
						</div>
					</div>
					
				</div>
			</div>
			<div class="col-12">
				<div class="p-3 border bg-light h-100 overflow-auto">
					<div v-for="match_history in match_histories" :key="match_history.id" class="row mb-3 mr-1 ml-1 p-2">
						<div class="col-5">
							<div class="card">
								<div class="card-body">
									<div class="row">
										<div class="col-4">
											<img :src="'data:image/png;base64,' + match_history.winner_avatar" class="card-img-top w-75" alt="...">
										</div>
										<div class="col-6 d-flex align-items-center">
												<p class="card-text">
													{{match_history.winner_nickname}}<br>
												</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-2">
							<div class="card h-100">
								<div class="card-body d-flex align-items-center text-center">
									<h5 class="w-100">{{match_history.score}}</h5>
								</div>
							</div>
						</div>
						<div class="col-5">
							<div class="card text-end">
								<div class="card-body">
									<div class="row">
										<div class="col-6 d-flex align-items-center flex-row-reverse">
											<p class="card-text">
												{{match_history.looser_nickname}}<br>
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
				blocked: null,
				is_block: false,
				match_histories: null,
				already_friend: false,
			}
		},
		mounted () {
			axios
			.get('/users/' + this.$route.params.id)
			.then(response => (this.user = response.data))

			axios
			.get('/chat/block/')
			.then(response => {
				for(var i = 0; i < response.data.length; i++) {
					if (response.data[i].id == this.$route.params.id) {
						this.is_block = true;
						break;
					}
				}
			})

			axios
			.get('/friends/already/' + this.$route.params.id)
			.then(response => (this.already_friend = response.data))

			axios
			.get('/match-histories/friend/' + this.$route.params.id)
			.then(response => (this.match_histories = response.data))
		},
		methods: {
			block: function (id) {
				let _id = id;
				axios
				.post('/chat/block/'+ _id)
				.then(this.is_block = true)
			},
			unblock: function (id) {
				let _id = id;
				axios
				.post('/chat/unblock/'+ _id)
				.then(this.is_block = false)
			},
			send: function (id) {
				let _id = id;
				axios
				.post('/friends/send/'+ _id)
				.then(this.already_friend = true)
			},
			remove: function (id) {
				let _id = id;
				axios
				.delete('/friends/'+ _id)
				.then(this.already_friend = false)
			},
		},
	}
</script>