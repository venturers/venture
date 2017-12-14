import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';

const displayErrorMessages = 'displayErrorMessages';
const transportationOptions = ['None', 'Car', 'Bus'];

Template.Profile_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Profiles.getSchema().namedContext('Profile_Page');
});

Template.Profile_Page.helpers({
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  interests() {
    const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    const selectedInterests = profile.interests;
    return profile && _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return { label: interest.name, selected: _.contains(selectedInterests, interest.name) };
        });
  },
  transportation() {
    const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    const selectedTransportation = profile.transportation;
    return profile && _.map(transportationOptions,
        function makeTransportationObject(transportation) {
          return { label: transportation, selected: selectedTransportation === transportation };
        });
  },
});


Template.Profile_Page.events({
  'submit .profile-data-form'(event, instance) {
    event.preventDefault();
    const firstName = event.target['First Name'].value;
    const lastName = event.target['Last Name'].value;
    const age = event.target.Age.value;
    const location = event.target.Location.value;
    const transportation = event.target['Transportation You Can Provide'].value;
    const username = FlowRouter.getParam('username'); // schema requires username.
    const picture = event.target['Profile Picture'].value;
    const snapchat = event.target.Snapchat.value;
    const facebook = event.target.Facebook.value;
    const instagram = event.target.Instagram.value;
    const bio = event.target.Bio.value;
    const selectedInterests = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    const interests = _.map(selectedInterests, (option) => option.value);

    const updatedProfileData = { firstName, lastName, age, location, transportation, picture, snapchat, facebook,
      instagram, bio, interests, username };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Profiles.getSchema().clean(updatedProfileData, { removeEmptyStrings: false });
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
      Profiles.update(docID, { $set: cleanData });
      instance.messageFlags.set(displayErrorMessages, false);
      const usernameVar = FlowRouter.getParam('username');
      FlowRouter.go('Public_Profile_Page', { username: usernameVar, _id: docID });
    } else {
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});
