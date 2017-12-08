import { Template } from 'meteor/templating';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Events } from '/imports/api/event/EventCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.Public_Profile_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.context = Profiles.getSchema().namedContext('Public_Profile_Page');
  console.log(Profiles.findDoc(FlowRouter.getParam('_id')));
});

Template.Public_Profile_Page.helpers({
  profile() {
    //console.log(Profiles.findDoc(FlowRouter.getParam('_id')));
    return Profiles.findDoc(FlowRouter.getParam('_id'));
  },
  user() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  numFriends(profile) {
    if (profile.friends) {
      return profile.friends.length;
    }
    return 0;
  },
  eventName(id) {
    const event = Events.findDoc(id);
    return event.name;
  },
  transportationIsBus(profile) {
    if (profile.transportation == "Bus") {
      return true;
    }
    return false;
  },
  transportationIsCar(profile) {
    if (profile.transportation == "Car") {
      return true;
    }
    return false;
  },
  transportationIsNone(profile) {
    if (profile.transportation == "None") {
      return true;
    }
    return false;
  }
});