import { Template } from 'meteor/templating';

Template.Friend_Card.helpers({
  routeUserName() {
    return FlowRouter.getParam('username');
  },
  numFriends(profile) {
    if (profile.friends) {
      return profile.friends.length;
    }
    return 0;
  },
});