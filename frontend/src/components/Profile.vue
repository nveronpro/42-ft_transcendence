<template>
	<div id="container">
		<p> this will be the Profile component test</p>
		<div id="profile">
			<div>
				<form v-on:submit.prevent="onSubmit">
					<img src="http://placehold.jp/150x150.png" id="yourAvatar">
					<input type="file" id="ppUpdate" name="PP">
					<input type="submit" id="ppUpdateSubmit">
				</form>
			</div>
			<hr>
			<div>
				<form v-on:submit.prevent="onSubmit">
					<input type="password" id="passwordUpdate" name="password">
					<input type="submit" id="passwordUpdateSubmit">
				</form>
			</div>
			<hr>
			<div>
				<button onclick='alert("you have reached the button");'>2 factor authentification </button>
				<a href="http://google.com/">This is a link to go to google</a>
			</div>
			<hr>
		</div>
	</div>

</template>

<style>

#ppUpdate {
	border: solid 2px black ;
	padding: 50px;
	margin: 20px;
}

#profile-avatar > * > * {
	display: inline;
}

</style>