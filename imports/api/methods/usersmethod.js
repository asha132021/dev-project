import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
    'users.add'(user) {
        console.log('Inserting user:', user);
        try {
            const existingUser = Meteor.users.findOne({ 'emails.address': user.email });
            if (existingUser) {
                throw new Meteor.Error('email-already-exists', 'Email already exists.');
            }
            
            const userId = Accounts.createUser(user);
            return userId;
        } catch (error) {
            if (error.error === 'email-already-exists') {
                throw error; // Re-throw the email already exists error
            } else {
                console.error(error.reason);
                throw new Meteor.Error('user-creation-failed', 'Failed to create user.');
            }
        }
    },
    'users.edit'(userId, updatedUser) {
        if (this.userId) {
            Meteor.users.update({_id: userId}, {$set: updatedUser});
        } else {
            throw new Meteor.Error('not-authorized', 'You are not authorized to edit this user info');
        }
    },
    'users.delete'(userId) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You are not authorized to delete this user.');
        }
        Meteor.users.remove(userId);
    },
    'users.insertOrgId'(userId, orgId) {
        if (!this.userId) {
          throw new Meteor.Error('not-authorized', 'You are not authorized to add an organization ID.');
        }
        Meteor.users.update(userId, {
          $set: { 'profile.orgId': orgId },
        });
    },
});