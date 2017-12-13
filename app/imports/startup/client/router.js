import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { $ } from 'meteor/jquery';


/*                        LANDING ROUTE                       */

export const landingPageRouteName = 'Landing_Page';
FlowRouter.route('/', {
  name: landingPageRouteName,
  action() {
    BlazeLayout.render('Landing_Layout', { main: landingPageRouteName });
  },
});

/*                        DIRECTORY ROUTE                       */

function addDirectoryBodyClass() {
  $('body').addClass('directory-page-body');
}

function removeDirectoryBodyClass() {
  $('body').removeClass('directory-page-body');
}

export const directoryPageRouteName = 'Directory_Page';
FlowRouter.route('/directory', {
  name: directoryPageRouteName,
  action() {
    BlazeLayout.render('Directory_Layout', { main: directoryPageRouteName });
  },
  triggersEnter: [addDirectoryBodyClass],
  triggersExit: [removeDirectoryBodyClass],
});


/*                        USER ROUTES                      */


function addUserBodyClass() {
  $('body').addClass('user-layout-body');
}

function removeUserBodyClass() {
  $('body').removeClass('user-layout-body');
}

const userRoutes = FlowRouter.group({
  prefix: '/:username',
  name: 'userRoutes',
  triggersEnter: [addUserBodyClass],
  triggersExit: [removeUserBodyClass],
});

export const profilePageRouteName = 'Profile_Page';
userRoutes.route('/profile', {
  name: profilePageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: profilePageRouteName });
  },
});

export const searchEventsPageRouteName = 'Search_Events_Page';
userRoutes.route('/search-events', {
  name: searchEventsPageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: searchEventsPageRouteName });
  },
});

export const createEventPageRouteName = 'Create_Event_Page';
userRoutes.route('/create-event', {
  name: createEventPageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: createEventPageRouteName });
  },
});

export const publicProfilePageRouteName = 'Public_Profile_Page';
userRoutes.route('/public-profile/:_id', {
  name: publicProfilePageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: publicProfilePageRouteName });
  },
});

export const searchFriendsPageRouteName = 'Search_Friends_Page';
userRoutes.route('/search-friends', {
  name: searchFriendsPageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: searchFriendsPageRouteName });
  },
});

export const eventPageRouteName = 'Event_Page';
userRoutes.route('/events/:_id', {
  name: eventPageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: eventPageRouteName });
  },
});

export const editEventPageRouteName = 'Edit_Event_Page';
userRoutes.route('/events/edit/:_id', {
  name: editEventPageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: editEventPageRouteName });
  },
});

export const dashboardPageRouteName = 'Dashboard_Page';
userRoutes.route('/dashboard', {
  name: dashboardPageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: dashboardPageRouteName });
  },
});


/*                        MISC ROUTES                       */
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('Page_Not_Found');
  },
};
