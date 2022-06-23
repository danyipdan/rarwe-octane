import { tracked } from '@glimmer/tracking';

export class Band {
  @tracked name;
  @tracked songs;

  constructor({ id, name, songs }, relationships = {}) {
    this.id = id;
    this.name = name;
    this.songs = songs || [];
    this.relationships = relationships;
  }
}
