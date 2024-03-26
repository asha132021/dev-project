<template>
<form @submit.prevent="onInviteUser" class="invite-form-container">
    <h1>{{ initialData ? 'Edit User Data' : 'Invite User' }}</h1>
    <div class="invite-user">
        <label for="fullName"><b>Full Name</b></label>
        <input type="text" v-model="fullName" name="fullName" required />

        <label for="email"><b>Email</b></label>
        <input type="email" v-model="email" name="email" required />

        <label for="role"><b>Role</b></label>
        <select v-model="selectedRole" id="role" required>
            <!-- Only show Keela Admin option if the logged-in user is not an Admin -->
            <option v-if="!isAdmin" value="Keela Admin">Keela Admin</option>
            <option value="Admin">Admin</option>
            <option value="Coordinator">Coordinator</option>

        </select>

        <label for="password"><b>Password</b></label>
        <input type="password" v-model="password" name="password" required />

        <label for="confirmPassword"><b>Confirm Password</b></label>
        <input type="password" v-model="confirmPassword" name="confirmPassword" required />
        <p v-if="passwordMismatch" class="error-message">Passwords do not match</p>

        <div class="button-container">
            <button type="submit" class="add-user-button">
                <b>{{ initialData ? 'Save Data' : 'Add User' }}</b>
            </button>
            <button type="button" @click="cancelInvite" class="cancel-button">Cancel</button>
        </div>
    </div>
</form>
</template>

<script>
export default {
    props: ['initialData'],
    data() {
        return {
            fullName: this.initialData ? this.initialData.profile.fullName : "",
            email: this.initialData ? this.initialData.emails[0].address : "",
            password: "",
            confirmPassword: "",
            selectedRole: this.initialData ? this.initialData.profile.orgRole : "",
            passwordMismatch: false,
        };
    },
    computed: {
        // Check if the logged-in user is an Admin
        isAdmin() {
            const loggedInUser = Meteor.user();
            return loggedInUser && loggedInUser.profile.orgRole === 'Admin';
        },
    },
    methods: {
        onInviteUser() {
            // Check if passwords match
            if (this.password !== this.confirmPassword) {
                this.passwordMismatch = true;
                return;
            }

            // Prepare user data
            const userData = {
                profile: {
                    fullName: this.fullName,
                    orgRole: this.selectedRole,
                    orgId: Meteor.user().profile.orgId,
                },
                email: this.email,
                password: this.password,
            };

            // Handle editing existing user data
            if (this.initialData) {
                // Omit password and email fields if they are not changed
                if (!this.password) delete userData.password;
                if (!this.email) delete userData.email;

                Meteor.call('users.edit', this.initialData._id, userData, (error) => {
                    if (error) {
                        alert('Error updating user data: ' + error.message);
                    } else {
                        console.log('User data updated successfully.');
                    }
                });
            } else {
                // Handle inviting a new user
                Meteor.call('users.add', userData, (error) => {
                    if (error) {
                        alert('Error adding user: ' + error.message);
                    } else {
                        console.log('User added successfully.');
                    }
                });
            }

            // Clear the form fields after submission
            this.cancelInvite();
        },
        cancelInvite() {
            // Clear the form fields
            this.fullName = "";
            this.email = "";
            this.password = "";
            this.confirmPassword = "";
            this.selectedRole = "";

            // Emit an event to notify the parent component
            this.$emit('cancelInvite');
        },
    },
};
</script>

<style scoped>
.invite-form-container {
    width: 500px;
    background-color: #fff;
    max-width: 100%;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.invite-form-container h1 {
    color: rgb(0, 0, 0);
    font-weight: bold;
    font-size: 20px;
    margin-right: 300px;
}

.invite-user {
    display: grid;
    gap: 15px;
}

label {
    font-weight: bold;
    color: #2d2c2c;
}

input,
select {
    /* Apply similar styles to both input and select */
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    padding: 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.add-user-button {
    background-color: #3498db;
    color: white;
    font-size: 16px;
}

.add-user-button:hover {
    background-color: #2980b9;
}

.cancel-button {
    background-color: #e74c3c;
    color: white;
    font-size: 16px;
}

.cancel-button:hover {
    background-color: #c0392b;
}

.error-message {
    color: red;
    /* Set text color to red */
}
</style>
