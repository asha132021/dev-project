import { createRouter, createWebHistory } from 'vue-router';
import SignUp from './loginpage/SignUp.vue';
import LogIn from './loginpage/LogIn.vue';
import HomePage from './loginpage/HomePage.vue';
import ContactTable from './tables/ContactTable.vue';
import TagTable from './tables/TagTable.vue';
import OrganizationForm from './forms/OrganizationForm.vue';
import InviteForm from './forms/InviteForm.vue'



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
          path:'/organizationinfoedit',
          name: 'organization',
          component: OrganizationForm,
        },
        {
        path:'/invite',
        name: 'invite',
        component: InviteForm,
      },
      ]},
      {
        path: '/signup',
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
