<template>
	<div>
		<div class="container-fluid" style="height: 90.5vh;">
			<div class="row g-2 h-100">
				<div class="col-xl-4 col-lg-12 col-md-12 col-sm-12">
					<div class="p-3 border bg-light h-100">
						<div class="card mb-3">
							<div class="row">
								<div class="col-11 col-md-11 col-lg-6">
									<div id="avatar">
									</div>
								</div>
								<div class="col-md-12 col-lg-6">
									<div class="card-body">
										<h5 class="card-title">{{user.nickname}}</h5>
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
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12">
					<div class="p-3 border bg-light h-100 overflow-auto">
						<div v-for="match_history in match_histories" :key="match_history.id" class="row mb-3 mr-1 ml-1 p-2">
							<div class="col-5">
								<div class="card h-100">
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
								<div class="card text-end h-100">
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
			.get('/auth/me')
			.then(response => (this.user = response.data))

			axios
			.get('/match-histories/')
			.then(response => (this.match_histories = response.data))

			axios
			.get('/users/avatar')
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