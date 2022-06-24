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

  constructor() {
    super(...arguments);
    this.router.on('routeWillChange', (transition) => {
      if (transition.isAborted) {
        return;
      }
      if (this.confirmedLeave) {
        return;
      }
      if (transition.from.name === 'bands.new') {
        if (this.name) {
          const leave = window.confirm(
            'You have unsaved changes. Are you sure?'
          );
          if (leave) {
            this.confirmedLeave = true;
          } else {
            transition.abort();
          }
        }
      }
    });
  }

  @action
  updateName(event) {
    this.name = event.target.value;
  }

  @action
  async saveBand() {
    const band = await this.catalog.create('band', { name: this.name });
    this.confirmedLeave = true;
    this.router.transitionTo('bands.band.songs', band.id);
  }
}
