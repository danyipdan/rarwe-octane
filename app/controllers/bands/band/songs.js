import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

// Controllers are context for route templates

// The controller is a singleton, each class only has one instance in the app. To handle cleanup between routes using the same controller there is a function in the route class "resetController".
export default class BandsBandSongsController extends Controller {
  @service catalog; // importing the catalog service - all our data and data related methods are stored here

  // these are tracked properties, if they change there will be a re-render
  @tracked showAddSong = true;
  @tracked title = '';

  // this is a getter, it's return value is available in the template.
  get hasNoTitle() {
    return !this.title;
  }

  // @actions are available to be triggered by user action in the template
  @action
  async updateRating(song, rating) {
    song.rating = rating;
    this.catalog.update('song', song, { rating });
  }

  @action
  updateTitle(event) {
    this.title = event.target.value;
  }

  @action
  async saveSong() {
    const song = await this.catalog.create(
      'song',
      { title: this.title },
      { band: { data: { id: this.model.id, type: 'bands' } } }
    );
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
