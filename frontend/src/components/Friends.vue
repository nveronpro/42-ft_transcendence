<template>
	<div>
		<div class="container-fluid" style="height: 90.5vh;">
			<div class="row g-2 h-100">
				<div class="col-md-4 col-sm-12">
					<div class="p-3 border bg-light h-100 overflow-auto">
						<div class="card mb-2">
							<div class="card-header">
								<form class="form-inline my-2 my-lg-0">
									<input class="form-control mr-sm-2 w-100" type="search" v-model="keyword" placeholder="Search a friend">
								</form>
							</div>
						</div>
						<div class="my-3 p-3 bg-body rounded shadow-sm">
							<h6 class="border-bottom pb-2 mb-0">Resulat de la recherche</h6>
							<router-link class="d-flex text-muted pt-3" v-for="(all_user, index) of filterImages" :key="index" :to="'/friend/' + all_user.user_id">
								<svg v-if='all_user.user_current_status === "offline"' class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#ff0800"></rect><text x="50%" y="50%" fill="#ff0800" dy=".3em"></text></svg>
								<svg v-else class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#00ff37"></rect><text x="50%" y="50%" fill="#00ff37" dy=".3em"></text></svg>
								<p class="pb-3 mb-0 small lh-sm border-bottom">
									<strong class="d-block text-gray-dark">{{all_user.user_login}}</strong>
									Deux, trois information sur l'utilisateur
								</p>
							</router-link>
						</div>
					</div>
				</div>
				<div class="col-md-8 col-sm-12">
					<div class="p-3 border bg-light h-100">
						<div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
							<div class="col" v-for="friend in friends" :key="friend.id">
								<div class="card">
									<router-link class="card-block stretched-link text-decoration-none" :to="'/friend/' + friend.id">
										<div class="card-body text-center">
											<h5 class="card-title text-dark text-decoration-none">{{friend.login}}</h5>
											<a :src="'/friend/' + friend.id"><img :src="'data:image/png;base64,' + friend.avatar" class="card-img" alt="..."></a>
										</div>
									</router-link>
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
				keyword: "",
				user: null,
				all_users: null,
				friends: null,
			}
		},
		created () {
			axios
			.get('/auth/me')
			.then(response => (this.user = response.data))

			axios
			.get('/friends/')
			.then(response => (this.friends = response.data))

			axios
			.get('/users/all')
			.then(response => (this.all_users = response.data))
		},
		computed: {
			filterImages() {
				const { all_users, keyword } = this;
				let u = JSON.parse(JSON.stringify( this.all_users ));
				if (keyword !== ""){
					return u.filter(({ user_login }) => user_login.toLowerCase().includes(keyword.toLowerCase()));
				}
				return null;
			},
		},
		methods: {
			send: function (id) {
				let _id = id;
				axios
				.post('/friends/send/'+ _id)
				.then()
			},
			remove: function (id) {
				let _id = id;
				axios
				.delete('/friends/'+ _id)
				.then()
			},
		},
	}
</script>