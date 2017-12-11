import { Template } from 'meteor/templating';
import { Profiles } from '/imports/api/profile/ProfileCollection';

Template.Comment.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
});

Template.Comment.helpers({
  picture(comment) {
    const profile = Profiles.findDoc(comment.username);
    return profile.picture;
  },
  firstName(comment) {
    const profile = Profiles.findDoc(comment.username);
    return profile.firstName;
  },
  lastName(comment) {
    const profile = Profiles.findDoc(comment.username);
    return profile.lastName;
  },
  date(comment) {
    return comment.date.toLocaleDateString() + ' at ' + comment.date.toLocaleTimeString();
  }
});