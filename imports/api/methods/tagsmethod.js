import { Meteor } from 'meteor/meteor';
import { TagsCollection } from '/imports/db/TagsCollection';

Meteor.methods({
  'Tags.insert'(newTag) {
    TagsCollection.insert({
      ...newTag,
      createdAt: new Date(),
    });
  },
  'Tags.delete'(tagId) {
    TagsCollection.remove({ _id: tagId });
  },
  'Tags.update'(tagId, updatedtag) {
    TagsCollection.update({ _id: tagId }, { $set: updatedtag });
  },

});
