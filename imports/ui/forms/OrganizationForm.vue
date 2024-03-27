<template>
  <div class="organization-form-container">
    <form @submit.prevent="onSubmit">
      <h1>{{ initialOrganization ? 'Edit Organization Info' : 'Add Organization' }}</h1>


      <label for="fullName"><b>Full Name</b></label>
      <input type="text" v-model.trim="user.fullName" name="fullName" required>


      <label for="email"><b>Email</b></label>
      <input type="email" v-model.trim="user.email" name="email" required>


      <label for="orgName"><b>Organization Name</b></label>
      <input type="text" v-model.trim="organization.orgName" name="orgName" required>

      <label for="password"><b>Password</b></label>
      <input type="password" v-model.trim="user.password" name="password" required>


      <label for="confirmPassword"><b>Confirm Password</b></label>
      <input type="password" v-model.trim="user.confirmPassword" name="confirmPassword" required>
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
        orgName: this.initialOrganization ? this.initialOrganization.orgName : '',
      },
      user: {
        password: '',
        confirmPassword: '',
      },
    };
  },
  methods: {
    onSubmit() {
      if (this.validateForm()) {
        const newOrganization = {
          organizationName: this.organization.orgName,
          organizationEmail: this.user.email,
        };
        Meteor.call('organizations.insert', newOrganization, (error, orgId) => {
          if (error) {
            console.error('Error adding organization:', error);
            alert('Error adding organization: ' + error.message);
          } else {
            Meteor.call('users.insertOrgId', Meteor.userId(), orgId, (error) => {
              if (error) {
                alert(error.reason);
              } else {
                this.clearForm();
                alert('Organization created successfully!');
              }
            });
          }
        });
      }
    },
    validateForm() {
      if (!this.organization.organizationName || !this.user.password || !this.user.confirmPassword) {
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

<!--<template>
    <div v-if ="showForm" class= "form-overlay">
        <div class="modal">
            <div class="close-button" @click="closeForm">
                <img class ="form-close-icon"  src="cross.png">
            </div>
            <h2>{{ editingOrganization ? 'Edit Organization' : 'Add Organization' }}</h2>
            <form @submit.prevent = "submit">
                <input type="text" v-model="organizationName" placeholder="Name" required>
                <input type="email" v-model="organizationEmail" placeholder="Eamil" required>
                <button type="submit">{{ editingOrganization ? 'Save' : 'Add' }}</button>
            </form>
        </div>
    </div>
</template>

<script>
import {ref} from 'vue';

export default {
    name:"organizationForm",
    props:{
        showForm:Boolean, // props defined a properties (showForm here) that is expected to recieve from parent components and here its in the boolean form which is used to verify in the above template 
        editingOrganization: {
            type: Object,
            default: {}
        },
    }, 
    setup (props, context){
        const organizationName = ref (props.editingOrganization? props.editingOrganization.organizationName: '');
        const organizationEmail = ref (props.editingOrganization? props.editingOrganization.organizationEmail: '');

        const submit = () => {
            const newOrganization = {
                organizationName : organizationName.value.trim(),
                organizationEmail : organizationEmail.value.trim(),
            };
            if (props.editingOrganization){
                    const organizationId = props.editingOrganization._id;
                    context.emit('organization-edit',organizationId, newOrganization);
            }else{
                context.emit('organization-added', newOrganization); //alternative this.$emit()
            }
            // Clear form fields
            organizationName.value = '';
            organizationEmail.value = '';
        };
        const closeForm = () => {
            context.emit('form-closed', "Closed");
        };
        return {
            organizationName,
            organizationEmail,
            submit,
            closeForm,
        };
    },
    
};
   
</script>
-->
