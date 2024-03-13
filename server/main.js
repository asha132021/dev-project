import { Meteor } from 'meteor/meteor';
import { ContactsCollection } from '../imports/db/ContactsCollection';
import '../imports/api/methods/contactsmethod';
import {TagsCollection} from '../imports/db/TagsCollection';
import '../imports/api/methods/tagsmethod';
import {OrganizationsCollection} from '../imports/db/OrganizationsCollection.js';
import '../imports/api/methods/organizationsmethod';

Meteor.publish('organizations', function () {
    return OrganizationsCollection.find({}); 
 });

 Meteor.publish('contacts', function (orgId) {
  return ContactsCollection.find({ orgId });
});
  
  Meteor.publish('tags', function (orgId) {
    return TagsCollection.find({ orgId });
  });
 