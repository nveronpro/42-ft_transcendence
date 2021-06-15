<template>
	<div>
		<div id="app">
			<div id="nav">
				<router-link to="/">Home</router-link> |
				<router-link to="/friends">Friends</router-link> |
				<router-link to="/stats">Stats</router-link> |
				<router-link to="/profile">Profile</router-link>
			</div>
			<div>
				<h1>
					FT_TRANSCENDANCE: PONG
				</h1>
			</div>
			
			<div id="router-vue">
				<router-view/>
			</div>
		</div>
		
		<div id="footer">
			<footer-view/>
		</div>

	</div>
</template>

<script lang="ts">
import ChatComponent from '@/components/Chat.vue';
import { Options, Vue } from 'vue-class-component';
@Options({
	components: {
		"footer-view" : ChatComponent
	},
})
export default class App extends Vue {}
</script>

<style>
#router-vue {
	background-color: chocolate;
	height: 76vh;
	width: 100%;
	position: static;
	padding: 5px;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
#footer {
	width: 100%;
	text-align: center;
	position:fixed;
	bottom:0;
}

.form-wrapper {
	width: 500px;
	margin: 0 auto;
}
</style>
