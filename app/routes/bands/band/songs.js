// app/routes/bands/band/songs.js
import Route from '@ember/routing/route';
import fetch from 'fetch';
import { service } from '@ember/service';
import { Song } from 'rarwe-octane/models/song';

export default class BandsBandSongsRoute extends Route {
  @service catalog;
  async model() {
    const band = this.modelFor('bands.band');
    const url = band.relationships.songs;
    const response = await fetch(url);
    const json = await response.json();
    const songs = [];

    for (const item of json.data) {
      const { id, attributes, relationships } = item;
      const rels = {};
      for (const relationshipName in relationships) {
        rels[relationshipName] = relationships[relationshipName].links.related;
      }
      const song = new Song({ id, ...attributes }, rels);
      songs.push(song);
      this.catalog.add('song', song);
    }
    band.songs = songs;
    return band;
  }

  resetController(controller) {
    controller.title = '';
    controller.showAddSong = true;
  }
}
