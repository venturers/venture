import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Events } from '/imports/api/event/EventCollection';

const searchedNameKey = 'searchedName';
const selectedInterestsKey = 'selectedInterests';
const searchedLocationKey = 'searchedLocation';
const searchedTransportationKey = 'searchedTransportation';
const checkedHasCommonFriendsKey = 'checkedHasCommonFriends';
const checkedAttendingCommonEventsKey = 'checkedAttendingCommonEvents';
const transportationOptions = ['None', 'Car', 'Bus'];

Template.Search_Friends_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedInterestsKey, []);
});

Template.Search_Friends_Page.helpers({
  profiles() {
    const myUsername = FlowRouter.getParam('username');
    let matchedProfiles = _.filter(Profiles.findAll(), profile => profile.firstName && profile.firstName !== ''/* && profile.username != myUsername*/);
    const myProfile = Profiles.findDoc(myUsername);
    const searchedName = Template.instance().messageFlags.get(searchedNameKey);
    if (searchedName !== '') {
      matchedProfiles = _.filter(matchedProfiles, profile => (profile.firstName + ' ' + profile.lastName).toUpperCase().indexOf(searchedName) >= 0);
    }
    const selectedInterests = Template.instance().messageFlags.get(selectedInterestsKey);
    if (selectedInterests.length > 0) {
      matchedProfiles = _.filter(matchedProfiles, profile => _.intersection(profile.interests, selectedInterests).length > 0);
    }
    const searchedLocation = Template.instance().messageFlags.get(searchedLocationKey);
    if (searchedLocation !== '') {
      matchedProfiles = _.filter(matchedProfiles, profile => profile.location && profile.location.toUpperCase().indexOf(searchedLocation) >= 0);
    }
    const searchedTransportation = Template.instance().messageFlags.get(searchedTransportationKey);
    if (searchedTransportation !== '') {
      matchedProfiles = _.filter(matchedProfiles, profile => (profile.transportation && profile.transportation === searchedTransportation) || (!profile.transportation && searchedTransportation === 'None'));
    }
    const checkedHasCommonFriends = Template.instance().messageFlags.get(checkedHasCommonFriendsKey);
    if (checkedHasCommonFriends) {
      matchedProfiles = _.filter(matchedProfiles, profile => _.intersection(myProfile.friends, profile.friends).length > 0);
    }
    const checkedAttendingCommonEvents = Template.instance().messageFlags.get(checkedAttendingCommonEventsKey);
    if (checkedAttendingCommonEvents) {
      matchedProfiles = _.filter(matchedProfiles, profile => _.intersection(myProfile.events, profile.events).length > 0);
    }
    return matchedProfiles;
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
  transportation() {
    return _.map(transportationOptions,
        function makeTransportationObject(transportation) {
          return { label: transportation };
        });
  }
});

Template.Search_Friends_Page.events({
  'submit .search-form'(event, instance) {
    event.preventDefault();
    instance.messageFlags.set(searchedNameKey, event.target.Name.value.trim().toUpperCase());
    const selectedOptions = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedInterestsKey, _.map(selectedOptions, (option) => option.value));
    instance.messageFlags.set(searchedLocationKey, event.target.Location.value.trim().toUpperCase());
    console.log(event.target.Transportation.value);
    instance.messageFlags.set(searchedTransportationKey, event.target.Transportation.value);
    instance.messageFlags.set(checkedHasCommonFriendsKey, event.target['Has Common Friends'].checked);
    instance.messageFlags.set(checkedAttendingCommonEventsKey, event.target['Attending Common Events'].checked);
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
  }
});
