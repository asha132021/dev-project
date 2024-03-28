<template>
  <div class="organization-form-container">
    <form @submit.prevent="onSubmit">
      <h1>{{ initialOrganization ? 'Edit Organization Info' : 'Add Organization' }}</h1>

      <!-- Organization Name Field -->
      <label for="orgName"><b>Organization Name</b></label>
      <input type="text" v-model="organization.orgName" name="orgName" required>

      <!-- Org Role Field -->
      <label v-if="!initialOrganization" for="orgRole"><b>Org Role</b></label>
      <select v-if="!initialOrganization" v-model="user.orgRole" name="orgRole" required>
        <option value="Keela Admin">Keela Admin</option>
      </select>

      <!-- Organization Email Field (only for adding new organization) -->
      <label v-if="!initialOrganization" for="email"><b>Email</b></label>
      <input v-if="!initialOrganization" type="email" v-model="user.email" name="email" required>

      <!-- Full Name Field (only for adding new organization) -->
      <label v-if="!initialOrganization" for="fullName"><b>Full Name</b></label>
      <input v-if="!initialOrganization" type="text" v-model="user.fullName" name="fullName" required>

      <!-- Password Field (only for adding new organization) -->
      <label v-if="!initialOrganization" for="password"><b>Password</b></label>
      <input v-if="!initialOrganization" type="password" v-model="user.password" name="password" required>

      <!-- Confirm Password Field (only for adding new organization) -->
      <label v-if="!initialOrganization" for="confirmPassword"><b>Confirm Password</b></label>
      <input v-if="!initialOrganization" type="password" v-model="user.confirmPassword" name="confirmPassword" required>

      <!-- Submit and Cancel Buttons -->
      <div class="button-container">
        <button type="submit" class="submit-button">{{ initialOrganization ? 'Save Changes' : 'Create Organization' }}</button>
        <button type="button" @click="cancelForm" class="cancel-button">Cancel</button>
      </div>
    </form>
  </div>
</template>


<script>
import { Meteor } from 'meteor/meteor';

export default {
  name: 'OrganizationForm',
  props: ['initialOrganization'],
  data() {
    return {
      organization: {
        orgName: this.initialOrganization ? this.initialOrganization.organizationName : '',
        orgRole: '',
      },
      user: {
        fullName: '', 
        email: '',
        password: '',
        confirmPassword: '',
      },
      errorMessage: '',
    };
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    fetchUserData() {
      const user = Meteor.user();
      if (user) {
        this.organization.orgRole = user.profile.orgRole;
        this.user.fullName = user.profile.fullName; 
      }
    },
    onSubmit() {
      if (this.validateForm()) {
        if (this.initialOrganization) {
          // Editing existing organization
          this.updateOrganization();
        } else {
          // Creating new organization
          this.createOrganization();
        }
      }
    },
    createOrganization() {
      const newOrganization = {
        organizationName: this.organization.orgName,
        organizationEmail: this.user.email,
      };
      // Create organization
      Meteor.call('organizations.insert', newOrganization, (error, orgId) => {
        if (error) {
          this.errorMessage = 'Error adding organization: ' + error.message;
        } else {
          this.createUser(orgId);
        }
      });
    },
    updateOrganization() {
    const updatedOrganization = {
        orgName: this.organization.orgName,
        orgRole: this.organization.orgRole,
    };
    // Update organization
    Meteor.call('organizations.update', this.initialOrganization._id, updatedOrganization, (error) => {
        if (error) {
            this.errorMessage = 'Error updating organization: ' + error.message;
        } else {
            // After updating organization, update associated users' orgName
            Meteor.call('users.updateOrgName', this.initialOrganization._id, this.organization.orgName, (error) => {
                if (error) {
                    this.errorMessage = 'Error updating users: ' + error.reason;
                } else {
                    this.clearForm();
                    alert('Organization and associated users updated successfully!');
                }
            });
        }
    });
},
updateUsersOrgName(orgId, orgName) {
  // Update all users with the given organization ID
  Meteor.call('users.updateOrgName', orgId, orgName, (error) => {
    if (error) {
      this.errorMessage = 'Error updating users: ' + error.reason;
    } else {
      this.clearForm();
      alert('Organization and associated users updated successfully!');
    }
  });
},
    createUser(orgId) {
      const newUser = {
        email: this.user.email,
        password: this.user.password,
        profile: {
          orgId: orgId,
          orgName: this.organization.orgName,
          orgRole: this.organization.orgRole,
          fullName: this.user.fullName, 
        },
      };
      // Create user
      Accounts.createUser(newUser, (error) => {
        if (error) {
          this.errorMessage = 'Error creating user: ' + error.reason;
        } else {
          this.clearForm();
          alert('Organization and user created successfully!');
        }
      });
    },
    validateForm() {
    console.log('Organization Name:', this.organization.orgName);
    console.log('Email:', this.user.email);
    // Add similar log statements for other fields

    if (!this.organization.orgName || !this.user.email || !this.user.password || !this.user.confirmPassword || !this.user.fullName) {
        alert('Please fill out all fields.');
        return false;
    }
    if (this.user.password !== this.user.confirmPassword) {
        alert('Passwords do not match.');
        return false;
    }
    return true;
},
    clearForm() {
      this.organization.orgName = '';
      this.user.email = '';
      this.user.fullName = '';
      this.user.password = '';
      this.user.confirmPassword = '';
    },
    cancelForm() {
      this.clearForm();
      this.$emit('cancel');
    },
  },
};
</script>


<style scoped>
.organization-form-container {
    width: 500px;
    background-color: #fff;
    max-width: 100%;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.organization-form-container h1 {
    color: #333; /* Change color */
    font-weight: bold;
    font-size: 20px; /* Increase font size */
    margin-bottom: 20px; /* Add some space below the heading */
}

.organization-form {
    display: grid;
    gap: 15px;
}

label {
    font-weight: bold;
    color: #686666;
}

/* Adjust input field styles */
input {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    margin-bottom: 20px;
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

.submit-button {
    background-color: #3498db;
    color: white;
    font-size: 16px;
}

.submit-button:hover {
    background-color: #3498db;
}

.cancel-button {
    background-color: #e74c3c;
    color: white;
    font-size: 16px;
}

.cancel-button:hover {
    background-color: #c0392b;
}
</style>

<style scoped>
.organization-form-container {
    width: 500px;
    background-color: #fff;
    max-width: 100%;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.organization-form-container h1 {
    color: #333; /* Change color */
    font-weight: bold;
    font-size: 20px; /* Increase font size */
    margin-bottom: 20px; /* Add some space below the heading */
}

.organization-form {
    display: grid;
    gap: 15px;
}

label {
    font-weight: bold;
    color: #686666;
}

/* Adjust input field styles */
input {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    margin-bottom: 20px;
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

.submit-button {
    background-color: #3498db;
    color: white;
    font-size: 16px;
}

.submit-button:hover {
    background-color: #3498db;
}

.cancel-button {
    background-color: #e74c3c;
    color: white;
    font-size: 16px;
}

.cancel-button:hover {
    background-color: #c0392b;
}
</style>
