import { Template } from 'meteor/templating';

Template.Search_Friends_Page.events({
  'click .advanced-search'() {
    $('.advanced-search-form').transition('fly down');
  }
});
