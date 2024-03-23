import { Meteor } from 'meteor/meteor';
import { ContactsCollection } from '../../db/ContactsCollection';

Meteor.methods({
  'Contacts.insert'(newContact) {
    const orgId = newContact.orgId;
    ContactsCollection.insert({
      ...newContact,
      orgId: orgId, 
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


