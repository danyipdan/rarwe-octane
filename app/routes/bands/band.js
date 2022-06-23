import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class BandsBandRoute extends Route {
  @service catalog;
  // When a route is loaded the dynamic segment (:id) from the URL is passed into the model hook for processing
  model(params) {
    // fetch and return the band that matches the id from the 'catalog service'
    return this.catalog.find('band', (band) => band.id === params.id);
  }
}
