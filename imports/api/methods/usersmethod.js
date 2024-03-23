import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
    'users.add'(user) {
        console.log('Inserting user:', user);
        try {
            const userId = Accounts.createUser(user);
        } catch (error) {
            console.error(error.reason);
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