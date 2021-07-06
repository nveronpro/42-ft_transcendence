<template>
	<div>
		<div class="container-fluid" style="height: 90.5vh;">
			<div class="row g-2 h-100">
				<div class="col-lg-4 col-md-12 col-sm-12">
					<div class="p-3 border bg-light h-100">
						<div class="card mb-3">
							<div class="row">
								<div class="col-6">
									<div id="avatar">
									</div>
								</div>
								<div class="col-6">
									<div class="card-body">
										<h5 class="card-title">{{user.login}}</h5>
										<p class="card-text">
											Login : {{user.login}}<br>
											Nickname : {{user.nickname}}<br>
											Description : Destructeur du comos et reparateur de l'univers<br>
										</p>
									</div>
								</div>
							</div>
							<div class="card-body">
								<div class="row">
									<div class="card text-white bg-success m-2 col-md-11 col-lg" style="max-width: 18rem;">
										<div class="card-header">Victoires: {{user.wins}}</div>
									</div>
									<div class="card text-white bg-danger m-2 col-md-11 col-lg" style="max-width: 18rem;">
										<div class="card-header">Defaites: {{user.looses}}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-lg-8 col-md-12 col-sm-12">
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
	</div>
</template>

<script>
	import axios from "axios";

	export default {
		data(){
			return {
				user: null,
				match_histories: null,
			}
		},
		mounted () {
			axios
			.get('/api/auth/me')
			.then(response => (this.user = response.data))

			axios
			.get('/api/match-histories/')
			.then(response => (this.match_histories = response.data))

			axios
			.get('/api/users/avatar')
			.then((response) => {
				let image = document.querySelector("#avatar img");

				if (image)
					document.getElementById("avatar").removeChild(image);
				document.getElementById("avatar").insertAdjacentHTML('beforeend', response.data);

				let elem = document.querySelector("#avatar img");
				elem.classList.add("card-img-top");
				elem.classList.add("m-3");
			})
		},
	}
</script>