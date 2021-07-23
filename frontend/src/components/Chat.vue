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
						<label for="inputPassword5" class="form-label">Chat name</label>
						<input type="text" id="chatName" v-model="name" class="form-control">

						<label for="inputPassword5" class="form-label">Password</label>
						<input type="password" id="inputPassword5" v-model="password" class="form-control" aria-describedby="passwordHelpBlock">
						<div id="passwordHelpBlock" class="mb-3 form-text">
						A password is optional. But is you set a password, your convesation will be private
						</div>
						<button class="btn btn-primary" type="button" @click.prevent="createGroupChat" data-bs-dismiss="offcanvas">Create a new conversation</button>
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
						<div class="card ">
							<div class="card-header"> 
								<ul class="nav nav-tabs card-header-tabs pull-right"  id="myTab" role="tablist">
									<li class="nav-item">
										<a class="nav-link active" id="Friends-tab" data-toggle="tab" href="#Friends" role="tab" aria-controls="Friends" aria-selected="true">Friends</a>
									</li>
									<li class="nav-item">
										<a class="nav-link" id="Groups-tab" data-toggle="tab" href="#Groups" role="tab" aria-controls="Groups" aria-selected="false">Groups</a>
									</li>
								</ul>
							</div>
							<div class="card-body">
								<div class="tab-content" id="myTabContent">
									<div class="tab-pane fade show active" id="Friends" role="tabpanel" aria-labelledby="Friends-tab">
										<div class="card mb-2">
											<div class="card-header">
												<form class="form-inline my-2 my-lg-0">
													<input class="form-control mr-sm-2 w-100" type="search" v-model="keyword" placeholder="Search a friend">
												</form>
											</div>
										</div>
										<div class="my-3 p-3 bg-body rounded shadow-sm">
											<h6 class="border-bottom pb-2 mb-0">Resulat de la recherche</h6>
											<a class="d-flex text-muted pt-3" v-for="(friend, index) of filterFriends" :key="index" v-on:click="createPrivateChat(friend)">
												<svg v-if='friend.current_status === "offline"' class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#ff0800"></rect><text x="50%" y="50%" fill="#ff0800" dy=".3em"></text></svg>
												<svg v-else class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#00ff37"></rect><text x="50%" y="50%" fill="#00ff37" dy=".3em"></text></svg>
												<p class="pb-3 mb-0 small lh-sm border-bottom">
													<strong class="d-block text-gray-dark">{{friend.login}}</strong>
													Envoyer un message à {{ friend.login }} alias {{ friend.nickname }}
												</p>
											</a>
										</div>
									</div>
									<div class="tab-pane fade" id="Groups" role="tabpanel" aria-labelledby="Groups-tab">
										<div class="card mb-2">
											<div class="card-header">
												<form class="form-inline my-2 my-lg-0">
													<input class="form-control mr-sm-2 w-100" type="search" v-model="keyword" placeholder="Search a group">
												</form>
											</div>
										</div>
										<div class="my-3 p-3 bg-body rounded shadow-sm">
											<h6 class="border-bottom pb-2 mb-0">Resulat de la recherche</h6>
											<div class="d-flex flex-column text-muted pt-3" v-for="(group, index) of filterGroups" :key="index">
												<div class="d-flex">
													<svg class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em"></text></svg>
													<p class="pb-3 mb-0 small flex-grow-1 lh-sm border-bottom">
														<strong class="d-block text-gray-dark">{{group.name}}</strong>
														Groupe id:{{group.id}}
													</p>
													<button v-if='group.password !== null && group.password !== ""' :id='"button_" + group.id' type="button" class="btn btn-primary align-self-start" @click="joinGroup(group.id)">
														Password
													</button>
													<button v-else type="button" :id='"button_" + group.id' class="btn btn-primary align-self-start" @click="joinGroup(group.id)">
														Join
													</button>
												</div>
												<input :id='"input_" + group.id' style="display:none;" class="form-control mr-sm-2 w-100" type="search" v-model="password" placeholder="Password">
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-for="chat of chats" :key="chat.id" class="d-flex flex-row chat-tab">
				<button type="button" class="btn btn-primary position-relative m-2 rounded-circle" data-bs-toggle="offcanvas" :data-bs-target="'#' + 'C' + chat.id" aria-expanded="false" :aria-controls="'C' + chat.id">
				{{chat.name[0]}}
				</button>
				<div class="offcanvas offcanvas-start" tabindex="-1" :id="'C' + chat.id" :aria-labelledby="'C' + chat.id + 'Label'">
					<div class="offcanvas-header">
						<h5 class="offcanvas-title" :id="'C' + chat.id + 'Label'">{{chat.name}}</h5>
						<button v-on:click="leaveChat(chat)" type="button" class="btn-close btn-danger text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
					</div>
					<div class="offcanvas-body">
						<div v-for="message of messages" :key="message.id">
							<div v-if="message.destination === chat.id">
								<div v-if="message.login !== this.user.login" class="d-flex flex-row mb-2">
									<div class="p-2">{{message.login}}: {{message.text}}</div>
								</div>
								<div v-else class="d-flex flex-row-reverse">
									<div class="p-2">{{message.login}}: {{message.text}}</div>
								</div>
							</div>
						</div>
					</div>
					<div class="offcanvas-footer">
						<div class="input-group mb-3">
							<input :id="'textarea' + chat.id" type="text" class="form-control" v-model="text" placeholder="Enter message..." aria-describedby="basic-addon2">
							<div class="input-group-append">
								<button id="send" class="btn btn-outline-secondary" type="button" @click.prevent="sendMessage(chat.id)">Send</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>


 <script>
	import { io } from 'socket.io-client';
	import axios from "axios";

	export default {
		data() {
			return {
				keyword: "",
				friends: null,
				groups: null,
				socket: null,
				user: null,
				text: '',
				password: '',
				name: '',
				messages: [],
				chats: [],
			}
		},
		updated() {
			axios
			.get('/chat/')
			.then(response => {
				this.groups = response.data;
			})
		},
		computed: {
			filterFriends() {
				const { friends, keyword } = this;
				let u = JSON.parse(JSON.stringify( this.friends ));
				if (keyword !== ""){
					return u.filter(({ login }) => login.toLowerCase().includes(keyword.toLowerCase()));
				}
				return null;
			},
			filterGroups() {
				const { groups, keyword } = this;
				let u = JSON.parse(JSON.stringify( this.groups ));
				if (keyword !== ""){
					return u.filter(({ name }) => name.toLowerCase().includes(keyword.toLowerCase()));
				}
				return null;
			},
		},
		methods: {
			joinGroup(group) {
				let input = document.getElementById("input_" + group);
				let button = document.getElementById("button_" + group);

				const data = {
					login: this.user.login,
					destination: group,
					password: this.password
				}
				if (button.innerHTML != "Join")
				{
					input.style.display = "block";
					button.innerHTML = "Join"
				}
				else {
					this.socket.emit('joinChat', data);
					this.password = '';
					if (input.style.display == "block")
						button.innerHTML = "Password"
					input.style.display = "none";
				}
			},
			createPrivateChat(User)
			{
				const data = {
					login: this.user.login,
					user: User.login
				}
				this.socket.emit('createPrivateChat', data);
			},
			createGroupChat() {
				const data = {
					login: this.user.login,
					destination: this.name,
					password: this.password
				}
				this.socket.emit('createGroupChat', data);
				this.name = '';
				this.password = '';
			},
			sendMessage(dest) {
				const message = {
					login: this.user.login,
					text: this.text,
					destination: dest,
				}
				this.socket.emit('msgToServer', message)
				this.text = ''
				document.getElementById("textarea" + dest).value = "";
			},
			receivedMessage(message) {
				if (message.text != "" && message.text[0] != '/') {
					this.messages.push(message);
				}
				if (message.text[0] === '/' && message.login == this.user.login) {
					
					let split = message.text.split(' ');
					if (split[0] == "/help"){
						this.messages.push({
							login: "Server",
							text: "/profile [user_login/user_nickname]",
							destination: message.destination,
						});
					} else {
						let data = {
							login: this.user.login,
							command: split[0],
							destination: message.destination,
							argument0: split[1],
							argument1: split[2],
						};
						this.socket.emit('command', data);
					}
				}
			},
			leaveChat(chat) {
				const data = {
					login: this.user.login,
					destination: chat.id,
				}
				this.socket.emit('leave', data);
			},
			openChat(chat) {
				this.chats.push(chat);
			},
			closeChat(chat) {
				var index = this.chats.findIndex(function(obj){
					return obj.name === chat.destination;
				})
				if (index !== -1) {
					this.chats.splice(index, 1);
				}
			},
			mute(data) {
				if ( data.actif == true) {
					this.messages.push({
						login: "Server",
						text: "Vous avez été mute...",
						destination: data.destination,
					});
				} else {
					this.messages.push({
						login: "Server",
						text: "Vous avez été unmute...",
						destination: data.destination,
					});
				}
			}
		},
		async created () {
			const res = await axios.get('/auth/me')
			this.user = res.data;

			axios
			.get('/friends/')
			.then(response => (this.friends = response.data))

			this.socket = io('http://localhost:8080', { withCredentials: true });

			this.socket.on('message', (message) => {
				console.log(`event: message`);
				this.receivedMessage(message)
			})
			this.socket.on('open', (chat) => {
				console.log(`event: open`);
				this.openChat(chat);
			})

			this.socket.on('close', (chat) => {
				console.log(`event: close`);
				this.closeChat(chat);
			})

			this.socket.on('mute', (data) => {
				console.log(`event: mute`);
				this.mute(data);
			})

			const tmp_data = {login: this.user.login};

			this.socket.emit('whoami', tmp_data);

		}
	}
 </script>