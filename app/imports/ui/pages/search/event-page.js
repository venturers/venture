import { Template } from 'meteor/templating';
import { Events } from '/imports/api/event/EventCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';

Template.Event_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
});

Template.Event_Page.helpers({
  event() {
    return Events.findDoc(FlowRouter.getParam('username'));
  },
  user() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  getCoordinatorPicture(event) {
    return event.coordinator.picture;
  },
  getParticipantNames(event){
    let user = this.user();
    if (event.peopleGoing.length > 0) {
      return _.each(event.peopleGoing, function(person) {
        if (! user.friends.contains(person)) {
          return person.firstName + " " + person.lastName; }})
    }
    return ["No event attendees yet."];
  },
  getFriendParticipantNames(event){
    let user = this.user();
    if (event.peopleGoing.length > 0) {
      return _.each(event.peopleGoing, function(person) {
        if (user.friends.contains(person)) {
          return person.firstName + " " + person.lastName;
        }
      })
    }
    return ["No friends attending."];
  }

    }
);