import { createRouter, createWebHistory } from 'vue-router';
import SignUp from './loginpage/SignUp.vue';
import LogIn from './loginpage/LogIn.vue';
import HomePage from './loginpage/HomePage.vue';
import ContactTable from './tables/ContactTable.vue';
import TagTable from './tables/TagTable.vue';
import OrganizationTable from './tables/OrganizationTable.vue';


export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/homepage',
      name: 'homepage',
      component: HomePage,
      children: [
        {
          path:'/contacttable',
          name: 'contact',
          component: ContactTable,
        },
    
        {
          path:'/tagtable',
          name: 'tag',
          component: TagTable,
        },
        {
          path: '/organizationtable',
          name: 'organization',
          component: OrganizationTable,
        },
      ]},
      {
        path: '/',
        name: 'signup',
        component: SignUp,
      },
      {
        path:'/login',
        name: 'login',
        component: LogIn,
      },
  
  ],
});

