<template>
  <div class="org-table-container" v-if="loggedIn">

    <button type="button" class="add-org-button" @click="addOrganization">Add Organization</button>


    <div v-if="showOrgForm" class="modal-overlay">
      <div class="org-form-modal">
        <OrganizationForm :initialOrganization="selectedOrganization" @cancel="cancelForm" @submit="submitForm" />
      </div>
    </div>


    <table class="org-table">
      <thead>
        <tr>
          <th>Organization Name</th>
          <th>Organization Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="organization in organizations" :key="organization._id">
          <td>{{ organization.organizationName }}</td>
          <td>{{ organization.organizationEmail }}</td>

          <td>
            <!--<button v-if="!isCurrentUserOrg(organization)" class="actionbutton edit-button" @click="editOrganization(organization)">
              <img class="action-icon" src="/edit.png" alt="Edit" />
            </button> -->
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
    import {
        OrganizationsCollection
    } from '../../db/OrganizationsCollection';
    import OrganizationForm from '../../ui/forms/OrganizationForm.vue';
    import {
        Meteor
    } from 'meteor/meteor';

    export default {
        name: "OrgTable",
        components: {
            OrganizationForm,
        },
        data() {
            return {
                showOrgForm: false,
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
    // this.fetchUserFullName(organization.organizationEmail);
},

deleteOrganization(organization) {
    // Get the current user's organization ID
    const currentUserOrgId = this.currentUserOrgId;

    // Prevent deletion if user is logged in with this organization
    if (organization._id === currentUserOrgId) {
        alert('You cannot delete the organization you are currently logged in with.');
        return;
    }

    // Show confirmation dialog
    const confirmDelete = confirm('Are you sure you want to delete this organization? This action will also remove all associated user data.');

    if (confirmDelete) {
        // Fetch all users with the organization ID to be deleted
        const usersToDelete = Meteor.users.find({ 'profile.orgId': organization._id }).fetch();

        // Delete users associated with the organization
        usersToDelete.forEach(user => {
            Meteor.call('users.delete', user._id, (error) => {
                if (error) {
                    console.error('Error deleting user:', error);
                }
            });
        });

        // Delete the organization
        Meteor.call('organizations.delete', organization._id, (error) => {
            if (error) {
                alert('Error deleting organization: ' + error.message);
            } else {
                // Inform the user about the deletion of associated users
                alert('Organization and associated users deleted successfully.');
                // Refresh organizations after deletion
                this.fetchOrganizations();
            }
        });
    }
},


            fetchOrganizations() {
                this.organizations = OrganizationsCollection.find({}).fetch();
            },
            fetchUserFullName(email) {
                Meteor.call('users.getFullNameByEmail', email, (error, fullName) => {
                    if (error) {
                        console.error('Error fetching user full name:', error);
                        // Handle error
                    } else {
                        this.selectedOrganization.userFullName = fullName;
                    }
                });
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
        computed: {
            currentUserOrgId() {
                // Fetch the ID of the organization the user is currently logged in with
                const user = Meteor.user();
                return user ? user.profile.orgId : null;
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
