<template>
<form @submit.prevent="onInviteUser">
    <div class="invite-form-container">
        <h1>Invite User</h1>
        <div class="invite-user">

            <label for="fullName"><b>Full Name</b></label>
            <input type="text" v-model="fullName" name="fullName" required />

            <label for="email"><b>Email</b></label>
            <input type="email" v-model="email" name="email" required />

            <!-- Dropdown for selecting role -->
            <label for="role"><b>Role</b></label>
            <select v-model="selectedRole" id="role" required>
                <option value="Keela Admin">Keela Admin</option>
                <option value="Admin">Admin</option>
                <option value="Coordinator">Coordinator</option>
            </select>

            <label for="password"><b>Password</b></label>
            <input type="password" v-model="password" name="password" required />

            <div class="button-container">
                <button type="submit" class="add-user-button"><b>Add User</b></button>
                <button type="button" @click="cancelInvite" class="cancel-button">Cancel</button>
            </div>
        </div>
    </div>
</form>
</template>

  
  
<script>
export default {
    data() {
        return {
            fullName: "",
            email: "",
            password: "",
            selectedRole: "", // Added selectedRole
        };
    },
    methods: {
        onInviteUser() {
            // You can handle the form submission logic here
            console.log('Invited User:', {
                fullName: this.fullName,
                email: this.email,
                password: this.password,
                role: this.selectedRole, // Include the selected role in the console log
            });

            // Clear the form fields after submission
            this.fullName = "";
            this.email = "";
            this.password = "";
            this.selectedRole = ""; // Clear the selected role
        },
        cancelInvite() {
            // Clear the form fields and close the form
            this.fullName = "";
            this.email = "";
            this.password = "";
            this.selectedRole = ""; // Clear the selected role
        },
    },
};
</script>
  
  
  
<style scoped>
.invite-form-container {
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.invite-form-container h1 {
    font-weight: bold;
    font-size: 25px;
    margin-right: 200px;
    padding-bottom: 30px;
}

.invite-user {
    display: grid;
    gap: 15px;
}

label {
    font-weight: bold;
    color: #686666;
}

input {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
#role{
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
}

.add-user-button:hover {
    background-color: #2980b9;
}

.cancel-button {
    background-color: #e74c3c;
    color: white;
    font-size: 16px;
    padding-right: 35px;
    padding-left: 35px;
}

.cancel-button:hover {
    background-color: #c0392b;
}
</style>
