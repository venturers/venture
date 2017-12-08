import { Template } from 'meteor/templating';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Events } from '/imports/api/event/EventCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.Dashboard_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Events.getPublicationName());
});

Template.Dashboard_Page.helpers({
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  getFriendName(username) {
    const friend = Profiles.findDoc(username);
    return friend.firstName + " " + friend.lastName;
  },
  getFriendPicture(username) {
    const friend = Profiles.findDoc(username);
    return friend.picture;
  },
  routeUserName() {
    return FlowRouter.getParam('username');
  }
})
;