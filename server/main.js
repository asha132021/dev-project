import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { ContactsCollection } from '../imports/db/ContactsCollection';
import '../imports/api/methods/contactsmethod';
import {TagsCollection} from '../imports/db/TagsCollection';
import '../imports/api/methods/tagsmethod';
import {OrganizationsCollection} from '../imports/db/OrganizationsCollection.js';
import '../imports/api/methods/organizationsmethod';


Meteor.publish('contacts', function () {
    return ContactsCollection.find({});
});

Meteor.publish('tags', function () {
    return TagsCollection.find({}); 
 });
 

Meteor.publish('organizations', function () {
   return OrganizationsCollection.find({}); 
});