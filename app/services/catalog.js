import Service from '@ember/service';
import Band from '../models/band';
import Song from '../models/song';
import { tracked } from 'tracked-built-ins';
import { isArray } from '@ember/array';

function extractRelationships(object) {
  const relationships = {};
  for (const relationshipName in object) {
    relationships[relationshipName] = object[relationshipName].links.related;
  }
  return relationships;
}

export default class CatalogService extends Service {
  storage = {};

  constructor() {
    super(...arguments);
    this.storage.bands = tracked([]);
    this.storage.songs = tracked([]);
  }

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

  async fetchRelated(record, relationship) {
    console.log(record);
    // const url = record.relationships[relationship];
    let url = record.relationships[relationship];
    // console.log({ url });
    const response = await fetch(url);
    const json = await response.json();
    if (isArray(json.data)) {
      record[relationship] = this.loadAll(json);
    } else {
      record[relationship] = this.load(json);
    }
    return record[relationship];
  }

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

  find(type, filterFn) {
    const collection = type === 'band' ? this.bands : this.songs;
    return collection.find(filterFn);
  }
}
