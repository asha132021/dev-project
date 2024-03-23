<template>
<div class="tag-table-container">
    <!-- Button to toggle TagForm visibility -->
    <button type="button" class="add-button" @click="addTag">Add Tag</button>
    <p class="counter">{{ tags.length }} Tags</p> <!-- Display total tags count -->

    <!-- TagForm Modal Overlay -->
    <div v-if="showTagForm" class="modal-overlay">
        <div class="tag-form-modal">
            <!-- Pass tagData as a prop to TagForm -->
            <TagForm @closeForm="closeForm" :initialtags="tagData" />
        </div>
    </div>

    <table class="tag-table">
        <thead>
            <tr>
                <th>Tag Name</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="tag in tags" :key="tag._id">
                <td>{{ tag.tagName }}</td>
                <td>
                    <button class="actionbutton" @click="deleteTag(tag)">
                        <img class="action-icon" src="/delete.png" alt="Delete" />
                    </button>
                    <button class="actionbutton" @click="editTag(tag)">
                        <img class="action-icon" src="/edit.png" alt="Edit" />
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</template>

  
  
<script>
import TagForm from '../../ui/forms/TagForm.vue';
import { TagsCollection } from '../../db/TagsCollection';
import {Meteor} from 'meteor/meteor';

export default {
    name: "TagTable",
    components: {
        TagForm,
    },
    data() {
        return {
            showTagForm: false,
            tagData: null,
        };
    },
    methods: {
        addTag() {
            // Open TagForm for adding a new tag
            this.showTagForm = !this.showTagForm;
            this.tagData = null;
        },
        toggleTagForm(tag = null) {
            // Toggle the form and set tagData if available
            this.showTagForm = !this.showTagForm;
            this.tagData = tag;
        },
        deleteTag(tag) {
            const confirmDelete = confirm('Are you sure you want to delete this tag?');
            if (confirmDelete) {
                Meteor.call('Tags.delete', tag._id);
            }
        },
        editTag(tag) {
            // Open TagForm in edit mode
            this.toggleTagForm(tag);
        },
        closeForm() {
            // Set showTagForm to false to close the form
            this.showTagForm = false;
            this.tagData = null;
        }
    },
    meteor: {
        $subscribe: {
            'tags': [],
        },
        tags() {
            return TagsCollection.find().fetch();
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
    margin-left: 1290px;
    margin-top: 20px;
}

.tag-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    table-layout: fixed;
}

.tag-table th,
.tag-table td {
    border: 1px solid #ddd;
    padding: 12px 10px;
    word-wrap: break-word;
}

.tag-table th {
    background-color: #f2f2f2;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
}

.tag-table tbody tr {
    border-bottom: 1px solid #dddddd;
    text-align: left;
}

.tag-table tbody tr:nth-of-type(even) {
    background-color: #ffffff;
}

/* Modal Overlay Styles */
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

.tag-form-modal {
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
.counter{
    margin-right: 1270px;
    font-weight: bold;
}
</style>
