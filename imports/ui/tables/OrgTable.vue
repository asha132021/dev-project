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
                    <button v-if="!isCurrentUserOrg(organization)" class="actionbutton edit-button" @click="editOrganization(organization)">
                        <img class="action-icon" src="/edit.png" alt="Edit" />
                    </button>
                    <button v-if="!isCurrentUserOrg(organization)" class="actionbutton" @click="deleteOrganization(organization)">
                        <img class="action-icon" src="/delete.png" alt="Delete" />
                    </button>
                    <button v-if="!isCurrentUserOrg(organization)" class="actionbutton" @click="goToOrganizationHomepage(organization)">
                        <img class="action-icon" src="/login.png" alt="login" />
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
        this.loggedIn = !!Meteor.userId();
        if (this.loggedIn) {
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

        goToOrganizationHomepage(organization) {
            const orgId = organization._id;
            const currentUserOrgId = Meteor.user() ? Meteor.user().profile.orgId : null;

            // Check if the user is already logged into the selected organization
            if (currentUserOrgId === orgId) {
                alert('You are already logged into this organization.');
                return;
            }

            // Call the Meteor method to find a user with the role "Keela Admin" in the organization
            Meteor.call('findUserWithRole', orgId, 'Keela Admin', (error, user) => {
                if (error) {
                    console.error('Error finding user with role "Keela Admin":', error);
                    return;
                }

                if (user) {
                    // Fetch the email and password values of the user
                    const {
                        email,
                        password
                    } = user;
                    // Redirect the user to the login page with prefilled email and password
                    this.$router.push(`/login?email=${email}&password=${password}`);
                } else {
                    console.error('No user with role "Keela Admin" found for organization ID:', orgId);
                    alert('No user with role "Keela Admin" found for this organization.');
                }
            });
        },

        deleteOrganization(organization) {
            const currentUserOrgId = this.currentUserOrgId;
            if (organization._id === currentUserOrgId) {
                alert('You cannot delete the organization you are currently logged in with.');
                return;
            }
            const confirmDelete = confirm('Are you sure you want to delete this organization? This action will also remove all associated user data.');
            if (confirmDelete) {
                Meteor.call('organizations.delete', organization._id, (error) => {
                    if (error) {
                        console.error('Error deleting organization:', error);
                        alert('Error deleting organization: ' + error.message);
                    } else {
                        this.deleteAssociatedUsers(organization._id);
                        alert('Organization and associated users deleted successfully.');
                        this.fetchOrganizations();
                    }
                });
            }
        },
        deleteAssociatedUsers(orgId) {
            Meteor.call('users.deleteAssociatedWithOrg', orgId, (error) => {
                if (error) {
                    console.error('Error deleting associated users:', error);
                    alert('Error deleting associated users: ' + error.message);
                }
            });
        },
        fetchOrganizations() {
            this.organizations = OrganizationsCollection.find({}).fetch();
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
    width: 100%;
    /* Set width to 100% to make it full-page */
    overflow: auto;
}

.add-org-button {
    background-color: #7745d6;
    border-color: #7745d6;
    color: #fff;
    border-radius: 0.2rem;
    font-size: .875rem;
    line-height: 1.5;
    padding: 0.25rem 0.5rem;
    margin-left: 1239px;
    margin-top: 20px;
}

.org-table {
    overflow-y: auto;
    max-height: inherit;
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    table-layout: fixed;
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
    border-bottom: 1px solid #ddd;
    position: sticky;
    top: 0;
    z-index: 1;
}

.org-table tbody tr {
    border-bottom: 1px solid #dddddd;
    text-align: left;
}

.org-table tbody tr:nth-of-type(even) {
    background-color: #ffffff;
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
