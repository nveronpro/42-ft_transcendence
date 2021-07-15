<template>
	<div class="fixed-bottom">
		<div class="d-flex flex-row-reverse m-3">
			<div class="d-flex flex-row chat-tab">
				<button type="button" class="btn btn-primary position-relative m-2 rounded-circle" data-bs-toggle="offcanvas" data-bs-target="#chat_manager" aria-expanded="false" aria-controls="chat_manager">
					<i class="fas fa-plus"></i>
				</button>
				<div class="offcanvas offcanvas-start" tabindex="-1" id="chat_manager" aria-labelledby="chat_managerLabel">
					<div class="offcanvas-header">
						<h5 class="offcanvas-title" id="chat_managerLabel">Chat manager</h5>
						<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
					</div>
					<div class="offcanvas-body">
						<label for="inputPassword5" class="form-label">Password</label>
						<input type="password" id="inputPassword5" class="form-control" aria-describedby="passwordHelpBlock">
						<div id="passwordHelpBlock" class="mb-3 form-text">
						A password is optional. But is you set a password, your convesation will be private
						</div>
						<button class="btn btn-primary" type="button">Create a new conversation</button>
					</div>
				</div>
			</div>
			<div class="d-flex flex-row chat-tab">
				<button type="button" class="btn btn-primary position-relative m-2 rounded-circle" data-bs-toggle="offcanvas" data-bs-target="#search" aria-expanded="false" aria-controls="search">
				<i class="fas fa-search"></i>
				</button>
				<div class="offcanvas offcanvas-start" tabindex="-1" id="search" aria-labelledby="searchLabel">
					<div class="offcanvas-header">
						<h5 class="offcanvas-title" id="searchLabel">Search a chat</h5>
						<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
					</div>
					<div class="offcanvas-body">
						<div class="card mb-2">
							<div class="card-header">
								<form class="form-inline my-2 my-lg-0">
									<input class="form-control mr-sm-2 w-100" type="search" v-model="keyword" placeholder="Search a conversation">
								</form>
							</div>
						</div>
						<div class="my-3 p-3 bg-body rounded shadow-sm">
							<h6 class="border-bottom pb-2 mb-0">Resulat de la recherche</h6>
						</div>
					</div>
				</div>
			</div>
			<div class="d-flex flex-row chat-tab">
				<button type="button" class="btn btn-primary position-relative m-2 rounded-circle" data-bs-toggle="offcanvas" data-bs-target="#nveron" aria-expanded="false" aria-controls="nveron">
				N
				</button>
				<div class="offcanvas offcanvas-start" tabindex="-1" id="nveron" aria-labelledby="nveronLabel">
					<div class="offcanvas-header">
						<h5 class="offcanvas-title" id="nveronLabel">Chat with Nicolas</h5>
						<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
					</div>
					<div class="offcanvas-body">
						<div class="d-flex flex-row bd-highlight mb-3">
							<div class="p-2 bd-highlight">Nico: blabla</div>
						</div>
						<div class="d-flex flex-row-reverse bd-highlight">
							<div class="p-2 bd-highlight">Moi: bla bla blab lbalb llablal lbl ll abll al</div>
						</div>	
					</div>
					<div class="offcanvas-footer input-group">
							<input type="text" class="form-control" placeholder="Send message" aria-label="Recipient's username" aria-describedby="button-addon2">
					</div>
				</div>
			</div>
			<button class="" v-on:click="clickButton"></button>
		</div>
	</div>

</template>


 <script>
	import io from 'socket.io-client';

	export default {
		data() {
			return {
				socket: null,
			}
		},
		methods: {
			clickButton() {
				this.socket.emit('test', "NICOLAS");
				console.log('CLICK');
			}
		},
		created () {
			this.socket = io('http://main:3000');
			console.log(this.socket);
		}
	}
 </script>