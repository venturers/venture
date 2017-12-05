import { Template } from 'meteor/templating';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.Public_Profile_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
});

Template.Public_Profile_Page.helpers({
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  numFriends(profile) {
    if (profile.friends) {
      return profile.friends.length;
    }
    return 0;
  },
  eventsToString(profile) {
    if (profile.events) {
      return _.map(profile.events, event => (event.name + " | " + event.date + " " + event.time));
    }
    return ["No events to show."];
  }
});