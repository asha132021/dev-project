import { Meteor } from 'meteor/meteor';
import { OrganizationsCollection } from '../../db/OrganizationsCollection';

Meteor.methods({
  'organizations.insert'(newOrganization) {
    console.log('Inserting organization:', newOrganization);
    OrganizationsCollection.insert({
      ...newOrganization,
      createdAt: new Date(),
    });
  },
  'organizations.update'(organizationId, updatedOrganization) {
    OrganizationsCollection.update({ _id: organizationId }, { $set: updatedOrganization });
  },
  'organizations.delete'(organizationId) {
    OrganizationsCollection.remove({ _id: organizationId });
  },
  'organizations.logIn'({ email, password }) {
    const organization = OrganizationsCollection.findOne({ email });
  
    if (organization && organization.password === password) {
      return { success: true, organizationId: organization._id };
    } else {
      return { success: false, message: 'Incorrect email or password. Please try again.' };
    }
  },
});

