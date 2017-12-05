import { Template } from 'meteor/templating';
import { Profiles } from '/imports/api/profile/EventCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.Event_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Events.getPublicationName());
});

Template.Event_Page.helpers({
  event() {
    return Events.findDoc(FlowRouter.getParam('username'));
  },
  getCoordinatorPicture(event) {
    return event.coordinator.picture;
  }
});