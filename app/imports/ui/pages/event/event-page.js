import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Events } from '../../../api/event/EventCollection';
import { Profiles } from '../../../api/profile/ProfileCollection';

Template.Event_Page.onCreated(function onCreated() {
  this.subscribe(Events.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.context = Events.getSchema().namedContext('Event_Page');
});

Template.Event_Page.helpers({
  routeUserName() {
    return FlowRouter.getParam('username');
  },
  routeID(username) {
    return Profiles.findDoc(username)._id;
  },
  event() {
    return Events.findDoc(FlowRouter.getParam('_id'));
  },
  attending(event) {
    return _.contains(event.peopleGoing, FlowRouter.getParam('username'));
  },
  hasInfo(event) {
    return event.location || event.date || event.time;
  },
  time(event) {
    let hours = Number(event.time.slice(0, event.time.indexOf(':')));
    let minutes = event.time.slice(event.time.indexOf(':'));
    const suffix = (hours >= 12) ? 'PM' : 'AM';
    hours = (hours + 11) % 12 + 1;
    if (minutes === ':00') {
      minutes = '';
    }
    return hours + minutes + suffix;
  },
  getCoordinatorPicture(event) {
    const coordinator = Profiles.findDoc(event.username);
    return coordinator.picture;
  },
  getCoordinatorFirstName(event) {
    const coordinator = Profiles.findDoc(event.username);
    return coordinator.firstName;
  },
  getCoordinatorLastName(event) {
    const coordinator = Profiles.findDoc(event.username);
    return coordinator.lastName;
  },
  getFriendParticipants(event){
    return _.filter(event.peopleGoing, person => _.contains(Profiles.findDoc(FlowRouter.getParam('username')).friends, person));
  },
  getOtherParticipants(event){
    return _.filter(event.peopleGoing, person => !_.contains(Profiles.findDoc(FlowRouter.getParam('username')).friends, person));
  },
  getPicture(username) {
    const person = Profiles.findDoc(username);
    return person.picture;
  },
  getFirstName(username) {
    const person = Profiles.findDoc(username);
    return person.firstName;
  },
  getLastName(username) {
    const person = Profiles.findDoc(username);
    return person.lastName;
  }
});

Template.Event_Page.events({
  'click .add-event'(event, instance) {
    const myUsername = FlowRouter.getParam('username');
    const myID = Profiles.findDoc(myUsername)._id;
    const eventID = FlowRouter.getParam('_id');
    Profiles.update(myID, { $push: { events: eventID } });
    Events.update(eventID, { $push: { peopleGoing: myUsername } });
  },
  'click .remove-event'(event, instance) {
    const myUsername = FlowRouter.getParam('username');
    const myID = Profiles.findDoc(myUsername)._id;
    const eventID = FlowRouter.getParam('_id');
    Profiles.update(myID, { $pull: { events: eventID } });
    Events.update(eventID, { $pull: { peopleGoing: myUsername } });
  },
  'submit .ui.reply.form'(event, instance) {
    event.preventDefault();
    const username = FlowRouter.getParam('username');
    const date = new Date();
    const text = event.target.Text.value;

    const comment = { username, date, text };

    if (text.trim() !== '') {
      const docID = FlowRouter.getParam('_id');
      Events.update(docID, { $push: { comments: comment } });
      event.target.Text.value = '';
    }
  }
});