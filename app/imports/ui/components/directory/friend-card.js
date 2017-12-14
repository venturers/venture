import { Profiles } from '/imports/api/profile/ProfileCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

Template.Friend_Card.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
});

Template.Friend_Card.helpers({
  routeUserName() {
    return FlowRouter.getParam('username');
  },
  numFriends(profile) {
    return profile.friends.length;
  },
  friendsWith(profile) {
    return _.contains(profile.friends, FlowRouter.getParam('username'));
  },
  notMyProfile(profile) {
    return FlowRouter.getParam('username') !== profile.username;
  },
});

Template.Friend_Card.events({
  'click .add-friend'(event, instance) {
    const myUsername = FlowRouter.getParam('username');
    const myID = Profiles.findDoc(myUsername)._id;
    const friendUsername = instance.data.profile.username;
    const friendID = instance.data.profile._id;
    Profiles.update(myID, { $push: { friends: friendUsername } });
    Profiles.update(friendID, { $push: { friends: myUsername } });
  },
  'click .unfriend'(event, instance) {
    const myUsername = FlowRouter.getParam('username');
    const myID = Profiles.findDoc(myUsername)._id;
    const friendUsername = instance.data.profile.username;
    const friendID = instance.data.profile._id;
    Profiles.update(myID, { $pull: { friends: friendUsername } });
    Profiles.update(friendID, { $pull: { friends: myUsername } });
  },
});
