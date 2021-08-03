import HomeComponent from '@/components/Home.vue';
import FriendsComponent from '@/components/Friends.vue';
import StatsComponent from '@/components/Stats.vue';
import ProfileComponent from '@/components/Profile.vue';
import ChatComponent from '@/components/Chat.vue';
import FriendProfileComponent from '@/components/FriendProfile.vue';
import LeaderboardComponent from '@/components/Leaderboard.vue';
import GameComponent from '@/components/Game.vue';

let routes = [];

routes = [
	{ path: '/', redirect: { name: 'home' } },
	{ path: '/home', name: 'home', component: HomeComponent },
    { path: '/game', name: 'game', component: GameComponent },
	{ path: '/friends', name: 'Friends', component: FriendsComponent },
	{ path: '/stats', name: 'Stats', component: StatsComponent },
	{ path: '/profile', name: 'Profile', component: ProfileComponent },
	{ path: '/chat', name: 'Chat', component: ChatComponent },
	{ path: '/friend/:id', name: 'FriendProfile', component: FriendProfileComponent },
    { path: '/leaderboard', name: 'Leaderboard', component: LeaderboardComponent },
];

export default { routes };