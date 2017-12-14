import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Events } from '/imports/api/event/EventCollection';
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';

const searchedKeywordKey = 'searchedKeyword';
const selectedInterestsKey = 'selectedInterests';
const searchedDateKey = 'searchedDate';
const searchedTimeKey = 'searchedTime';
// const searchedLocationKey = 'searchedLocation';
const searchedMinimumKey = 'searchedMinimum';
const searchedMaximumKey = 'searchedMaximum';
const checkedFriendsAreAttendingKey = 'checkedFriendsAreAttending';

Template.Search_Events_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedInterestsKey, []);
});

Template.Search_Events_Page.helpers({
  events() {
    let matchedEvents = Events.findAll();
    const searchedKeyword = Template.instance().messageFlags.get(searchedKeywordKey);
    if (searchedKeyword !== '') {
      matchedEvents = _.filter(matchedEvents, event => event.name.toUpperCase().indexOf(searchedKeyword) >= 0);
    }
    const selectedInterests = Template.instance().messageFlags.get(selectedInterestsKey);
    if (selectedInterests.length > 0) {
      matchedEvents = _.filter(matchedEvents, event => _.intersection(event.interests, selectedInterests).length > 0);
    }
    const searchedDate = Template.instance().messageFlags.get(searchedDateKey);
    if (searchedDate !== '') {
      matchedEvents = _.filter(matchedEvents, event => event.date === searchedDate);
    }
    const searchedTime = Template.instance().messageFlags.get(searchedTimeKey);
    if (searchedTime !== '') {
      matchedEvents = _.filter(matchedEvents, event => event.time === searchedTime);
    }
    const searchedMinimum = Template.instance().messageFlags.get(searchedMinimumKey);
    if (searchedMinimum !== '') {
      matchedEvents = _.filter(matchedEvents, event => event.cost >= searchedMinimum);
    }
    const searchedMaximum = Template.instance().messageFlags.get(searchedMaximumKey);
    if (searchedMaximum !== '') {
      matchedEvents = _.filter(matchedEvents, event => event.cost <= searchedMaximum);
    }
    const checkedFriendsAreAttending = Template.instance().messageFlags.get(checkedFriendsAreAttendingKey);
    if (checkedFriendsAreAttending) {
      matchedEvents = _.filter(matchedEvents, event => _.intersection(event.peopleGoing,
          Profiles.findDoc(FlowRouter.getParam('username')).friends).length > 0);
    }
    return matchedEvents;
  },
  interests() {
    return _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return {
            label: interest.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedInterestsKey), interest.name),
          };
        });
  },
});

Template.Search_Events_Page.events({
  'submit .search-form'(event, instance) {
    event.preventDefault();
    instance.messageFlags.set(searchedKeywordKey, event.target.Keyword.value.trim().toUpperCase());
    const selectedOptions = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedInterestsKey, _.map(selectedOptions, (option) => option.value));
    instance.messageFlags.set(searchedDateKey, event.target.Date.value);
    instance.messageFlags.set(searchedTimeKey, event.target.Time.value);
    instance.messageFlags.set(searchedMinimumKey, event.target.Minimum.value);
    instance.messageFlags.set(searchedMaximumKey, event.target.Maximum.value);
    instance.messageFlags.set(checkedFriendsAreAttendingKey, event.target['Friends Are Attending'].checked);
    $('.search-area').hide();
    $('.search-area').removeClass('visible');
    $('.results-area').transition('slide left');
  },
  'click .advanced-search'() {
    $('.advanced-search-form').transition('fly down');
  },
  'click .angle.left.link.icon'() {
    $('.results-area').hide();
    $('.results-area').removeClass('visible');
    $('.search-area').transition('slide right');
  },
});
