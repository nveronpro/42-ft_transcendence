<template>
	<div id="container">
		<p>this will be the Friends component</p>
		<div>
			<div id="search" class="inside">
				<p>This is the search zone !</p>
				<input/>
				<ul id="result-list">

					<li class="search-result">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Alpha</p>
						<img src="https://via.placeholder.com/15/FF0000" alt="Status" class="status">
					</li>

					<li class="search-result">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Beta</p>
						<img src="https://via.placeholder.com/15/00FF00/" alt="Status" class="status">
					</li>

					<li class="search-result">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Gamma</p>
						<img src="https://via.placeholder.com/15/888888/" alt="Status" class="status">
					</li>

				</ul>
			</div>
			<div id="friends" class="inside">
				<p>This is the friend zone !</p>
				<ul id="friends-list">
					<li class="friend-result search-result">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Alpha2</p>
						<img src="https://via.placeholder.com/15/FF0000/" alt="Status" class="status">
					</li>
					<li class="friend-result search-result">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Beta2</p>
						<img src="https://via.placeholder.com/15/00FF00/" alt="Status" class="status">
					</li>
					<li class="friend-result search-result">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Gamma2</p>
						<img src="https://via.placeholder.com/15/888888/" alt="Status" class="status">
					</li>
					<li class="friend-result search-result">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Epsilon</p>
						<img src="https://via.placeholder.com/15/FF0000/" alt="Status" class="status">
					</li>
					<li class="friend-result search-result">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Omega</p>
						<img src="https://via.placeholder.com/15/00FF00/" alt="Status" class="status">
					</li>
					<li class="friend-result search-result">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Pi</p>
						<img src="https://via.placeholder.com/15/888888/" alt="Status" class="status">
						
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>


<style>
#container {
	height: 100%;
	display: flex;
	flex-flow: column;
	background-color: darkgrey;
}
#search {
	float: left;
	width: 20%;
	margin-left: 2%;
	border-right: 5px solid green;
	background-color: yellowgreen;
}
#result-list {
	margin: 5px;
	list-style-type:none;
	padding: 10px;
	border: solid black 2px;
}
.search-result {
	margin-top: 5px;
	height: 52px;
	border: solid 1px darkgreen;
	line-height: 52px;
	background-color: lightgreen;
}
.search-result .nickname {
	display: inline;
	vertical-align: middle;
}
.search-result img {
	display: inline;
	vertical-align: middle;	
}
.search-result .avatar {
	width: 50px;
	height: 50px;
	border: 1px solid greenyellow;
	float: left;
}
.search-result .status {
	width: 15px;
	height: 15px;
	border: 1px solid white;
	float: right;
}
#friends {
	float: right;
	width: 76%;
	margin-right: 2%;
	border-left: 5px solid red;
	background-color: pink;
}
#friends-list {
	margin: 5px;
	list-style-type:none;
	padding: 10px;
	border: solid black 2px;
	display: flex;
	flex-wrap: wrap;
}
#friends-list li {
	list-style: none;
	flex: 0 0 30%;
	margin: 1%;
}
</style>


<script>
// import axios from "axios";
// import { server } from "../../helper";
// import router from "../../router";
export default {
	data() {
		return {
			friends: [],
		};
	},
	methods: {},
};
</script>