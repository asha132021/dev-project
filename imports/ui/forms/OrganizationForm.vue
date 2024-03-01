<template>
    <div class="organization-form-container">
      <form @submit.prevent="saveChanges" class="organization-form">
        <label for="orgName">Organization Name</label>
        <input v-model="organizationName" id="orgName" type="text" placeholder="Organization Name" required />
  
        <label for="orgEmail">Organization Email</label>
        <input v-model="organizationEmail" id="orgEmail" type="email" placeholder="org@example.com" required />
  
        <div class="button-container">
          <button type="submit" class="save-changes-button">Save Changes</button>
          <button type="button" @click="cancelChanges" class="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        organizationName: '',
        organizationEmail: '',
      };
    },
    methods: {
      saveChanges() {
        // You can handle the form submission logic here
        console.log('Organization Name:', this.organizationName);
        console.log('Organization Email:', this.organizationEmail);
        
        // Clear the form fields after submission
        this.organizationName = '';
        this.organizationEmail = '';
      },
      cancelChanges() {
        // Clear the form fields and close the form
        this.organizationName = '';
        this.organizationEmail = '';
      },
    },
  };
  </script>
  
  <style scoped>
  .organization-form-container {
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .organization-form {
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
  
  .save-changes-button {
    background-color: #3498db;
    color: white;
  }
  
  .save-changes-button:hover {
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
  