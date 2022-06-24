import Service from '@ember/service';
import Band from '../models/band';
import Song from '../models/song';
import { tracked } from 'tracked-built-ins'; // this is nessesary to track properties when the properties are objects (object, array, map, set, etc)
import { isArray } from '@ember/array';

// helper function to extract, populate and return a relationships object containing the api end point url for the relationship data
function extractRelationships(object) {
  const relationships = {};
  for (const relationshipName in object) {
    relationships[relationshipName] = object[relationshipName].links.related;
  }
  return relationships;
}

// Making an ember service to handle all our data activities
export default class CatalogService extends Service {
  storage = {}; // the data store

  constructor() {
    super(...arguments);
    this.storage.bands = tracked([]); // marking the bands array as tracked
    this.storage.songs = tracked([]); // same for songs
  }

  // this is run when the '/bands' route is hit and its return value becomes the return of the model for use in the template
  async fetchAll(type) {
    if (type === 'bands') {
      const response = await fetch('/bands');
      const json = await response.json();
      this.loadAll(json);
      return this.bands;
    }

    if (type === 'songs') {
      const response = await fetch('/songs');
      const json = await response.json();
      this.loadAll(json);
      return this.songs;
    }
  }

  // loops over each item in the json.data, constructs and returns an array of records
  loadAll(json) {
    const records = [];
    for (const item of json.data) {
      records.push(this._loadResource(item));
    }
    return records;
  }

  load(response) {
    return this._loadResource(response.data);
  }

  // private function (designated by the _functionName)
  // Creates the band or song object and adds it to the storage
  _loadResource(data) {
    let record;
    const { id, type, attributes, relationships } = data;
    if (type === 'bands') {
      const rels = extractRelationships(relationships);
      record = new Band({ id, ...attributes }, rels);
      this.add('band', record);
    }
    if (type === 'songs') {
      const rels = extractRelationships(relationships);
      record = new Song({ id, ...attributes, rels });
      this.add('song', record);
    }

    return record;
  }

  // does the api call to fetch the related items from the backend
  async fetchRelated(record, relationship) {
    let url = record.relationships[relationship];
    const response = await fetch(url);
    const json = await response.json();
    if (isArray(json.data)) {
      // checks id the data is an array or not to decide which load method to use
      record[relationship] = this.loadAll(json);
    } else {
      record[relationship] = this.load(json);
    }
    return record[relationship];
  }

  // sends a new band or song off to the backend, loads the response into the data store
  async create(type, attributes, relationships = {}) {
    const payload = {
      data: {
        type: type === 'band' ? 'bands' : 'songs',
        attributes,
        relationships,
      },
    };
    const response = await fetch(type === 'band' ? '/bands' : '/songs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    return this.load(json);
  }

  // sends the patch request to the backend. local update is handled in the controller.
  async update(type, record, attributes) {
    const payload = {
      data: {
        id: record.id,
        type: type === 'band' ? 'bands' : 'songs',
        attributes,
      },
    };
    const url = type === 'band' ? `/bands/${record.id}` : `/songs/${record.id}`;
    await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'applicatoin/vnd.api+json',
      },
      body: JSON.stringify(payload),
    });
  }

  // adds a record to the data store
  add(type, record) {
    let collection = type === 'band' ? this.storage.bands : this.storage.songs;
    collection.push(record);
  }

  get bands() {
    return this.storage.bands;
  }

  get songs() {
    return this.storage.songs;
  }

  // returns a single item from the data store
  find(type, filterFn) {
    const collection = type === 'band' ? this.bands : this.songs;
    return collection.find(filterFn);
  }
}
