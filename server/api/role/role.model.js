'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var RoleSchema = new Schema({
  _user: {type: Schema.Types.ObjectId, ref: 'User'},
  name: String,
  description: String,
  permissions: Schema.Types.Mixed,
  isShare: Boolean,
  settings: Schema.Types.Mixed,
  active: Boolean,
  protected: {type: Boolean, default: false},
  created: {
    type: Date,
    default: Date.now
  }
});

var resources = {
  pages: 'Pages',
  leadList: 'Lead List',
  leadDetails: 'Lead Details',
  contactList: 'Contact List',
  userSettings: 'User Settings'
};

var permissions = {
  pages: {
    dashboard: {title: 'Dashboard', view: true},
//    lead_list: {title: 'Lead List', view: true},
    education: {title: 'Education', view: true},
    motd: {title: 'Message Of The Day', view: true},
    buyers: {title: 'Buyers', view: true},
    blastLog: {title: 'Blast History', view: true},
    comment: {title: 'Add comment/question', view: true},
    settings: {title: 'User Settings', view: true},
    sidebar: {title: 'Sidebar', view: true},
    searchLeads: {title: 'Search Leads', view: true},
    system: {title: 'System', view: true}
  },
  leadList: {
    unclaimedLeads: {title: 'Unclaimed Leads', view: true},
    sellerLeads: {title: 'Seller Leads', view: false},
    mysiteLeads: {title: 'My Site Leads', view: true},
    newLeads: {title: 'New Leads', view: true, update: true, delete: true},
    claimLeads: {title: 'Claim Leads', view: true},
    createLeads: {title: 'Create New Leads', view: true},
    importLeads: {title: 'Import New Leads', view: true},
    othersLeads: {title: ' Other\'s Leads', view: true},
    sharedLeads: {title: ' Shared Leads', view: true},
    craigslistLeads: {title: 'Craiglist Leads', view: true},
    fsboleadsLeads: {title: 'FSBO Leads', view: true}
  },
  leadDetails: {
    generalSellerInfo: {title: 'General: Seller Info', view: true, update: true},
    generalAddressInfo: {title: 'General: Address Info', view: true, update: true},
    generalAdditionalInfo: {title: 'General: Additional Info', view: true, update: true},
    generalAdditionalInfoRestricted: {title: 'General: Additional Info Restricted', view: true},
    generalTotals: {title: 'General: Totals', view: true, update: true},
    generalContacts: {title: 'General: Contacts', view: true, update: true},
    arvCalculator: {title: 'ARV Calculator', view: true},
    repairCosts: {title: 'Repair Costs', view: true, update: true},
    script: {title: 'Script', view: true, update: true},
    publicDocuments: {title: 'Public Documents', view: true, update: true, delete: true},
    privateDocuments: {title: 'Private Documents', view: true, update: true, delete: true},
    marketing: {title: 'Marketing', view: true},
    tasks: {title: 'Tasks', view: true, update: true, delete: true},
    goals: {title: 'Goals', view: true},
    activity: {title: 'Activity', view: true},
    notes: {title: 'Notes', view: true, update: true},
    actionCall: {title: 'Action: Call Seller', view: true},
    actionChangeStatus: {title: 'Action: Change Lead Status', view: true},
    actionSendOffer: {title: 'Action: Generate/Send Offer', view: true},
    actionGenerateContract: {title: 'Action: Generate Contract', view: true},
    actionAssign: {title: 'Action: Reassign Lead', view: true},
    actionReject: {title: 'Action: Reject Lead', view: true},
    actionProfitAnalysis: {title: 'Action: Generate Profit Analysis', view: true},
    actionFundingAnalysis: {title: 'Action: Generate Funding Analysis', view: true},
    actionShare: {title: 'Share Lead to Contact', view: true},
    actionMailbox: {title: 'View lead related mails', view: true},
    actionUploadDocument: {title: 'Upload Document', view: true}
  },
  contactList: {
    cashbuyerContacts: {title: 'Cash Buyers', view: true},
    retailbuyerContacts: {title: 'Retail Buyers', view: true},
    privatelenderContacts: {title: 'Private Lenders', view: true},
    contractorContacts: {title: 'Contractors', view: true},
    realtorContacts: {title: 'Realtors', view: true},
    wholesalerContacts: {title: 'Wholesalers', view: true}
  },
  userSettings: {
    phoneExtension: {title: 'Phone Extension', view: true},
    documentManager: {title: 'Document Manager', view: true, update: true, delete: true},
    frontendReference: {title: 'Frontend Reference', view: true, update: false},
    signICA: {title: 'Sign Independent Contractor Agreement', view: true}
  }
};

