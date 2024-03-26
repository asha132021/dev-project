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

  // Method to assign a role to a user
  'roles.assignRole'(userId, roleName) {
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

  // Method to check if a user is a Keela Admin
  'roles.checkKeelaAdminRole'() {
    return Roles.userIsInRole(this.userId, 'Keela Admin');
  },

  // Method to check if a user is an Admin
  'roles.checkAdminRole'() {
    return Roles.userIsInRole(this.userId, 'Admin');
  },

  // Method to check if a user is a Coordinator
  'roles.checkCoordinatorRole'() {
    return Roles.userIsInRole(this.userId, 'Coordinator');
  },

  // Method to check if a user has permission to create an organization
  'roles.hasPermissionToCreateOrg'() {
    return Roles.userIsInRole(this.userId, ['Keela Admin']);
  },

  // Method to check if a user has permission to add a user to an organization
  'roles.hasPermissionToAddUser'(orgId) {
    const userRoles = Roles.getRolesForUser(this.userId, orgId);
    return userRoles.includes('Keela Admin') || userRoles.includes('Admin');
  },

  // Method to check if a user has permission to view/insert/update/remove users in an organization
  'roles.hasPermissionToManageUsers'(orgId) {
    const userRoles = Roles.getRolesForUser(this.userId, orgId);
    return userRoles.includes('Keela Admin') || userRoles.includes('Admin');
  },

  // Method to check if a user has permission to view/insert/update/remove contacts in an organization
  'roles.hasPermissionToManageContacts'(orgId) {
    const userRoles = Roles.getRolesForUser(this.userId, orgId);
    return userRoles.includes('Keela Admin') || userRoles.includes('Admin');
  },

  // Method to check if a user has permission to view/insert/update/remove tags in an organization
  'roles.hasPermissionToManageTags'(orgId) {
    const userRoles = Roles.getRolesForUser(this.userId, orgId);
    return userRoles.includes('Keela Admin') || userRoles.includes('Admin') || userRoles.includes('Coordinator');
  },

  // Method to check if a user has permission to view contacts in an organization
  'roles.hasPermissionToViewContacts'(orgId) {
    const userRoles = Roles.getRolesForUser(this.userId, orgId);
    return userRoles.includes('Keela Admin') || userRoles.includes('Admin') || userRoles.includes('Coordinator');
  },
});

