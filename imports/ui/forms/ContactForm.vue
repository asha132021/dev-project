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

        <label for="tag">Tags</label>
        <div class="tag-select-container">
            <select v-model="selectedTags" id="tag" multiple @change="updateSelectedTags">
                <option value="" disabled>Select tag</option>
                <option v-for="tag in tags" :key="tag._id" :value="tag._id">{{ tag.tagName }}</option>
            </select>
        </div>

        <div>
            <div v-for="(tag, index) in contact.tags" :key="index" class="selected-tag">
                <span>{{ tag.tagName }}</span>
                <button type="button" @click="removeTag(index)">x</button>
            </div>
        </div>

        <div class="button-container">
            <button type="submit" class="add-contact-button">{{ initialContact ? 'Save Changes' : 'Add Contact' }}</button>
            <button type="button" @click="closeForm" class="close-button">Cancel</button>
        </div>
    </form>
</div>
</template>

<script>
import {
    Meteor
} from 'meteor/meteor';
import {
    TagsCollection
} from '../../db/TagsCollection';

export default {
    props: ['initialContact'],
    data() {
        return {
            contact: {
                name: '',
                email: '',
                phone: '',
                tags: [],
            },
            tags: [],
            selectedTags: [], // Array to store selected tag IDs
        };
    },
    mounted() {
        Meteor.subscribe('tags', () => {
            this.tags = TagsCollection.find().fetch();
        });

        // If initialContact is provided, set the initial values including selected tags
        if (this.initialContact) {
            this.contact = {
                ...this.initialContact
            };
            // Preselect the tags associated with the contact
            this.selectedTags = this.contact.tags.map(tag => tag._id);
        }
    },
    methods: {
        submitContact() {
            const newContact = {
                name: this.contact.name.trim(),
                email: this.contact.email.trim(),
                phone: this.contact.phone.trim(),
                tags: this.contact.tags,
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
                tags: [],
            };
        },
        closeForm() {
            // Clear the form fields and close the form
            this.contact = {
                name: '',
                email: '',
                phone: '',
                tags: [],
            };
            this.$emit('closeForm');
        },
        updateSelectedTags() {
            const selectedTags = this.selectedTags.map(tagId => this.tags.find(tag => tag._id === tagId));
            // Compare the selected tags with the current contact tags to determine which tags were added or removed
            const addedTags = selectedTags.filter(tag => !this.contact.tags.includes(tag));
            const removedTags = this.contact.tags.filter(tag => !selectedTags.includes(tag));
            this.contact.tags.push(...addedTags);
        },

        removeTag(index) {
            this.contact.tags.splice(index, 1);
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

.tag-select-container {
  position: relative;
}

select {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.selected-tag {
  display: inline-block;
  background-color: #f0f0f0;
  padding: 3px 8px;
  border-radius: 4px;
  margin-right: 5px;
}

.selected-tag span {
  margin-right: 5px;
}

.selected-tag button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #777;
}

.selected-tag button:hover {
  color: #333;
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

.close-button {
  background-color: #e74c3c;
  color: white;
  font-size: 16px;
}

.close-button:hover {
  background-color: #c0392b;
}
</style>