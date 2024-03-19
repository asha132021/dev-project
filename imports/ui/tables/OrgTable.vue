<template>
  <div class="org-table-container">
    <button type="button" class="add-org-button" @click="addOrganization">Add Organization</button>

    <div v-if="showOrgForm" class="modal-overlay">
      <div class="org-form-modal">
        <SignUp @cancel="cancelForm" @submit="submitForm" />
      </div>
    </div>

    <table class="org-table">
      <thead>
        <tr>
          <th>Organization Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="organization in organizations" :key="organization._id">
          <td>{{ organization.orgName }}</td>
          <td>
            <button class="actionbutton edit-button" @click="editOrganization(organization)">
              <img class="action-icon" src="/edit.png" alt="Edit" />
            </button>
            <button class="actionbutton" @click="deleteOrganization(organization)">
              <img class="action-icon" src="/delete.png" alt="Delete" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { OrganizationsCollection } from '../../db/OrganizationsCollection';
import SignUp from '../../ui/loginpage/SignUp.vue';
import { Meteor } from 'meteor/meteor';

export default {
  name: "OrgTable",
  components: {
    SignUp,
  },
  data() {
    return {
      showOrgForm: false,
    };
  },
  methods: {
    addOrganization() {
      this.showOrgForm = true;
    },
    editOrganization(organization) {
      this.showOrgForm = true;
    },
    deleteOrganization(organization) {
      const confirmDelete = confirm('Are you sure you want to delete this organization?');
      if (confirmDelete) {
        Meteor.call('organizations.delete', organization._id);
      }
    },
    cancelForm() {
      this.showOrgForm = false;
    },
    submitForm() {
      this.showOrgForm = false;
    },
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


  