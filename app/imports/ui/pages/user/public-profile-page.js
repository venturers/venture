import { Template } from 'meteor/templating';

Template.Public_Profile_Page.helpers({
  numFriends(profile) {
    if (profile.friends) {
      return profile.friends.length;
    }
    return 0;
  },
  eventsToString(profile) {
    if (profile.events) {
      return _.map(profile.events, event => (event.name + " | " + event.date + " " + event.time));
    }
    return ["No events to show."];
  }
});