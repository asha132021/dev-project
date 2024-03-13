import { createRouter, createWebHistory } from 'vue-router';
import SignUp from './loginpage/SignUp.vue';
import LogIn from './loginpage/LogIn.vue';
import HomePage from './loginpage/HomePage.vue';
import ContactTable from './tables/ContactTable.vue';
import TagTable from './tables/TagTable.vue';
import UserTable from './tables/UserTable.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/signup',
      name: 'signup',
      component: SignUp,
    },
    {
      path: '/login',
      name: 'login',
      component: LogIn,
    },
    {
      path: '/homepage/:orgId',
      name: 'homepage',
      component: HomePage,
      children: [
        {
          path: 'contacttable',
          name: 'contacttable',
          component: ContactTable,
        },
        {
          path: 'tagtable',
          name: 'tagtable',
          component: TagTable,
        },
        {
          path: 'usertable',
          name: 'usertable',
          component: UserTable,
        },
      ],
    },
  ],
});

