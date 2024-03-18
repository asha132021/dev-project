<template>
<div class="user-table-container">
    <button type="button" class="invite-button" @click="inviteUser">Invite Users</button>

    <div v-if="showInviteForm" class="modal-overlay">
        <div class="user-form-modal">
            <InviteForm :initialData="organizationData" @cancelInvite="cancelInvite" @inviteUser="inviteUser"/>
        </div>
    </div>

    <table class="user-table">
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
                <td>{{ organization.orgRole }}</td>
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
import {
    OrganizationsCollection
} from '../../db/OrganizationsCollection';
import InviteForm from '../../ui/forms/InviteForm.vue';
import {
    Meteor
} from 'meteor/meteor';

export default {
    name: "UserTable",
    components: {
        InviteForm,
    },
    data() {
        return {
            showInviteForm: false,
            organizationData: null,
        };
    },
    methods: {
        toggleInviteForm(organization = null) {

            this.showInviteForm = !this.showInviteForm;
            this.organizationData = organization;
        },
        cancelInvite() {
            this.showInviteForm = !this.showInviteForm;
            this.showInviteForm = null;
        },
        deleteOrganization(organization) {
            const confirmDelete = confirm('Are you sure you want to delete this user?');
            if (confirmDelete) {
                Meteor.call('organizations.delete', organization._id);
            }
        },
        editOrganization(organization) {
            this.toggleInviteForm(organization);
        },
        inviteUser() {
            this.showInviteForm = !this.showInviteForm;
            this.organizationData = null;
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
.invite-button {
    background-color: #7745d6;
    border-color: #7745d6;
    color: #fff;
    border-radius: 0.2rem;
    font-size: .875rem;
    line-height: 1.5;
    padding: 0.25rem 0.5rem;
    margin-left: 1270px;
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

.user-table {

    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    table-layout: fixed;
}

.user-table th,
.user-table td {
    border: 1px solid #ddd;
    padding: 12px 15px;
    word-wrap: break-word;
}

.user-table th {
    background-color: #f2f2f2;
    font-weight: bold;
    border-bottom: 1px solid black;
}

.user-table tbody tr {
    border-bottom: 1px solid #dddddd;
    text-align: left;
}

.user-table tbody tr:nth-of-type(even) {
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

.user-form-modal {
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
