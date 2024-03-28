<template>
  <div class="home-page">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-item" :class="{ 'selected': activeItem === 'contacttable' }" @click="navigateTo('/contacttable')">Contacts</div>
      <div class="sidebar-item" :class="{ 'selected': activeItem === 'tagtable' }" @click="navigateTo('/tagtable')">Tags</div>
      <div v-if="showUsersSidebarItem" class="sidebar-item" :class="{ 'selected': activeItem === 'usertable' }" @click="navigateTo('/usertable')">Users</div>
      <div v-if="showOrgSidebarItem" class="sidebar-item" :class="{ 'selected': activeItem === 'orgtable' }" @click="navigateTo('/orgtable')">Organizations</div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Display Organization Name -->
      <div class="organization-name">
        <p>{{ organizationName }}</p>
      </div>

      <!-- Display User Name -->
      <div class="user-name" @click="toggleDropdown">
        <p>Welcome,  {{ userName }} <i class="arrow down"></i></p>
        <!-- Dropdown menu -->
        <div class="dropdown-menu" v-if="showDropdown">
          <button @click="logout">Logout</button>
        </div>
      </div>

      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { Meteor } from 'meteor/meteor';

export default {
  data() {
    return {
      activeItem: '', 
      showDropdown: false,
      orgName: 'Loading...', 
    };
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
      this.activeItem = route.replace('/', ''); // Set the active item
    },
    logout() {
      // Implement your logout logic here
      this.$router.push('/login');
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown; // Toggle dropdown visibility
    },
  },
  computed: {
    organizationName() {
      // Fetch organization name if the user is logged in
      const user = Meteor.user();
      if (user) {
        const userOrgId = user.profile.orgId;
        Meteor.call('getOrganizationNameById', userOrgId, (error, result) => {
          if (error) {
            console.error('Error fetching organization name:', error);
          } else {
            this.orgName = result;
          }
        });
      }
      return this.orgName;
    },
    userName() {
      // Return user's full name
      const user = Meteor.user();
      return user ? `${user.profile.fullName}` : 'Loading...';
    },
      showUsersSidebarItem() {
      const user = Meteor.user();
      if (user) {
        return user.profile.orgRole === 'Admin' || user.profile.orgRole === 'Keela Admin';
  }
      return false;
    },
    showOrgSidebarItem() {
      const user = Meteor.user();
      if (user) {
        return user.profile.orgRole === 'Keela Admin';
  }
      return false;
    }

  },
};

// Function to check if the user has one of the specified roles
function userHasRole(user, roles) {
  const userRoles = Roles.getRolesForUser(user._id);
  return userRoles.some(role => roles.includes(role));
}
</script>



<style scoped>
.home-page {
display: flex;
position: relative;
height: 100vh;
}

.sidebar {
width: 300px;
background-color: #f9f0ff;
color: black;
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

/* Add style for selected sidebar item */
.selected {
background-color: #7745d6;
color: white;
}

.main-content {
flex: 1;
padding: 20px;
}

.organization-name {
margin-top: 0;
text-align: center;
font-size: 20px;
font-weight: bold;
}

.user-name {
text-align: right;
}

.user-name {
position: absolute;
top: 20px;
right: 20px;
padding: 10px;
cursor: pointer;
color: #7745d6;
font-weight: bold;
}
.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 4px;
}
.down {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
/* Dropdown menu styles */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 1000;
  padding: 5px 0;
}

.dropdown-menu button {
  display: block;
  width: 100%;
  padding: 8px 16px;
  text-align: left;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.dropdown-menu button:hover {
  background-color: #f9f9f9;
}
</style>