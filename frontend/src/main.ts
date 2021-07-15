import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeComponent from '@/components/Home.vue';
import FriendsComponent from '@/components/Friends.vue';
import StatsComponent from '@/components/Stats.vue';
import ProfileComponent from '@/components/Profile.vue';
import ChatComponent from '@/components/Chat.vue';
import TestComponent from '@/components/Test.vue';
import FriendProfileComponent from '@/components/FriendProfile.vue';
import LeaderboardComponent from '@/components/Leaderboard.vue';


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: { name: 'home' } },
    { path: '/home', name: 'home', component: HomeComponent },
    { path: '/test', name: 'test', component: TestComponent },
    { path: '/friends', name: 'Friends', component: FriendsComponent },
    { path: '/stats', name: 'Stats', component: StatsComponent },
    { path: '/profile', name: 'Profile', component: ProfileComponent },
    { path: '/chat', name: 'Chat', component: ChatComponent },
    { path: '/friend/:id', name: 'FriendProfile', component: FriendProfileComponent },
    { path: '/leaderboard', name: 'Leaderboard', component: LeaderboardComponent },
  ]
})

const app = createApp(App);
app.use(router);
app.mount('#app');