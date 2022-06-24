import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class BandsNewController extends Controller {
  @service catalog;
  @service router;

  @tracked name;

  get hasNoName() {
    return !this.name;
  }

  @action
  updateName(event) {
    this.name = event.target.value;
  }

  @action
  async saveBand() {
    const band = await this.catalog.create('band', { name: this.name });
    this.router.transitionTo('bands.band.songs', band.id);
  }
}
