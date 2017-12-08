import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '../../../api/profile/ProfileCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Events } from '../../../api/event/EventCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';
const picture = 'picture';

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
  eventsList() {
    return Events.find();
  },
  event() {
    //console.log(Events.findDoc(FlowRouter.getParam('username')));
    return Events.findDoc(FlowRouter.getParam('_id'));
  },
  picture() {
    return Template.instance().messageFlags.get(picture);
  },
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  interests() {
    const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    const selectedInterests = profile.interests;
    return profile && _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return { label: interest.name, selected: _.contains(selectedInterests, interest.name) };
        });
  },
  fieldError(fieldName) {
    const invalidKeys = Template.instance().context.invalidKeys();
    const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
    return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
  },
});

Template.Create_Event_Page.events({
  'change .picture'(event, instance) {
    instance.messageFlags.set(picture, event.target.value);
  },
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
    const picture = event.target.picture.value;
    const createdEvent = { name, date, time, location, cost, transportation, description, interests, picture, username };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const eventData = Events.getSchema().clean(createdEvent);


    // Determine validity.
    instance.context.validate(eventData);

    if (instance.context.isValid()) {
      const docID = Events.define(eventData);
      instance.messageFlags.set(displaySuccessMessage, true);
      instance.messageFlags.set(displayErrorMessages, true);
      const id = FlowRouter.getParam('username');
      //console.log(docID, id);

      var params = {username: id, _id: docID};
      const path = FlowRouter.path("Event_Page", params);
      FlowRouter.go(path);

    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

