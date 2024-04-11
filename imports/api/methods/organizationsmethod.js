import { Meteor } from 'meteor/meteor';
import { OrganizationsCollection } from '../../db/OrganizationsCollection';
import { check } from 'meteor/check';

Meteor.methods({
  'organizations.insert'(newOrganization) {
    console.log('Inserting organization:', newOrganization);
    const orgId = OrganizationsCollection.insert({
      ...newOrganization,
      createdAt: new Date(),
    });
    return orgId;
  },
  'organizations.update'(organizationId, updatedOrganization) {
    OrganizationsCollection.update({ _id: organizationId }, { $set: updatedOrganization });
  },
  'organizations.delete'(organizationId) {
    OrganizationsCollection.remove({ _id: organizationId });
  },
  'organizations.deleteWithUsers'(organizationId) {
    try {
      Meteor.call('users.deleteAssociatedWithOrg', organizationId); // Delete associated users first
      OrganizationsCollection.remove({ _id: organizationId }); // Then delete the organization
    } catch (error) {
      throw new Meteor.Error('delete-organization-failed', 'Failed to delete organization and associated users.');
    }
  },
  'getOrganizationNameById'(orgId) {
    const organization = OrganizationsCollection.findOne(orgId);
    if (organization) {
      return organization.organizationName;
    } else {
      throw new Meteor.Error('organization-not-found', 'Organization not found');
    }
  },
});




