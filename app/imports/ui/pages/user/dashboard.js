import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Events } from '/imports/api/event/EventCollection';

Template.Dashboard_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Events.getPublicationName());
});

Template.Dashboard_Page.helpers({
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  events(profile) {
    return _.filter(Events.findAll(), event => _.contains(profile.events, event._id));
  },
  routeUserName() {
    return FlowRouter.getParam('username');
  },
  getFriendPicture(username) {
    return Profiles.findDoc(username).picture;
  },
  getFriendFirstName(username) {
    return Profiles.findDoc(username).firstName;
  },
  getFriendLastName(username) {
    return Profiles.findDoc(username).lastName;
  },
  getFriendId(username) {
    return Profiles.findDoc(username)._id;
  },
});
