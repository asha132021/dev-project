import { Meteor } from 'meteor/meteor';
import { ContactsCollection } from '../imports/db/ContactsCollection';
import '../imports/api/methods/contactsmethod';
import {TagsCollection} from '../imports/db/TagsCollection';
import '../imports/api/methods/tagsmethod';


Meteor.publish('contacts', function () {
    return ContactsCollection.find({});
});

Meteor.publish('tags', function () {
    return TagsCollection.find({}); 
 });
 