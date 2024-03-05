<template>
  <div class="organization-table-container">
    <!-- Button to invite users -->
    <button type="button" class="invite-button" @click="inviteUsers">Invite Users</button>

    <!-- Button to edit organization information -->
    <button type="button" class="edit-button" @click="editOrganization">Edit Organization Information</button>

    <!-- OrganizationForm Modal Overlay -->
    <div v-if="showOrganizationForm" class="modal-overlay">
      <div class="organization-form-modal">
        <!-- Pass organizationData as a prop to OrganizationForm -->
        <OrganizationForm @closeForm="closeForm" :initialOrganization="organizationData" />
      </div>
    </div>

    <table class="organization-table">
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Email Address</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="organization in organizations" :key="organization._id">
          <td>{{ organization.fullName }}</td>
          <td>{{ organization.email }}</td>
          <td>{{ organization.role }}</td>
          <td>
            <button class="actionbutton" @click="deleteOrganization(organization)">
              <img class="action-icon" src="/delete.png" alt="Delete" />
            </button>
            <button class="actionbutton" @click="editOrganization(organization)">
              <img class="action-icon" src="/edit.png" alt="Edit" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import OrganizationForm from '../../ui/forms/OrganizationForm.vue'; 
import { OrganizationsCollection } from '../../db/OrganizationsCollection';
import { Meteor } from 'meteor/meteor';

export default {
  name: "OrganizationTable",
  components: {
    OrganizationForm,
  },
  data() {
    return {
      showOrganizationForm: false,
      organizationData: null, // Added to store data null so that it executes else value
    };
  },
  methods: {
    inviteUsers() {
      // Logic for inviting users
      // You can add your implementation here
    },
    toggleOrganizationForm(organization = null) {
      // Toggle the form and set organizationData if available
      this.showOrganizationForm = !this.showOrganizationForm;
      this.organizationData = organization;
    },
    deleteOrganization(organization) {
      const confirmDelete = confirm('Are you sure you want to delete this organization?');
      if (confirmDelete) {
        Meteor.call('Organizations.delete', organization._id)
      }
    },
    editOrganization(organization) {
      // Open OrganizationForm in edit mode
      this.toggleOrganizationForm(organization);
    },
    closeForm() {
      this.showOrganizationForm = !this.showOrganizationForm;
      this.organizationData = null;
    }
  },
  meteor: {
    $subscribe: {
      'organizations': [],
    },
    organizations() {
      return OrganizationsCollection.find().fetch();
    },
  },
};
</script>

<style scoped>
/* Add your organization table styling here */
/* ... */

.invite-button {
  background-color: #00bcd4;
  border-color: #00bcd4;
  color: #fff;
  border-radius: 0.2rem;
  font-size: .875rem;
  line-height: 1.5;
  padding: 0.25rem 0.5rem;
  margin-right: 10px;
}

.edit-button {
  background-color: #ff9800;
  border-color: #ff9800;
  color: #fff;
  border-radius: 0.2rem;
  font-size: .875rem;
  line-height: 1.5;
  padding: 0.25rem 0.5rem;
}

.organization-table {
  /* Add your organization table styling here */
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  table-layout: fixed;
}

.organization-table th,
.organization-table td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  word-wrap: break-word;
}

.organization-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  border-bottom: 1px solid black;
}

.organization-table tbody tr {
  border-bottom: 1px solid #dddddd;
  text-align: left;
}

.organization-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

/* Modal Overlay Styles */
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

.organization-form-modal {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  z-index: 3;
}
</style>

  