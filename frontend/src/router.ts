import HomeComponent from '@/components/Home.vue';
import FriendsComponent from '@/components/Friends.vue';
import StatsComponent from '@/components/Stats.vue';
import ProfileComponent from '@/components/Profile.vue';
import ChatComponent from '@/components/Chat.vue';

let routes = [];

routes = [
	{ path: '/', redirect: { name: 'home' } },
	{ path: '/home', name: 'home', component: HomeComponent },
	{ path: '/friends', name: 'Friends', component: FriendsComponent },
	{ path: '/stats', name: 'Stats', component: StatsComponent },
	{ path: '/profile', name: 'Profile', component: ProfileComponent },
	{ path: '/chat', name: 'Chat', component: ChatComponent },
];

export default { routes };