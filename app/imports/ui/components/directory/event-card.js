import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Events } from '/imports/api/event/EventCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

Template.Event_Card.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Events.getPublicationName());
});

Template.Event_Card.helpers({
  routeUserName() {
    return FlowRouter.getParam('username');
  },
  hasDateAndTime(event) {
    return event.date && event.time;
  },
  time(event) {
    let hours = Number(event.time.slice(0, event.time.indexOf(':')));
    let minutes = event.time.slice(event.time.indexOf(':'));
    const suffix = (hours >= 12) ? 'PM' : 'AM';
    hours = ((hours + 11) % 12) + 1;
    if (minutes === ':00') {
      minutes = '';
    }
    return hours + minutes + suffix;
  },
  peopleGoing(event) {
    return event.peopleGoing.length;
  },
  attending(event) {
    return _.contains(event.peopleGoing, FlowRouter.getParam('username'));
  },
});

Template.Event_Card.events({
  'click .add-event'(event, instance) {
    const myUsername = FlowRouter.getParam('username');
    const myID = Profiles.findDoc(myUsername)._id;
    const eventID = instance.data.event._id;
    Profiles.update(myID, { $push: { events: eventID } });
    Events.update(eventID, { $push: { peopleGoing: myUsername } });
  },
  'click .remove-event'(event, instance) {
    const myUsername = FlowRouter.getParam('username');
    const myID = Profiles.findDoc(myUsername)._id;
    const eventID = instance.data.event._id;
    Profiles.update(myID, { $pull: { events: eventID } });
    Events.update(eventID, { $pull: { peopleGoing: myUsername } });
  },
});
