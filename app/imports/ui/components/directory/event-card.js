import { Template } from 'meteor/templating';

Template.Event_Card.helpers({
  peopleGoing(event) {
    if (event.peopleGoing) {
      return event.peopleGoing.length;
    }
    return 0;
  },
});