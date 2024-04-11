import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

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
        const existingUser = Meteor.users.findOne(userId);
        if (!existingUser) {
            throw new Meteor.Error('user-not-found', 'User not found.');
        }

        const existingEmail = existingUser.emails[0].address;
        const newEmail = updatedUser.email || existingEmail; // Use existing email if not provided
        const newPassword = updatedUser.password || ""; // Use existing password if not provided

        // Ensure profile is updated
        const updatedProfile = updatedUser.profile || {};
        const newProfile = {
            ...existingUser.profile,
            ...updatedProfile
        };

        try {
            // Update user data
            Meteor.users.update(userId, {
                $set: {
                    'emails.0.address': newEmail, // Update email
                    'profile': newProfile, // Update profile
                }
            });

            // Update password if provided
            if (newPassword) {
                Accounts.setPassword(userId, newPassword);
            }
        } catch (error) {
            console.error(error);
            throw new Meteor.Error('user-update-failed', 'Failed to update user.');
        }
    },
    'users.delete'(userId) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You are not authorized to delete this user.');
        }
        Meteor.users.remove(userId);
    },
    'users.deleteAssociatedWithOrg'(orgId) {
        try {
          Meteor.users.remove({ 'profile.orgId': orgId });
        } catch (error) {
          console.error('Error deleting associated users:', error);
          throw new Meteor.Error('delete-users-failed', 'Failed to delete associated users.');
        }
      },
    'users.insertOrgId'(userId, orgId) {
        if (!this.userId) {
          throw new Meteor.Error('not-authorized', 'You are not authorized to add an organization ID.');
        }
        Meteor.users.update(userId, {
          $set: { 'profile.orgId': orgId },
        });
    },
        'authenticateWithBcrypt'(email, password) {
          check(email, String);
          check(password, String);
      
          // Find the user by email
          const user = Meteor.users.findOne({ 'emails.address': email });
      
          if (!user) {
            throw new Meteor.Error('user-not-found', 'User not found');
          }
      
          // Check if the password matches the bcrypt hashed password
          if (Accounts._checkPassword(user, password)) {
            // Passwords match, return the user ID
            return user._id;
          } else {
            // Passwords do not match
            throw new Meteor.Error('incorrect-password', 'Incorrect password');
          }
        },
      

});