<template>
<div class="user-table-container">
    <button type="button" class="invite-button" @click="toggleInviteForm">Invite Users</button>

    <div v-if="showInviteForm" class="modal-overlay">
        <div class="user-form-modal">
            <!-- InviteForm component -->
            <inviteForm :show-form="showInviteForm" :initialData="userData" @cancelInvite="cancelInvite" @invite-user="inviteUser" />
        </div>
    </div>

    <!-- User Table -->
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
            <!-- Loop through users and display their information -->
            <tr v-for="user in specificOrganizations" :key="user._id">
                <td>{{ user.profile && user.profile.fullName }}</td>
                <td>{{ user.emails[0].address }}</td>
                <td>{{ user.profile && user.profile.orgRole }}</td>
                <td>
                    <!-- Action buttons for editing and deleting users -->
                    <button v-if="shouldShowDeleteButton(user)" class="actionbutton" @click="deleteUser(user)">
                        <img class="action-icon" src="/delete.png" alt="Delete" />
                    </button>
                    <button v-if="shouldShowEditButton(user)" class="actionbutton" @click="editUser(user)">
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
    Meteor
} from 'meteor/meteor';
import InviteForm from '../../ui/forms/InviteForm.vue';

export default {
    name: "UserTable",
    components: {
        InviteForm,
    },
    data() {
        return {
            showInviteForm: false,
            userData: null,
        };
    },
    methods: {

        toggleInviteForm() {
            this.showInviteForm = !this.showInviteForm;
            this.userData = null; // Reset user data when toggling form
        },

        cancelInvite() {
            this.showInviteForm = false; // Hide the invite form
            this.userData = null; // Reset user data
        },
        // Method to handle inviting a new user
        inviteUser(newUser) {
            Meteor.call('users.add', newUser, (error, userId) => {
                if (error) {
                    if (error.error === '') {
                        alert('Email already exists.');
                    } else {
                        alert(error.message);
                    }
                } else {
                    console.log('User added with ID:', userId);
                    this.showInviteForm = false; // Close the invite form after inviting the user
                }
            });
        },
        deleteUser(user) {
            // Check if the user to be deleted is the same as the logged-in user
            const loggedInUserId = Meteor.userId();
            if (user._id === loggedInUserId) {
                alert("You cannot delete your own account.");
                return;
            }

            const confirmDelete = confirm('Are you sure you want to delete this user?');
            if (confirmDelete) {
                Meteor.call('users.delete', user._id);
            }
        },
        // Method to edit a user
        editUser(user) {
            this.showInviteForm = true; // Show the invite form
            this.userData = user; // Set user data for editing
        },
        // Method to handle closing the form when editing is canceled
        cancelEdit() {
            this.showInviteForm = false; // Hide the invite form
            this.userData = null; // Reset user data
        },
        shouldShowDeleteButton(user) {
            // Check if the logged-in user is an Admin
            const loggedInUser = Meteor.user();
            if (loggedInUser && loggedInUser.profile.orgRole === 'Admin') {
                // If the logged-in user is an Admin, hide the delete button for Keela Admin users
                return user.profile.orgRole !== 'Keela Admin';
            }
            // If the logged-in user is not an Admin, show the delete button for all users
            return true;
        },
        shouldShowEditButton(user) {
            // Check if the logged-in user is an Admin
            const loggedInUser = Meteor.user();
            if (loggedInUser && loggedInUser.profile.orgRole === 'Admin') {
                // If the logged-in user is an Admin, hide the edit button for Keela Admin users
                return user.profile.orgRole !== 'Keela Admin';
            }
            // If the logged-in user is not an Admin, show the edit button for all users
            return true;
        },
    },
    meteor: {
        // Subscribe to the 'users' publication
        $subscribe: {
            'users': [],
        },
        // Fetch specific user data from the Meteor.users collection
        specificOrganizations() {
            return Meteor.users.find().fetch();
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
    margin-top: 20px;
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
    border-bottom: 1px solid #ddd;
}

.user-table tbody tr {
    border-bottom: 1px solid #dddddd;
    text-align: left;
}

.user-table tbody tr:nth-of-type(even) {
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
