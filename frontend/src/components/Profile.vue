<template>
	<div class="container">
		<div class="row">
			<div class="col-4">
				<div class="card">
					<div class="card-body text-center">
						<label for="image">
							<input type="file" ref="file" name="image" id="image" style="display:none;" @change="handleFileUpload()" />
							<div id="avatar">
							</div>
						</label>
					</div>
				</div>
			</div>
			<div class="col-8">
				<div class="card h-100">
					<div class="card-body">
						<h5 id="nickname" class="card-title fs-1 mb-1">{{user.nickname}}</h5>
						<form @submit.prevent="change_nick">
							<div class="input-group mb-3 w-50">
								<input type="text" class="form-control" v-model="nick" placeholder="Change your nickname" aria-label="Recipient's username" aria-describedby="button-addon2">
								<button class="btn btn-outline-secondary" type="submit" id="button-addon2">Change</button>
							</div>
						</form>
						<p><small id="change_nick_status" class="text-danger"></small></p>
						<small class="text-muted">Current status: {{user.current_status}}</small>
						<p class="card-text mb-5">Joueur pro de pong</p>
					</div>
					<div class="card-footer bg-transparent">
						<button v-if="user.two_factor_auth == false" type="button" class="btn btn-success" v-on:click="switch_2fa">Activer le 2FA</button>
						<button v-if="user.two_factor_auth == true" type="button" class="btn btn-danger" v-on:click="switch_2fa">Desactiver le 2FA</button>
					</div>
				</div>
			</div>
			<div class="col-12">
				<div class="my-3 p-3 bg-body rounded shadow-sm">
					<h6 class="border-bottom pb-2 mb-0">Demandes d'amis reçus</h6>
					<div v-for="friend_request in friend_requests" :key="friend_request.id" :id="friend_request.id" class="d-flex text-muted pt-3">
						<svg class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em"></text></svg>
						<p class="pb-3 mb-0 small lh-sm border-bottom">
							<strong class="d-block text-gray-dark">{{friend_request.sender_login}}</strong>
							{{friend_request.sender_login}} voudrais vous ajoutez en amis !
						</p>
						<button v-on:click="refuse(friend_request.id)" type="button" class="btn btn-outline-danger ml-auto mb-3">
							<i class="fas fa-minus"></i>
						</button>
						<button v-on:click="accept(friend_request.id)" type="button" class="btn btn-outline-success ml-auto mb-3">
							<i class="fas fa-plus"></i>
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
				users: null,
                friend_requests: null,
				file: '',
				nick: null,
            }
        },
        mounted () {
            axios
            .get('/api/auth/me')
			.then(response => (this.user = response.data))
			
			axios
            .get('/api/users/all')
            .then(response => (this.users = response.data))

			axios
			.get('/api/friends/received')
			.then(response => (this.friend_requests = response.data))

			axios
			.get('/api/users/avatar')
			.then((response) => {
				let image = document.querySelector("#avatar img");

				if (image)
					document.getElementById("avatar").removeChild(image);
				document.getElementById("avatar").insertAdjacentHTML('beforeend', response.data);

				let elem = document.querySelector("#avatar img");
				elem.classList.add("card-img");
			})
		},
		methods: {
			change_nick: function () {
				if (this.nick.length <= 0 || this.nick.length > 20)
				{
					document.getElementById("change_nick_status").innerHTML = "Your nickname must contain between 1 and 20 characters";
					return ;
				}
				for(let i = 0; this.users[i]; i++)
				{
					if (this.users[i].user_nickname == this.nick)
					{
						document.getElementById("change_nick_status").innerHTML = this.nick + " is already in use !";
						return ;
					}
				}
				axios.post('/api/profile/nickname/' + this.nick);
				document.getElementById("nickname").innerHTML = this.nick;
			},
			switch_2fa: function () {
				if (this.user.two_factor_auth == false)
				{
					axios.post('/api/profile/2fa/true');
					this.user.two_factor_auth = true;
				}
				else
				{
					axios.post('/api/profile/2fa/false');
					this.user.two_factor_auth = false;
				}
			},
			accept: function (id) {

				let _id = id;
				axios
				.post('/api/friends/accept/'+ _id)
				.then(document.getElementById(_id).remove())
			},
			refuse: function (id) {
				let _id = id;
				axios
				.post('/api/friends/refuse/'+ _id)
				.then(document.getElementById(_id).remove())
			},
			submitFile(){
                let formData = new FormData();
            
				formData.append('file', this.file);
                axios.patch( '/api/profile/avatar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                ).then(function(){
					console.log('SUCCESS!!');
					axios
					.get('/api/users/avatar')
					.then((response) => {
						let image = document.querySelector("#avatar img");

						if (image)
							document.getElementById("avatar").removeChild(image);
						document.getElementById("avatar").insertAdjacentHTML('beforeend', response.data);

						let elem = document.querySelector("#avatar img");
						elem.classList.add("card-img");
					})
                })
                .catch(function(){
                    console.log('FAILURE!!');
                });
            },
            handleFileUpload(e){
                //this.files = e.target.files || e.dataTransfer.files;
                this.file = this.$refs.file.files[0];
                
                this.submitFile();
            },
		}
	}
</script>