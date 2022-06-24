import { tracked } from '@glimmer/tracking';

export default class Band {
  @tracked name; // tracked properties will cause a re-render when they are changed
  @tracked songs;

  constructor({ id, name, songs, description }, relationships = {}) {
    this.id = id;
    this.name = name;
    this.songs = songs || [];
    this.relationships = relationships;
    this.description = description;
  }
}
