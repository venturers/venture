import { Profiles } from '/imports/api/profile/ProfileCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';


Template.Comment.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
});

Template.Comment.helpers({
  routeUserName() {
    return FlowRouter.getParam('username');
  },
  routeId(comment) {
    return Profiles.findDoc(comment.username)._id;
  },
  picture(comment) {
    return Profiles.findDoc(comment.username).picture;
  },
  firstName(comment) {
    return Profiles.findDoc(comment.username).firstName;
  },
  lastName(comment) {
    return Profiles.findDoc(comment.username).lastName;
  },
  date(comment) {
    return `${comment.date.toLocaleDateString()} at ${comment.date.toLocaleTimeString()}`;
  },
});
