import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Profiles } from '/imports/api/profile/ProfileCollection';

Template.User_Header.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
});

Template.User_Header.helpers({
  routeUserName() {
    return FlowRouter.getParam('username');
  },
  routeId() {
    return Profiles.findDoc(FlowRouter.getParam('username'))._id;
  },
});
