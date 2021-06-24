<template>
	<div id="chat-container">
		<!-- <p> this will be the Chat component </p> -->
		<div id="chat-tabs">
			<div class="chat-tab retracted">
				<p class="header" onclick='this.parentNode.children[1].classList.toggle("hidden");this.parentNode.classList.toggle("retracted");'>Epsilon</p>
				<div class="under-chat hidden">
					<ul class="chat">
					</ul>
					<input class="chat-input"/>
				</div>
			</div>
			<div class="chat-tab retracted">
				<p class="header" onclick='this.parentNode.children[1].classList.toggle("hidden");this.parentNode.classList.toggle("retracted");'>Delta</p>
				<div class="under-chat hidden">
					<ul class="chat">
					</ul>
					<input class="chat-input"/>
				</div>
			</div>
			<div class="chat-tab retracted">
				<p class="header" onclick='this.parentNode.children[1].classList.toggle("hidden");this.parentNode.classList.toggle("retracted");'>Omega</p>
				<div class="under-chat hidden">
					<ul class="chat">
					</ul>
					<input class="chat-input"/>
				</div>
			</div>
			<div class="chat-tab retracted">
				<p class="header" onclick='this.parentNode.children[1].classList.toggle("hidden");this.parentNode.classList.toggle("retracted");'>Pi</p>
				<div class="under-chat hidden">
					<ul class="chat">
					</ul>
					<input class="chat-input"/>
				</div>
			</div>
			<div class="chat-tab">
				<p class="header" onclick='this.parentNode.children[1].classList.toggle("hidden");this.parentNode.classList.toggle("retracted");'>Beta</p>
				<div class="under-chat">
					<ul class="chat">
						<li class="message sent"><p class="message-sender">Alpha</p><br><p class="message-text">Hello there !</p></li>
						<li class="message received"><p class="message-sender">Beta</p><br><p class="message-text">General Kenobi !</p></li>
						<li class="message sent"><p class="message-sender">Alpha</p><br><p class="message-text">I am the negociator !</p></li>
						<li class="message received"><p class="message-sender">Beta</p><br><p class="message-text">I can see this !</p></li>
						<li class="message received"><p class="message-sender">Beta</p><br><p class="message-text">I can see this !</p></li>
						<li class="message received"><p class="message-sender">Beta</p><br><p class="message-text">I can see this !</p></li>
						<li class="message received"><p class="message-sender">Beta</p><br><p class="message-text">I can see this !</p></li>
						<li class="message received"><p class="message-sender">Beta</p><br><p class="message-text">I can see this !</p></li>
						<li class="message received"><p class="message-sender">Beta</p><br><p class="message-text">I can see this !</p></li>
						<li class="message received"><p class="message-sender">Beta</p><br><p class="message-text">I can see this !</p></li>
						<li class="message received"><p class="message-sender">Beta</p><br><p class="message-text">I can see this !</p></li>
						<li class="message received"><p class="message-sender">Beta</p><br><p class="message-text">I can see this !</p></li>
					</ul>
					<input class="chat-input"/>
				</div>
			</div>
			<div class="chat-tab retracted">
				<p class="header" onclick='this.parentNode.children[1].classList.toggle("hidden");this.parentNode.classList.toggle("retracted");'>Gamma</p>
				<div class="under-chat hidden">
					<ul class="chat">
					</ul>
					<input class="chat-input"/>
				</div>
			</div>
			<div class="chat-tab retracted">
				<p class="header" onclick='this.parentNode.children[1].classList.toggle("hidden");this.parentNode.classList.toggle("retracted");'>#public</p>
				<div class="under-chat hidden">
					<ul class="chat">
					</ul>
					<input class="chat-input"/>
				</div>
			</div>
		</div>
	</div>
</template>

<style>

#footer {
	pointer-events: none;
}

#chat-container > * {
	display: inline;
	float: right;
	pointer-events: none;
	z-index:-100;
}

#chat-tabs {
	pointer-events: none;

	height: 60vh;

	max-width: 100%;

	display: flex;
	flex-direction: row;
	
	overflow-x: scroll;
}

.chat-tab {
	background-color:rgba(100, 100, 100, 0.3);
	margin-left: 5px;
	margin-right: 5px;
	margin-bottom: 5px;
	border: 1px solid black;
	min-width: 220px;
	max-height: 410px;
	bottom: 0;
	pointer-events: all;
	position: relative;
	display: inline-block;
	top: 100%;
	transform: translateY(-100%);
	display: block;

	z-index: 100;
}

.header {
	background-color:rgba(100, 100, 100, 0.7);
	height: 40px;
	border: 1px solid black;
	color: white;
	cursor: pointer;
	user-select: none;
}

.header:hover {
	background-color: rgba(00, 00, 00, 1);;
}

.under-chat {
	display: block;
	position: relative;
}

.chat {
	overflow: hidden;
	overflow-y: scroll;
	list-style-type:none;


	display: flex;
	flex-flow: column;
	height: 310px;
	padding: 0px;
}

.message {
	line-height: 25px;
	position: relative;
}

.message-sender {
	font-size: 15px;
	color: rgb(255, 255, 255);
	background-color: rgba(0, 0, 0, 0.2);
	margin: 0px;
	padding: 2px;
}

.message-text {
	background-color:rgba(150, 150, 150, 0.8);
	border: solid 1px grey;
	margin:2px;
	padding: 3px;
	color: white;
}

.sent {
	text-align: right;
}

.received {
	text-align: left;
}

.chat-input {
	width: 180px;
	height: 25px;
	padding:10px;

	position: fixed;
	bottom: 10px;
	left: 20px;
}

.hidden {
	display: none;
}

.retracted {
	height: 50px;
}

</style>








<script>
// import axios from "axios";
// import { server } from "../../helper";
// import router from "../../router";
export default {
	data() {
		return {
			friends: []
		};
	},
	methods: {
	},
};
</script>