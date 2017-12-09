import { Template } from 'meteor/templating';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Events } from '/imports/api/event/EventCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.Public_Profile_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Events.getPublicationName());
});

Template.Public_Profile_Page.helpers({
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('_id'));
  },
  hasInfo(profile) {
    return profile.age || profile.location || profile.transportation;
  },
  transportationIsBus(profile) {
    if (profile.transportation === "Bus") {
      return true;
    }
    return false;
  },
  transportationIsCar(profile) {
    if (profile.transportation === "Car") {
      return true;
    }
    return false;
  },
  transportationIsNone(profile) {
    if (profile.transportation === "None") {
      return true;
    }
    return false;
  },
  eventName(id) {
    const event = Events.findDoc(id);
    return event.name;
  }
});