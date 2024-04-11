import { Meteor } from 'meteor/meteor';
import { ContactsCollection } from '../imports/db/ContactsCollection';
import { TagsCollection } from '../imports/db/TagsCollection';
import { OrganizationsCollection } from '../imports/db/OrganizationsCollection';
import '../imports/api/methods/contactsmethod';
import '../imports/api/methods/tagsmethod';
import '../imports/api/methods/organizationsmethod';
import '../imports/api/methods/usersmethod.js';
import '../imports/api/methods/rolesmethod.js'
import { check } from 'meteor/check';


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


Meteor.publish('users', function () {
    if (this.userId) {
        const user = Meteor.users.findOne(this.userId);
        const orgId = user.profile.orgId; 
        return Meteor.users.find({ 'profile.orgId': orgId });
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
Meteor.methods({
    'findUserWithRole'(orgId, role) {
        // Check if the user making the request is logged in
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'User is not authorized to perform this action');
        }

        // Find a user with the specified role and organization ID
        const user = Meteor.users.findOne({
            'profile.orgId': orgId,
            'profile.orgRole': role
        });

        console.log("User:", user); // Log the user object

        if (user) {
            // Extract and return the email and password fields from the user object
            const email = user.emails[0].address;
            const password = user.services.password.bcrypt; 

            console.log("Email:", email);
            console.log("Password:", password); 

            return { email, password };
        } else {
            console.log("No user found with role:", role, "and organization ID:", orgId); // Log if no user is found
            return null;
        }
    }
});




