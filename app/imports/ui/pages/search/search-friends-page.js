import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';

const selectedInterestsKey = 'selectedInterests';

Template.Search_Friends_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.messageFlags = new ReactiveDict();
});

Template.Search_Friends_Page.onRendered(function onRendered() {
  $('.results-area').hide();
});

Template.Search_Friends_Page.helpers({
  profiles() {
    // Find all profiles with the currently selected interests.
    const allProfiles = Profiles.findAll();
    const selectedInterests = Template.instance().messageFlags.get(selectedInterestsKey);
    return _.filter(allProfiles, profile => _.intersection(profile.interests, selectedInterests).length > 0);
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

Template.Search_Friends_Page.events({
  'submit .search-friends-form'(event, instance) {
    event.preventDefault();
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
