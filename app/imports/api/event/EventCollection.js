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
      description: { type: String, optional: true },
      date: { type: String, optional: true },
      time: { type: String, optional: true },
      location: { type: String, optional: true },
      cost: { type: String, optional: true },
      transportation: { type: String, optional: true },
      peopleGoing: { type: Array, optional: true },
      interests: { type: Array, optional: true },
      'interests.$': { type: String },
      picture: { type: SimpleSchema.RegEx.Url, optional: true },
      facebook: { type: SimpleSchema.RegEx.Url, optional: true },
      instagram: { type: SimpleSchema.RegEx.Url, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Event.
   * @example
   * EventCollection.define({ firstName: 'Philip',
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

  define({ username, name = '', description = '', date = '', time = '', location = '', cost = '', transportation = '', peopleGoing = [], interests = [], picture = '', facebook = '', instagram = '' }) {

    // make sure required fields are OK.
    const checkPattern = { username: String, name: String };
    check({ username, name }, checkPattern);

    if (this.find({ name }).count() > 0) {
      throw new Meteor.Error(`${name} is previously defined in another Event`);
    }

    // Throw an error if any of the passed Interest names are not defined.
    Interests.assertNames(interests);

    // Throw an error if there are duplicates in the passed interest names.
    if (interests.length !== _.uniq(interests).length) {
      throw new Meteor.Error(`${interests} contains duplicates`);
    }

    return this._collection.insert({ username, name, description, date, time, location, cost, transportation, peopleGoing, interests, picture,
      facebook, instagram });
  }

  // insert({ username, name = '', description = '', date = '', time = '', location = '', cost = '', transportation = '', peopleGoing = [], interests = [], picture = '', facebook = '', instagram = '' }){
  //
  //   // make sure required fields are OK.
  //   const checkPattern = { username: String, name: String };
  //   check({ username, name }, checkPattern);
  //
  //   if (this.find({ name }).count() > 0) {
  //     throw new Meteor.Error(`${name} is previously defined in another Event`);
  //   }
  //
  //   // Throw an error if any of the passed Interest names are not defined.
  //   Interests.assertNames(interests);
  //
  //   // Throw an error if there are duplicates in the passed interest names.
  //   if (interests.length !== _.uniq(interests).length) {
  //     throw new Meteor.Error(`${interests} contains duplicates`);
  //   }
  //
  //   this._collection.insert({ username, name, description, date, time, location, cost, transportation, peopleGoing, interests, picture,
  //     facebook, instagram });
  // }

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
    const peopleGoing = doc.peopleGoing;
    const interests = doc.interests;
    const picture = doc.picture;
    const facebook = doc.facebook;
    const instagram = doc.instagram;
    return { username, name, description, date, time, location, cost, transportation, peopleGoing, interests, picture,
      facebook, instagram };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Events = new EventCollection();

