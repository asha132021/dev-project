<template>
    <div class="home-page">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-item" @click="navigateTo('/contacttable')">Contacts</div>
        <div class="sidebar-item" @click="navigateTo('/tagtable')">Tags</div>
       <div class="sidebar-item" @click="navigateTo('/organizationtable')">Users</div>
      </aside>
  
      <!-- Main Content -->
      <main class="main-content">
        <router-view></router-view>
      </main>
  
      <!-- Logout Button -->
      <button class="logout-button" @click="logout">Logout</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      navigateTo(route) {
        this.$router.push(route);
      },
      logout() {
        // Implement your logout logic here
        this.$router.push('/login');
      }
    }
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
  
  
  