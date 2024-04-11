import { Meteor } from 'meteor/meteor';
import { TagsCollection } from '/imports/db/TagsCollection';
import { ContactsCollection } from '/imports/db/ContactsCollection';

Meteor.methods({
  'Tags.insert'(newTag) {
    TagsCollection.insert({
      ...newTag,
      createdAt: new Date(),
    });
  },

  'Tags.delete'(tagId) {
    TagsCollection.remove({ _id: tagId });
        // Fetch all contacts that have the deleted tag
        const contactsWithDeletedTag = ContactsCollection.find({ tags: { $elemMatch: { _id: tagId } } }).fetch();

        // Remove the tag from each contact's tag list
        contactsWithDeletedTag.forEach(contact => {
          const updatedTags = contact.tags.filter(tag => tag._id !== tagId);
          ContactsCollection.update({ _id: contact._id }, { $set: { tags: updatedTags } });
        });
  },

  'Tags.update'(tagId, updatedTag) {
    const { tagName } = updatedTag; // Extract tagName from updatedTag
    TagsCollection.update({ _id: tagId }, { $set: updatedTag });
    ContactsCollection.update({ 'tags._id': tagId }, { $set: { 'tags.$.tagName': tagName } }, { multi: true });
  },

});
