import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { Song } from '../../../models/song';
import fetch from 'fetch';
export default class BandsBandSongsController extends Controller {
  @tracked showAddSong = true;
  @tracked title = '';

  get hasNoTitle() {
    return !this.title;
  }

  @service catalog;

  @action
  async updateRating(song, rating) {
    song.rating = rating;
    const payload = {
      data: {
        id: song.id,
        type: 'songs',
        attributes: {
          rating,
        },
      },
    };
    await fetch(`/songs/${song.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(payload),
    });
  }

  @action
  updateTitle(event) {
    this.title = event.target.value;
  }

  @action
  async saveSong() {
    const payload = {
      data: {
        type: 'songs',
        attributes: { title: this.title },
        relationships: {
          band: {
            data: {
              id: this.model.id,
              type: 'bands',
            },
          },
        },
      },
    };
    const response = await fetch('/songs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    const { id, attributes, relationships } = json.data;
    const rels = {};
    for (const relationshipName in relationships) {
      rels[relationshipName] = relationships[relationshipName].links.related;
    }
    const song = new Song({ id, ...attributes }, rels);
    this.catalog.add('song', song);
    this.model.songs = [...this.model.songs, song];
    this.title = '';
    this.showAddSong = true;
  }

  @action
  cancel() {
    this.title = '';
    this.showAddSong = true;
  }
}
