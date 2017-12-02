import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Events } from '/imports/api/event/EventCollection';
import { Interests } from '/imports/api/interest/InterestCollection';

const searchedKeywordKey = 'searchedKeyword';
const selectedInterestsKey = 'selectedInterests';

Template.Search_Events_Page.onCreated(function onCreated() {
  this.subscribe(Events.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.messageFlags = new ReactiveDict();
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
      matchedEvents = _.filter(matchedProfiles, profile => _.intersection(profile.interests, selectedInterests).length > 0);
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
