import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Events } from '../../../api/event/EventCollection';
import { Profiles } from '../../../api/profile/ProfileCollection';
import { Interests } from '../../../api/interest/InterestCollection';

Template.Event_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.context = Events.getSchema().namedContext('Event_Page');
});

Template.Event_Page.helpers({
  event() {
    //console.log(Events.findDoc(FlowRouter.getParam('username')));
    return Events.findDoc(FlowRouter.getParam('_id'));
  },
  user() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  hasInfo(event) {
    return event.location || event.date || event.time;
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
    }
);