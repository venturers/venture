import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Event */

/**
 * Events provide event data for a user.
 * @extends module:Base~BaseCollection
 */
class EventCollection extends BaseCollection {

  /**
   * Creates the Events collection.
   */
  constructor() {
    super('Event', new SimpleSchema({
      username: { type: String },
      name: { type: String },
      description: { type: String },
      date: { type: String },
      time: { type: String },
      location: { type: String },
      cost: { type: String },
      transportation: { type: String },

      interests: { type: Array, optional: true },
      'interests.$': { type: String },

      title: { type: String, optional: true },
      picture: { type: SimpleSchema.RegEx.Url, optional: true },
      github: { type: SimpleSchema.RegEx.Url, optional: true },
      facebook: { type: SimpleSchema.RegEx.Url, optional: true },
      instagram: { type: SimpleSchema.RegEx.Url, optional: true },
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
  define({ username, name = '', description = '', date = '', time = '', location = '', cost = '', transportation = '', interests = [], picture = '', title = '', github = '',
           facebook = '', instagram = '' }) {
    // make sure required fields are OK.
    const checkPattern = { username: String, name: String, description: String, date: String, time: String, location: String, cost: String, transportation: String, picture: String,
      title: String };
    check({ username, name, description, date, time, location, cost, transportation }, checkPattern);

    if (this.find({ name }).count() > 0) {
      throw new Meteor.Error(`${name} is previously defined in another Event`);
    }

    // Throw an error if any of the passed Interest names are not defined.
    Interests.assertNames(interests);

    // Throw an error if there are duplicates in the passed interest names.
    if (interests.length !== _.uniq(interests).length) {
      throw new Meteor.Error(`${interests} contains duplicates`);
    }

    return this._collection.insert({ username, name, description, date, time, location, cost, transportation, interests, picture, title, github,
      facebook, instagram });
  }

  /**
   * Returns an object representing the Profile docID in a format acceptable to define().
   * @param docID The docID of a Profile.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const username = doc.username;
    const name = doc.name;
    const description = doc.description;
    const date = doc.date;
    const time = doc.time;
    const location = doc.location;
    const cost = doc.cost;
    const transportation = doc.transportation;
    const interests = doc.interests;
    const picture = doc.picture;
    const title = doc.title;
    const github = doc.github;
    const facebook = doc.facebook;
    const instagram = doc.instagram;
    return { username, name, description, date, time, location, cost, transportation, interests, picture, title, github,
      facebook, instagram };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Events = new EventCollection();
