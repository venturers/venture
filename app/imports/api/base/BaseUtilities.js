import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Events } from '/imports/api/event/EventCollection';

export function removeAllEntities() {
  Profiles.removeAll();
  Interests.removeAll();
  Events.removeAll();
}
