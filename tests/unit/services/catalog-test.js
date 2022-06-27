import { module, test } from 'qunit';
import { setupTest } from 'rarwe-octane/tests/helpers';
import Band from 'rarwe-octane/models/band';
import Song from 'rarwe-octane/models/song';

module('Unit | Service | catalog', function (hooks) {
  setupTest(hooks);

  test('it can store and retrieve bands', function (assert) {
    const catalog = this.owner.lookup('service:catalog');
    catalog.add('band', new Band({ id: 1, name: 'Led Zeppelin' }));

    assert.strictEqual(catalog.bands.length, 1);
    assert.strictEqual(catalog.bands[0].name, 'Led Zeppelin');
  });

  test('it can store and retrieve songs', function (assert) {
    const catalog = this.owner.lookup('service:catalog');
    catalog.add(
      'song',
      new Song({
        id: 1,
        title: 'Achilles Last Stand',
        rating: 5,
      })
    );

    assert.strictEqual(catalog.songs.length, 1);
    assert.strictEqual(catalog.songs[0].title, 'Achilles Last Stand');
  });

  test('it can load a record from a JSON:API response', function (assert) {
    const catalog = this.owner.lookup('service:catalog');
    const response = {
      data: {
        id: '1',
        type: 'bands',
        attributes: {
          name: 'TOOL',
        },
        relationships: {
          songs: {
            links: {
              related: '/bands/1/songs',
            },
          },
        },
      },
    };

    catalog.load(response);
    const band = catalog.bands[0];
    assert.strictEqual(band.name, 'TOOL');
    assert.strictEqual(band.relationships.songs, '/bands/1/songs');
  });
});
