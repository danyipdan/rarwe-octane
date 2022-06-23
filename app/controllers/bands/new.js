import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { dasherize } from '@ember/string';
import { service } from '@ember/service';
import { Band } from '../../models/band';
import fetch from 'fetch';

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
    const response = await fetch('/bands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'bands',
          attributes: {
            name: this.name,
          },
        },
      }),
    });
    // console.log(response);
    const json = await response.json();
    console.log(json);
    const { id, attributes } = json.data;
    const record = new Band({ id, ...attributes });
    this.catalog.add('band', record);
    this.router.transitionTo('bands.band.songs', id);
  }
}
