import { Meteor } from 'meteor/meteor';
import { ContactsCollection } from '../imports/db/ContactsCollection';
import { TagsCollection } from '../imports/db/TagsCollection';
import { OrganizationsCollection } from '../imports/db/OrganizationsCollection';
import '../imports/api/methods/contactsmethod';
import '../imports/api/methods/tagsmethod';
import '../imports/api/methods/organizationsmethod';
import '../imports/api/methods/usersmethod.js';


Meteor.publish('contacts', function (){
    if (this.userId) {
        return ContactsCollection.find({'orgId': Meteor.user().profile.orgId});
    } else {
        return this.ready();
    }
});

Meteor.publish('tags', function publishTags() {
    if (this.userId) {
      return TagsCollection.find({ 'orgId': Meteor.user().profile.orgId });
    } else {
      return this.ready();
    }
  });


Meteor.publish('organizations', function () {
    if (this.userId) {
        return OrganizationsCollection.find({});
    } else {
        return this.ready(); 
    }
});


Meteor.publish('organizationById', function (orgId) {
    if (!this.userId) {
        return this.ready(); 
    }

    return OrganizationsCollection.find({ _id: orgId });
});

