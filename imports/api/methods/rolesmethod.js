// Import necessary packages
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

// Initialize roles at startup if they don't exist
Meteor.startup(() => {
  if (Roles.getAllRoles().length === 0) {
    Roles.createRole('Keela Admin');
    Roles.createRole('Admin');
    Roles.createRole('Coordinator');
  }
});

// Define Meteor methods for role-related operations
Meteor.methods({
  // Method to fetch all roles
  'roles.getRoles'() {
    return Roles.getAllRoles().fetch();
  },

  // Method to check if a user is a Keela Admin
  'checkKeelaAdminRole'() {
    return Roles.userIsInRole(this.userId, 'Keela Admin');
  },

  // Method to check if a user is an Admin
  'checkAdminRole'() {
    return Roles.userIsInRole(this.userId, 'Admin');
  },

  // Method to check if a user is a Coordinator
  'checkCoordinatorRole'() {
    return Roles.userIsInRole(this.userId, 'Coordinator');
  },

  // Method to assign a role to a user
  'assignRole'(userId, roleName) {
    // Check if the user already has a role
    const userRoles = Roles.getRolesForUser(userId);
    if (userRoles && userRoles.length > 0) {
      throw new Meteor.Error('user-already-has-role', 'User already has a role assigned.');
    }

    // Assign the specified role to the user
    if (userId && roleName) {
      Roles.addUsersToRoles(userId, roleName);
    }
  },
});
