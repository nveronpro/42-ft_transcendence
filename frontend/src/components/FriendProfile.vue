<template>
	<div class="container">
		<div class="row">
			<div class="col-4">
				<div class="card">
					<div class="card-body text-center">
						<label for="image">
							<input type="file" name="image" id="image" style="display:none;" @change="onFileChange" />
							<img src="https://avatarfiles.alphacoders.com/123/thumb-123713.jpg" class="card-img" alt="...">
						</label>
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
			}
		},
		mounted () {
			axios
			.get('/api/users/' + this.$route.params.id)
			.then(response => (this.user = response.data))

			axios
			.get('/api/friends/')
			.then(response => (this.friends = response.data))
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
				console.log("okokokkokokokokokokokkokok");
				axios
				.delete('/api/friends/'+ _id)
				.then()
			},
		},
	}
</script>