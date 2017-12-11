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
  event() {
    return Events.findDoc(FlowRouter.getParam('_id'));
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
  getCoordinatorName(event) {
    const coordinator = Profiles.findDoc(event.username);
    return coordinator.firstName + " " + coordinator.lastName;
  },
  getFriendParticipants(event){
    let user = user();
    if (event.peopleGoing.length > 0) {
      return _.each(event.peopleGoing, function(person) {
        if (user.friends.contains(person)) {
          return person.firstName + " " + person.lastName;
        }
      })
    }
  },
  getFriendPicture(username) {
    const friend = Profiles.findDoc(username);
    return friend.picture;
  },
  getFriendName(username) {
    const friend = Profiles.findDoc(username);
    return friend.firstName + " " + friend.lastName;
  }
});

Template.Event_Page.events({
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