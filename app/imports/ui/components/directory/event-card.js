import { Template } from 'meteor/templating';

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
    hours = (hours + 11) % 12 + 1;
    if (minutes === ':00') {
      minutes = '';
    }
    return hours + minutes + suffix;
  },
  peopleGoing(event) {
    if (event.peopleGoing) {
      return event.peopleGoing.length;
    }
    return 0;
  },
});