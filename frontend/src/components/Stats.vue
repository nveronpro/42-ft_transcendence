<template>
	<div id="container">
		<p>this will be the Stats component</p>
		<div>
			<div id="stats" class="inside">
				<p>This is the Stats zone !</p>
				<hr>
				<div>
					<div id="wins">
						<p>Victory</p>
						<b>42</b>
					</div>
					<div id="losses">
						<p>Defeats</p>
						<b>13</b>
					</div>
				</div>

				<hr>

				<div>
					<p> Last 7 days: </p>
					<div id="played">
						<p>Games played: </p>
						<b>15</b>
					</div>
					<div id="ratio">
						<p>win ratio:</p>
						<b>0.85</b>
					</div>
				</div>
			</div>
			<div id="history" class="inside">
				<p>This is the History zone !</p>
				<ul id="match-list">
					<li class="match-result win">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Alpha</p>
						<b> 5 </b>
						<h4> // </h4>
						<b> 3 </b>
						<p class="nickname">Beta</p>
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
					</li>
					<li class="match-result tie">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Alpha</p>
						<b> 5 </b>
						<h4> // </h4>
						<b> 5 </b>
						<p class="nickname">Gamma</p>
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
					</li>
					<li class="match-result win">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Alpha</p>
						<b> 4 </b>
						<h4> // </h4>
						<b> 3 </b>
						<p class="nickname">Delta</p>
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
					</li>
					<li class="match-result loose">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Alpha</p>
						<b> 0 </b>
						<h4> // </h4>
						<b> 9 </b>
						<p class="nickname">Omega</p>
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
					</li>
					<li class="match-result win">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Alpha</p>
						<b> 6 </b>
						<h4> // </h4>
						<b> 5 </b>
						<p class="nickname">Pi</p>
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
					</li>
					<li class="match-result win">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Alpha</p>
						<b> 5 </b>
						<h4> // </h4>
						<b> 1 </b>
						<p class="nickname">Epsilon</p>
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
					</li>
					<li class="match-result tie">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Alpha</p>
						<b> 1 </b>
						<h4> // </h4>
						<b> 1 </b>
						<p class="nickname">Teta</p>
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
					</li>
					<li class="match-result loose">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Alpha</p>
						<b> 6 </b>
						<h4> // </h4>
						<b> 8 </b>
						<p class="nickname">Omicron</p>
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
					</li>
					<li class="match-result win">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Alpha</p>
						<b> 2 </b>
						<h4> // </h4>
						<b> 1 </b>
						<p class="nickname">Ro</p>
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
					</li>
					<li class="match-result win">
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
						<p class="nickname">Alpha</p>
						<b> 6 </b>
						<h4> // </h4>
						<b> 2 </b>
						<p class="nickname">Zeta</p>
						<img src="http://placehold.jp/50x50.png" alt="Avatar" class="avatar" >
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

#stats {
	float: left;
	width: 20%;
	margin-left: 2%;

	border: 2px solid green;

	background-color: yellowgreen;
}

#stats div {
	margin-top: 10%;
}

#wins {
	float: left;
	margin-left: 25%;
	margin-top: 10%;
}

#wins b {
	font-size: 25px;
	color: blue;
}

#losses {
	float: right;
	margin-right: 25%;
}

#played {
	float: left;
	margin-left: 10%;
}

#ratio {
	float: right;
	margin-right: 10%;
}


#losses b {
	font-size: 25px;
	color: red;
}

#history {
	float: right;
	width: 76%;
	margin-right: 2%;

	border: 2px solid red;

	background-color: pink;
}

#match-list {
	margin: 5px;
	list-style-type:none;
	padding: 10px;
	border: solid black 2px;

	overflow: hidden;
	overflow-y: scroll;
	height:580px;
}

li {
	list-style: none;
	margin: 1%;
	margin-top: 5px;
	line-height: 52px;
}

.win {
	border: solid 3px lawngreen;
}

.loose {
	border: solid 3px red;
}

.tie {
	border: solid 3px grey;
}

li * {
	display: inline;
	margin-left: 3%;
	margin-right: 3%;
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