import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Events } from '/imports/api/event/EventCollection';

const displayErrorMessages = 'displayErrorMessages';
const picture = 'picture';

Template.Edit_Event_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.context = Events.getSchema().namedContext('Edit_Event_Page');
});

Template.Edit_Event_Page.helpers({
  event() {
    return Events.findDoc(FlowRouter.getParam('_id'));
  },
  picture() {
    const eventPicture = Events.findDoc(FlowRouter.getParam('_id')).picture;
    if (!Template.instance().messageFlags.get(picture) && Template.instance().messageFlags.get(picture) !== '' && eventPicture) {
      Template.instance().messageFlags.set(picture, eventPicture);
    }
    return Template.instance().messageFlags.get(picture);
  },
  contactDataField(fieldName) {
    const eventData = Events.findOne(FlowRouter.getParam('_id'));
    return eventData && eventData[fieldName];
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  interests() {
    const event = Events.findDoc(FlowRouter.getParam('_id'));
    const selectedInterests = event.interests;
    return event && _.map(Interests.findAll(),
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

Template.Edit_Event_Page.events({
  'change .picture'(event, instance) {
    instance.messageFlags.set(picture, event.target.value);
  },
  'submit .edit-event-form'(event, instance) {
    event.preventDefault();
    const usernameVar = FlowRouter.getParam('username'); // schema requires username.
    const name = event.target.name.value;
    const date = event.target.date.value;
    const time = event.target.time.value;
    const location = event.target.location.value;
    const cost = event.target.cost.value;
    const transportation = event.target.transportation.value;
    const description = event.target.description.value;
    const selectedInterests = _.filter(event.target.interests.selectedOptions, (option) => option.selected);
    const interests = _.map(selectedInterests, (option) => option.value);
    const pictureVar = event.target.picture.value;
    const updatedEvent = { name, date, time, location, cost, transportation, description, interests,
      picture: pictureVar, username: usernameVar };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const eventData = Events.getSchema().clean(updatedEvent);

    // Determine validity.
    instance.context.validate(eventData);

    if (instance.context.isValid()) {
      const _id = FlowRouter.getParam('_id');
      const usernameVariable = FlowRouter.getParam('username');
      Events.update(FlowRouter.getParam('_id'), { $set: updatedEvent });
      FlowRouter.go('Event_Page', { username: usernameVariable, _id: _id });
    } else {
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

