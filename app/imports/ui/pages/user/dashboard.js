import { Template } from 'meteor/templating';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Events } from '/imports/api/event/EventCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.Dashboard_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Events.getPublicationName());
});

Template.Dashboard_Page.helpers({
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  getFriendFirstName(username) {
    const friend = Profiles.findDoc(username);
    return friend.firstName;
  },
  getFriendLastName(username) {
    const friend = Profiles.findDoc(username);
    return friend.lastName;
  },
  getFriendPicture(username) {
    const friend = Profiles.findDoc(username);
    return friend.picture;
  },
  routeUserName() {
    return FlowRouter.getParam('username');
  },
  events(profile) {
    return _.filter(Events.findAll(), event => _.contains(profile.events, event._id));
  },
  getFriendID(username) {
    return Profiles.findDoc(username)._id;
  }
})
;