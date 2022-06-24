// app/routes/bands/band/songs.js
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class BandsBandSongsRoute extends Route {
  @service catalog;
  async model() {
    const band = this.modelFor('bands.band');
    await this.catalog.fetchRelated(band, 'songs');
    return band;
  }

  resetController(controller) {
    controller.title = '';
    controller.showAddSong = true;
  }
}
