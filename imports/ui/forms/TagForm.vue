<template>
<div class="tag-form-container">
    <form @submit.prevent="addTag" class="tag-form">
        <h1>{{ initialtags ? 'Edit Tag Name' : 'Add Tags' }}</h1>
        <label for="tag">Tag Name</label>
        <input v-model="tagName" id="tag" type="text" required />

        <div class="button-container">
            <button type="submit" class="save-tag-button">Save</button>
            <button type="button" @click="closeForm" class="cancel-button">Cancel</button>
        </div>
    </form>
</div>
</template>

<script>
export default {
    props: ['initialtags'],
    name: 'Tagform',
    data() {
        return {
            tagName: '',
            tags: [],
        };
    },
    mounted() {
        // if edited provide the initial info
        if (this.initialtags) {
            this.tagName = this.initialtags.tagName;
        }
    },
    methods: {
        addTag() {
            const newTag = {
                tagName: this.tagName.trim(),
            };

            if (this.initialtags) {
                // Update existing tag
                Meteor.call('Tags.update', this.initialtags._id, newTag, (error) => {
                    if (error) {
                        alert('Error updating tag: ' + error.message);
                    }
                });
            } else {
                // Add new tag
                Meteor.call('Tags.insert', newTag, (error) => {
                    if (error) {
                        alert('Error adding tag: ' + error.message);
                    }
                });
            }

            // Clear the form field after submission
            this.closeForm();
            this.tagName = '';
        },

        closeForm() {
            // Clear the form field and close the form
            this.tagName = '';
            this.$emit('closeForm');
        },
    },
};
</script>

<style scoped>
.tag-form-container {
    width: 500px;
    max-width: 100%;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
    color: rgb(0, 0, 0);
    font-weight: bold;
    font-size: 20px;
    margin-right: 300px;
}

.tag-form {
    display: grid;
    gap: 15px;
}

label {
    font-weight: bold;
    color: #2d2c2c;

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

.save-tag-button {
    background-color: #3498db;
    color: white;
    font-size: 16px;
}

.save-tag-button:hover {
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
</style>
