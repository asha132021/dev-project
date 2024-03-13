<template>
  <div class="home-page">
    <!-- Sidebar -->
    <aside class="sidebar">
      <router-link :to="{ name: 'contacttable', params: { orgId: $route.params.orgId }}">Contacts</router-link>
      <router-link :to="{ name: 'tagtable', params: { orgId: $route.params.orgId }}">Tags</router-link>
      <router-link :to="{ name: 'usertable', params: { orgId: $route.params.orgId }}">Users</router-link>
    </aside>

    <main class="main-content">
      <router-view></router-view>
    </main>

    <!-- Logout Button -->
    <button class="logout-button" @click="logout">Logout</button>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  methods: {
    logout() {
      this.$router.push('/login');
    },
  },
  meteor: {
    $subscribe: {
      'organizations': [],
    },
  },
};
</script>


  
  <style scoped>
  .home-page {
    display: flex;
    height: 100vh;
  }
  
  .sidebar {
    width: 300px;
    background-color: #333;
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  
  .sidebar-item {
    margin-bottom: 15px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 18px;
  }
  
  .sidebar-item:hover {
    background-color: #555;
  }
  
  .main-content {
    flex: 1;
    padding: 20px;
  }
  
  .logout-button {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 10px;
    cursor: pointer;
  }
  </style>
  
  