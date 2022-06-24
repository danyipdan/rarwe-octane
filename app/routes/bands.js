import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class BandsRoute extends Route {
  @service catalog;

  // the model hook is called on navigation to the route. It's return value is available in the template as @model
  model() {
    return this.catalog.fetchAll('bands');
  }
}
