<template>
    <div class="contact-table-container">
      <!-- Button to toggle ContactForm visibility -->
      <button type="button" class="add-button" @click="addContact">Add Contact</button>
  
      <!-- ContactForm Modal Overlay -->
      <div v-if="showContactForm" class="modal-overlay">
        <div class="contact-form-modal">
          <!-- Pass contactData as a prop to ContactForm -->
          <ContactForm @closeForm="closeForm" :initialContact="contactData" :organizationId="orgId" />
        </div>
      </div>
  
      <table class="contact-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Tag</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contact in contacts" :key="contact._id">
            <td>{{ contact.name }}</td>
            <td>{{ contact.email }}</td>
            <td>{{ contact.tag }}</td>
            <td>{{ contact.phone }}</td>
            <td>
              <button class="actionbutton" @click="deleteContact(contact)">
                <img class="action-icon" src="/delete.png" alt="Delete" />
              </button>
              <button class="actionbutton" @click="editContact(contact)">
                <img class="action-icon" src="/edit.png" alt="Edit" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import ContactForm from '../../ui/forms/ContactForm.vue';
  import { ContactsCollection } from '../../db/ContactsCollection';
  import { Meteor } from 'meteor/meteor';
  
  export default {
    name: 'contactTable',
    components: {
      ContactForm,
    },
    data() {
      return {
        showContactForm: false,
        contactData: null,
        orgId: null,
      };
    },
    methods: {
      addContact() {
        // Open ContactForm for adding a new contact
        this.showContactForm = !this.showContactForm;
        this.contactData = null;
      },
      toggleContactForm(contact = null, orgId = null) {
        // Toggle the form and set contactData if available
        this.showContactForm = !this.showContactForm;
        this.contactData = contact;
        this.orgId = orgId || null;
      },
      deleteContact(contact) {
        const confirmDelete = confirm('Are you sure you want to delete this contact?');
        if (confirmDelete) {
          Meteor.call('Contacts.delete', contact._id);
        }
      },
      editContact(contact) {
        // Open ContactForm in edit mode and pass orgId
        this.toggleContactForm(contact, this.orgId);
      },
      closeForm() {
        this.showContactForm = !this.showContactForm;
        this.contactData = null;
      },
    },
    meteor: {
      $subscribe: {
        'organizations': () => [],
        'contacts': (params) => params && params.orgId ? [params.orgId] : [],
      },
      contacts() {
        console.log('Route Params:', this.$route.params);
  const orgId = this.$route.params.orgId;
  console.log('OrgId:', orgId); 
  const contacts = orgId ? ContactsCollection.find({ orgId }).fetch() : [];
  console.log('Contacts:', contacts); 
  return contacts;
      },
    },
  };
  </script>
  

<style scoped>
.add-button {
    background-color: #7745d6;
    border-color: #7745d6;
    color: #fff;
    border-radius: 0.2rem;
    font-size: .875rem;
    line-height: 1.5;
    padding: 0.25rem 0.5rem;
    margin-left: 1270px;
}

.contact-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    table-layout: fixed;
}

.contact-table th,
.contact-table td {
    border: 1px solid #ddd;
    padding: 12px 15px;
    word-wrap: break-word;
    /* Ensure long words break to the next line */
}

.contact-table th {
    background-color: #f2f2f2;
    font-weight: bold;
    border-bottom: 1px solid black;
}

.contact-table tbody tr {
    border-bottom: 1px solid #dddddd;
    text-align: left;
}

.contact-table tbody tr:nth-of-type(even) {
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

.contact-form-modal {
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
