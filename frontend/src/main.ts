import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import HomeComponent from '@/views/Home.vue';
import EditComponent from '@/components/customers/Edit.vue';
import CreateComponent from '@/components/customers/Create.vue';

import FriendsComponent from '@/components/Friends.vue';
import StatsComponent from '@/components/Stats.vue';
import ProfileComponent from '@/components/Profile.vue';
import ChatComponent from '@/components/Chat.vue';

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: { name: 'home' } },
    { path: '/home', name: 'home', component: HomeComponent },
    { path: '/create', name: 'Create', component: CreateComponent },
    { path: '/edit/:id', name: 'Edit', component: EditComponent },

	{ path: '/friends', name: 'Friends', component: FriendsComponent },
	{ path: '/stats', name: 'Stats', component: StatsComponent },
	{ path: '/profile', name: 'Profile', component: ProfileComponent },
	{ path: '/chat', name: 'Chat', component: ChatComponent },
  ] // short for `routes: routes`
})




const app = createApp(App);

app.use(router);

app.mount('#app')
