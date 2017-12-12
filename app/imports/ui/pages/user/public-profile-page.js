import { Template } from 'meteor/templating';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Events } from '/imports/api/event/EventCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.Public_Profile_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.context = Profiles.getSchema().namedContext('Public_Profile_Page');
});

Template.Public_Profile_Page.helpers({
  routeUserName() {
    return FlowRouter.getParam('username');
  },
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('_id'));
  },
  myProfile() {
    if (FlowRouter.getParam('username') === Profiles.findDoc(FlowRouter.getParam('_id')).username) {
      return true;
    }
    return false;
  },
  friendsWith(profile) {
    return _.contains(profile.friends, FlowRouter.getParam('username'));
  },
  hasInfo(profile) {
    return profile.age || profile.location || profile.transportation;
  },
  transportationIsBus(profile) {
    if (profile.transportation === "Bus") {
      return true;
    }
    return false;
  },
  transportationIsCar(profile) {
    if (profile.transportation === "Car") {
      return true;
    }
    return false;
  },
  transportationIsNone(profile) {
    if (profile.transportation === "None") {
      return true;
    }
    return false;
  },
  eventName(id) {
    const event = Events.findDoc(id);
    return event.name;
  }
});

Template.Public_Profile_Page.events({
  'click .edit-profile'() {
    const username = FlowRouter.getParam('username');
    FlowRouter.go('Profile_Page', {username});
  },
  'click .add-friend'(event, instance) {
    const myUsername = FlowRouter.getParam('username');
    const myID = Profiles.findDoc(myUsername)._id;
    const friendUsername = Profiles.findDoc(FlowRouter.getParam('_id')).username;
    const friendID = FlowRouter.getParam('_id');
    Profiles.update(myID, { $push: { friends: friendUsername } });
    Profiles.update(friendID, { $push: { friends: myUsername } });
  },
  'click .unfriend'(event, instance) {
    const myUsername = FlowRouter.getParam('username');
    const myID = Profiles.findDoc(myUsername)._id;
    const friendUsername = Profiles.findDoc(FlowRouter.getParam('_id')).username;
    const friendID = FlowRouter.getParam('_id');
    Profiles.update(myID, { $pull: { friends: friendUsername } });
    Profiles.update(friendID, { $pull: { friends: myUsername } });
  },
  'submit .ui.reply.form'(event, instance) {
    event.preventDefault();
    const username = FlowRouter.getParam('username');
    const date = new Date();
    const text = event.target.Text.value;

    const comment = { username, date, text };

    if (text.trim() !== '') {
      const docID = FlowRouter.getParam('_id');
      Profiles.update(docID, { $push: { comments: comment } });
      event.target.Text.value = '';
    }
  }
});