var presets = {
  user: {
    pages: {
      dashboard: {view: true},
      education: {view: true},
      motd: {view: true},
      buyers: {view: true},
      blastLog: {view: false},
      comment: {view: true},
      settings: {view: true},
      sidebar: {view: true},
      searchLeads: {view: true},
      system: {view: true}
    },
    leadList: {
      unclaimedLeads: {view: true},
      sellerLeads: {view: false},
      mysiteLeads: {view: true},
      newLeads: {view: true, update: true, delete: true},
      claimLeads: {view: true},
      createLeads: {view: true},
      importLeads: {view: true},
      othersLeads: {view: false},
      sharedLeads: {view: true},
      craigslistLeads: {view: true},
      fsboleadsLeads: {view: true}
    },
    leadDetails: {
      generalSellerInfo: {view: true, update: true},
      generalAddressInfo: {view: true, update: true},
      generalAdditionalInfo: {view: true, update: true},
      generalAdditionalInfoRestricted: {view: false},
      generalTotals: {view: true, update: true},
      generalContacts: {view: true, update: true},
      arvCalculator: {view: true},
      repairCosts: {view: true, update: true},
      script: {view: true, update: true},
      publicDocuments: {view: true, update: true, delete: true},
      privateDocuments: {view: true, update: true, delete: true},
      marketing: {view: true},
      tasks: {view: true, update: true, delete: true},
      goals: {view: true},
      activity: {view: true},
      notes: {view: true, update: true},
      actionCall: {view: true},
      actionChangeStatus: {view: true},
      actionSendOffer: {view: true},
      actionGenerateContract: {view: true},
      actionAssign: {view: false},
      actionReject: {view: true},
      actionProfitAnalysis: {view: true},
      actionFundingAnalysis: {view: true},
      actionShare: {view: true},
      actionMailbox: {view: true},
      actionUploadDocument: {view: true}
    },
    contactList: {
      cashbuyerContacts: {view: true},
      retailbuyerContacts: {view: true},
      privatelenderContacts: {view: true},
      contractorContacts: {view: true},
      realtorContacts: {view: true},
      wholesalerContacts: {view: true}
    },
    userSettings: {
      phoneExtension: {view: false},
      documentManager: {view: true},
      frontendReference: {view: true, update: false},
      signICA: {view: true}
    }
  },
  manager: {},
  admin: {}
};

presets.manager = _.merge({}, presets.user, {
  blastLog: {view: true},
  leadList: {
    othersLeads: {view: true},
    sellerLeads: {view: false}
  },
  leadDetails: {
    marketing: {view: true},
    actionAssign: {view: true}
  },
  userSettings: {
    phoneExtension: {view: true},
    frontendReference: {view: true, update: true}
  }
});

_.each(resources, function(resource, key) {
  _.each(permissions[key], function(permission, permissionKey) {
    _.set(presets.admin, key + '.' + permissionKey, _.pick(permission, ['view', 'update', 'delete']));
  });
});
_.set(presets.admin, 'leadDetails.generalAdditionalInfoRestricted.view', false);
_.set(presets.admin, 'leadDetails.generalAdditionalInfoRestricted.view', false);
_.set(presets.admin, 'leadList.sellerLeads.view', true);

var model = mongoose.model('Role', RoleSchema);

model.presets = presets;
model.resources = resources;
model.permissions = permissions;

module.exports = model;
