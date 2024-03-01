import { Meteor } from 'meteor/meteor';
import { ContactsCollection } from '../../db/ContactsCollection';

Meteor.methods({
  'Contacts.insert'(newContact) {
    ContactsCollection.insert({
      ...newContact,
      createdAt: new Date(),
    });
  },
  'Contacts.delete'(contactId) {
    ContactsCollection.remove({ _id: contactId });
  },
  'Contacts.update'(contactId, updatedContact) {
    ContactsCollection.update({ _id: contactId }, { $set: updatedContact });
  }
});