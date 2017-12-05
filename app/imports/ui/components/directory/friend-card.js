import { Template } from 'meteor/templating';

Template.Friend_Card.helpers({
  numFriends(profile) {
    if (profile.friends) {
      return profile.friends.length;
    }
    return 0;
  },
});