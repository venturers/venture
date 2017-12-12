import { Profiles } from '/imports/api/profile/ProfileCollection';

Template.Comment.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
});

Template.Comment.helpers({
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
    return comment.date.toLocaleDateString() + ' at ' + comment.date.toLocaleTimeString();
  }
});