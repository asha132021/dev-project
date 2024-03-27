<template>
  <div class="org-table-container" v-if="loggedIn">
    <!-- Add Organization Button -->
    <button type="button" class="add-org-button" @click="addOrganization">Add Organization</button>

    <!-- Organization Form Modal -->
    <div v-if="showOrgForm" class="modal-overlay">
      <div class="org-form-modal">
        <OrganizationForm :initialOrganization="selectedOrganization" @cancel="cancelForm" @submit="submitForm" />
      </div>
    </div>

    <!-- Organization Table -->
    <table class="org-table">
      <thead>
        <tr>
          <th>Organization Name</th>
          <th>Organization Email</th>
          <th>Number of Users</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="organization in organizations" :key="organization._id">
          <td>{{ organization.organizationName }}</td>
          <td>{{ organization.organizationEmail }}</td>
          <td>{{ getUsersCount(organization._id) }}</td>
          <td>
            <button v-if="!isCurrentUserOrg(organization)" class="actionbutton edit-button" @click="editOrganization(organization)">
              <img class="action-icon" src="/edit.png" alt="Edit" />
            </button>
            <button v-if="!isCurrentUserOrg(organization)" class="actionbutton" @click="deleteOrganization(organization)">
              <img class="action-icon" src="/delete.png" alt="Delete" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>
    <p>Please log in to view this content.</p>
  </div>
</template>

<script>
import { OrganizationsCollection } from '../../db/OrganizationsCollection';
import OrganizationForm from '../../ui/forms/OrganizationForm.vue';
import { Meteor } from 'meteor/meteor';

export default {
  name: "OrgTable",
  components: {
    OrganizationForm,
  },
  data() {
    return {
      showOrgForm: false,
      organizations: [],
      selectedOrganization: null,
      currentUserOrgName: '',
      loggedIn: false,
    };
  },
  created() {
    // Check if the user is logged in
    this.loggedIn = !!Meteor.userId();
    if (this.loggedIn) {
      // Fetch organizations if the user is logged in
      this.fetchOrganizations();
    }
  },
  methods: {
    addOrganization() {
      this.selectedOrganization = null;
      this.showOrgForm = true;
    },
    
    editOrganization(organization) {
      this.selectedOrganization = organization;
      this.showOrgForm = true;
    },

    deleteOrganization(organization) {
      Meteor.call('organizations.delete', organization._id, (error) => {
        if (error) {
          alert('Error deleting organization: ' + error.message);
        } else {
          this.fetchOrganizations(); 
        }
      });
    },
    fetchOrganizations() {
      this.organizations = OrganizationsCollection.find({}).fetch();
    },

    getUsersCount(orgId) {
      return Meteor.users.find({ 'profile.orgId': orgId }).count();
    },

    submitForm() {
      this.showOrgForm = false;
      this.selectedOrganization = null;
    },

    cancelForm() {
      this.showOrgForm = false;
      this.selectedOrganization = null;
    },

    isCurrentUserOrg(organization) {
      return organization.organizationName === this.currentUserOrgName;
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
.org-table-container {
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
}

.add-org-button {
  background-color: #7745d6;
  border-color: #7745d6;
  color: #fff;
  border-radius: 0.2rem;
  font-size: .875rem;
  line-height: 1.5;
  padding: 0.25rem 0.5rem;
  margin-bottom: 10px;
}

.org-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.org-table th,
.org-table td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  word-wrap: break-word;
}

.org-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.org-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.org-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.org-form-modal {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  z-index: 3;
}

.actionbutton {
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
}

.action-icon {
  width: 25px;
  height: 25px;
}
</style>

<!--
<template>
  <div class="table-grid">
    <button type="button" class="add-button" :disabled="isAddButtonDisabled" @click="addOrganization">Add Organization</button>
    <organizationForm v-if="showForm" :show-Form="showForm" :editingOrganization="editingOrganization" @organization-added="handleOrganizationAdd" @organization-edit="handleOrganizationEdit" @form-closed="formClosed"/>
  </div> 
  <div class="table-box">
    <table class="table">
      <thead>
        <tr>   
          <th>NAME</th>
          <th>EMAIL</th>
          <th>USERS</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr class="table-row" v-for="organization in filteredOrganizations" :key="organization._id">
          <td @click="navigateToUserTable(organization._id, organization.organizationName)">{{ organization.organizationName }}</td>
          <td @click="navigateToUserTable(organization._id, organization.organizationName)">{{ organization.organizationEmail }}</td>
          <td @click="navigateToUserTable(organization._id, organization.organizationName)">{{ getUsersCount(organization._id) }}</td>
          <td>
            <button class="edit-button" @click="editOrganization(organization)">Edit</button>
            <button class="delete-button" @click="deleteOrganization(organization)">Delete</button>
          </td>
        </tr>
      </tbody>    
    </table>
  </div>
</template>

<script>
import organizationForm from '../forms/OrganizationForm.vue';
import { OrganizationsCollection } from '../../db/OrganizationsCollection';
import { Meteor } from 'meteor/meteor';
import userTable from './UserTable.vue';

export default {
  name: 'OrgTable',
  components: {
    organizationForm,
    userTable,
  },
  data() {    
    return {
      showForm: false, 
      editingOrganization: null, 
      isAddButtonDisabled: false,
    };
  },
  meteor: {
    $subscribe: {
      organizations: [],
      users: [],
    },
  },
  computed: {
    organizations() {
      return OrganizationsCollection.find({}).fetch(); 
    },
    users() {
      return Meteor.users.find({}).fetch();
    },
    filteredOrganizations() {
  // Log the value of this.organizations to ensure it is populated with the expected data
  console.log("Organizations:", this.organizations);

  // Filter organizations based on logged-in user's organization
  const loggedInUser = Meteor.user();
  if (loggedInUser) {
    const orgId = loggedInUser.profile.orgId;
    console.log("Logged-in User:", loggedInUser);
    console.log("Org ID:", orgId);
    return this.organizations.filter(org => org.userId === loggedInUser._id || org.userId === orgId);
  } else {
    return [];
  }
},
  },
  methods: {
    addOrganization() {
      this.isAddButtonDisabled = false;
      this.editingOrganization = null; 
      this.showForm = true;
    },
    editOrganization(organization) {
      this.editingOrganization = { ...organization };
      this.showForm = true;  
    },
    handleOrganizationAdd(newOrganization) {
      Meteor.call('organizations.insert', newOrganization);
      this.showForm = false;
    },
    handleOrganizationEdit(organizationId, newOrganization) {
      if (confirm('Are you sure you want to edit this organization?')) {
        Meteor.call('organizations.edit', organizationId, newOrganization, (error) => {
          if (error) {
            alert('Error editing organization: ' + error.message);
          }
        });
      }
      this.showForm = false;
    },
    deleteOrganization(organization) {
      Meteor.call('organizations.delete', organization._id, (error) => {
        if (error) {
          alert('Error deleting organization: ' + error.message);
        }
      });
    },
    formClosed() {
      this.showForm = false;
    },
    navigateToUserTable(orgId, orgName) {
      this.$router.push({ name: 'userTable', params: { orgId, orgName } });
    },
    getUsersCount(orgId) {
      return this.users.filter(user => user.profile && user.profile.orgId === orgId).length;
    },
  },
};
</script>
-->