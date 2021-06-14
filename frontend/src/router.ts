// 1. Define route components.
// These can be imported from other files
// import HomeComponent from '@/views/Home';
// import EditComponent from '@/components/customer/Edit';
// import CreateComponent from '@/components/customer/Create';

import HomeComponent from '@/views/Home.vue';
import EditComponent from '@/components/customers/Edit.vue';
import CreateComponent from '@/components/customers/Create.vue';

import FriendsComponent from '@/components/Friends.vue';
import StatsComponent from '@/components/Stats.vue';
import ProfileComponent from '@/components/Profile.vue';
import ChatComponent from '@/components/Chat.vue';


// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.

let routes = [];

routes = [
	{ path: '/', redirect: { name: 'home' } },
	{ path: '/home', name: 'home', component: HomeComponent },
	{ path: '/create', name: 'Create', component: CreateComponent },
	{ path: '/edit/:id', name: 'Edit', component: EditComponent },

	{ path: '/friends', name: 'Friends', component: FriendsComponent },
	{ path: '/stats', name: 'Stats', component: StatsComponent },
	{ path: '/profile', name: 'Profile', component: ProfileComponent },
	{ path: '/chat', name: 'Chat', component: ChatComponent },
];

export default { routes };