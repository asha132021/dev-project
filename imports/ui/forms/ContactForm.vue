<template>
    <div class="contact-form-container">
      <form @submit.prevent="submitContact" class="contact-form">

        <h1>{{ initialContact ? 'Edit Contact' : 'Add Contact' }}</h1>

        <label for="name">Contact Name</label>
        <input v-model="contact.name" id="name" type="text" required />

        <label for="email">Email</label>
        <input v-model="contact.email" id="email" type="email" required />

        <label for="phone">Phone Number</label>
        <input v-model="contact.phone" id="phone" type="tel" />

        <label for="tag">Tag</label>
        <input v-model="contact.tag" id="tag" type="text" />

  
        <div class="button-container">
          <button type="submit" class="add-contact-button">{{initialContact ? 'Save Changes' : 'Add Contact'}}</button>
          <button type="button" @click="closeForm" class="close-button">Cancel</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { Meteor } from 'meteor/meteor';
  
  export default {
    props: ['initialContact'],
    data() {
      return {
        contact: {
          name: '',
          email: '',
          phone: '',
          tag: '',
        },
      };
    },
    mounted() {
      // If initialContact is provided, set the initial values
      if (this.initialContact) {
        this.contact = { ...this.initialContact }
      };
     },
    methods: {
      submitContact() {
        const newContact = {
          name: this.contact.name.trim(),
          email: this.contact.email.trim(),
          phone: this.contact.phone.trim(),
          tag: this.contact.tag.trim(),
        };

        if (this.initialContact) {
          // Update existing contact
          Meteor.call('Contacts.update', this.initialContact._id, newContact, (error) => {
            if (error) {
              alert('Error updating contact: ' + error.message);
            }
          });
        } else {
          // Add new contact
          Meteor.call('Contacts.insert', newContact, (error) => {
            if (error) {
              alert('Error adding contact: ' + error.message);
            }
          });
        }
  
        this.closeForm();
        // Clear the form fields after submission
        this.contact = {
          name: '',
          email: '',
          phone: '',
          tag: '',
        };
      },
      closeForm() {
        // Clear the form fields and close the form
        this.contact = {
          name: '',
          email: '',
          phone: '',
          tag: '',
        };
        this.$emit('closeForm');
      },
    },
  };
  </script>  

<style scoped>
.contact-form-container {
    width: 500px;
    max-width: 100%;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.contact-form {
    display: grid;
    gap: 15px;
}

h1 {
    color: rgb(0, 0, 0);
    font-weight: bold;
    font-size: 20px;
    margin-right: 300px;
}

label {
    font-weight: bold;
    color: #686666;
    margin-bottom: 5px;
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

.add-contact-button {
    background-color: #3498db;
    color: white;
    font-size: 16px;
}

.add-contact-button:hover {
    background-color: #2980b9;
}


.button {
    padding: 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.add-contact-button,
.close-button {
    padding: 12px 20px;
}
.close-button {
    background-color: #e74c3c;
    color: white;
    font-size: 16px;
}

.close-button:hover {
    background-color: #c0392b;
}
</style>
