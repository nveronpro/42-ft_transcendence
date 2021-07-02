<template>
    <div id="app">
        <Game />
    </div>
</template>

<script>
import Game from './components/Game.vue'

export default {
	name: 'app',
	components: {
		Game
	}
}
</script>

<style>
    body {
        background-color: #ddd;
    }
</style>