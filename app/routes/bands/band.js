import Route from '@ember/routing/route';

export default class BandsBandRoute extends Route {
  // When this route is loaded the dynamic segment (:id) from the URL is passed into the model hook for processing
  model(params) {
    let bands = this.modelFor('bands'); // This fetches the model of a parent route that has already been activated
    return bands.find((band) => band.id === params.id); // Returning the band that matches the id from the params
  }
}
