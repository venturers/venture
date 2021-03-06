import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Profile */

/**
 * Profiles provide portfolio data for a user.
 * @extends module:Base~BaseCollection
 */
class ProfileCollection extends BaseCollection {

  /**
   * Creates the Profile collection.
   */
  constructor() {
    super('Profile', new SimpleSchema({
      username: { type: String },
      // Remainder are optional
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      age: { type: String, optional: true },
      location: { type: String, optional: true },
      transportation: { type: String, optional: true },
      bio: { type: String, optional: true },
      interests: { type: Array, optional: true },
      'interests.$': { type: String },
      picture: { type: SimpleSchema.RegEx.Url, optional: true },
      snapchat: { type: SimpleSchema.RegEx.Url, optional: true },
      facebook: { type: SimpleSchema.RegEx.Url, optional: true },
      instagram: { type: SimpleSchema.RegEx.Url, optional: true },
      friends: { type: Array, optional: true },
      'friends.$': { type: String },
      events: { type: Array, optional: true },
      'events.$': { type: String },
      comments: { type: Array, optional: true },
      'comments.$': { type: Object },
      'comments.$.username': { type: String },
      'comments.$.date': { type: Date },
      'comments.$.text': { type: String },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Profile.
   * @example
   * Profiles.define({ firstName: 'Philip',
   *                   lastName: 'Johnson',
   *                   username: 'johnson',
   *                   bio: 'I have been a professor of computer science at UH since 1990.',
   *                   interests: ['Application Development', 'Software Engineering', 'Databases'],
   *                   title: 'Professor of Information and Computer Sciences',
   *                   picture: 'http://philipmjohnson.org/headshot.jpg',
   *                   github: 'https://github.com/philipmjohnson',
   *                   facebook: 'https://facebook.com/philipmjohnson',
   *                   instagram: 'https://instagram.com/philipmjohnson' });
   * @param { Object } description Object with required key username.
   * Remaining keys are optional.
   * Username must be unique for all users. It should be the UH email account.
   * Interests is an array of defined interest names.
   * @throws { Meteor.Error } If a user with the supplied username already exists, or
   * if one or more interests are not defined, or if github, facebook, and instagram are not URLs.
   * @returns The newly created docID.
   */
  define({ firstName = '', lastName = '', age, location = '', transportation = '', username, bio = '', interests = [],
           picture = '', snapchat = '', facebook = '', instagram = '', friends = [], events = [], comments = [] }) {
    // make sure required fields are OK.
    const checkPattern = { username: String };
    check({ username }, checkPattern);

    if (this.find({ username }).count() > 0) {
      throw new Meteor.Error(`${username} is previously defined in another Profile`);
    }

    // Throw an error if any of the passed Interest names are not defined.
    Interests.assertNames(interests);

    // Throw an error if there are duplicates in the passed interest names.
    if (interests.length !== _.uniq(interests).length) {
      throw new Meteor.Error(`${interests} contains duplicates`);
    }

    return this._collection.insert({ firstName, lastName, age, location, transportation, username, bio, interests,
      picture, snapchat, facebook, instagram, friends, events, comments });
  }

  /**
   * Returns an object representing the Profile docID in a format acceptable to define().
   * @param docID The docID of a Profile.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const age = doc.age;
    const location = doc.location;
    const transportation = doc.transportation;
    const username = doc.username;
    const bio = doc.bio;
    const interests = doc.interests;
    const picture = doc.picture;
    const snapchat = doc.github;
    const facebook = doc.facebook;
    const instagram = doc.instagram;
    const friends = doc.friends;
    const events = doc.events;
    const comments = doc.comments;
    return { firstName, lastName, age, location, transportation, username, bio, interests, picture, snapchat, facebook,
      instagram, friends, events, comments };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Profiles = new ProfileCollection();
