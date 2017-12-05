import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '../../../api/profile/ProfileCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Events } from '../../../api/event/EventCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';


Template.Create_Event_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Events.getSchema().namedContext('Create_Event_Page');
});

Template.Create_Event_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
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
});


Template.Create_Event_Page.events({
  'submit .create-event-form'(event, instance) {
    event.preventDefault();
    const username = FlowRouter.getParam('username'); // schema requires username.
    const name = event.target.name.value;
    const date = event.target.date.value;
    const time = event.target.time.value;
    const location = event.target.location.value;
    const cost = event.target.cost.value;
    const transportation = event.target.transportation.value;
    const description = event.target.description.value;
    const selectedInterests = _.filter(event.target.interests.selectedOptions, (option) => option.selected);
    const interests = _.map(selectedInterests, (option) => option.value);

    const createdEvent = { name, date, time, location, cost, transportation, description, interests, username };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const eventData = Events.getSchema().clean(createdEvent, { removeEmptyStrings: false });


    // Determine validity.
    instance.context.validate(eventData);

    if (instance.context.isValid()) {
      Events.define(eventData);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

