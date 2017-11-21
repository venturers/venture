import { Template } from 'meteor/templating';

Template.Search_Page.events({
  'click .advanced-search'() {
    $('.advanced-search-form').transition('scale');
  }
});
