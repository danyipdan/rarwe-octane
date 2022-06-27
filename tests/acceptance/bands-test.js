import { module, test } from 'qunit';
import { click, visit, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'rarwe-octane/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { getPageTitle } from 'ember-page-title/test-support';
import {
  createBand,
  createSong,
} from 'rarwe-octane/tests/helpers/custom-helpers';

module('Acceptance | bands', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('List bands', async function (assert) {
    this.server.create('band', { name: 'Radiohead' });
    this.server.create('band', { name: 'Long Distance Calling' });

    await visit('/');

    assert.strictEqual(
      getPageTitle(),
      'Bands | RarweOctane',
      'Correct page title'
    );

    assert
      .dom('[data-test-rr="band-link"]')
      .exists({ count: 2 }, 'All band links are rendered');

    assert
      .dom('[data-test-rr="band-link"]')
      .hasText('Radiohead', 'The first band link contains the band name');

    assert
      .dom('[data-test-rr="band-list-item"]:last-child')
      .hasText(
        'Long Distance Calling',
        'The other band link contains the band name'
      );
  });

  test('Create a band', async function (assert) {
    this.server.create('band', { name: 'Royal Blood' });
    await visit('/');
    await createBand('Caspian');
    await waitFor('[data-test-rr="no-songs-text"]');

    assert
      .dom('[data-test-rr="band-list-item"]')
      .exists({ count: 2 }, 'A new band link is rendered');

    assert
      .dom('[data-test-rr="band-list-item"]:last-child')
      .hasText('Caspian', 'The new band link is rendered');
    assert
      .dom('[data-test-rr="songs-nav-item"] > .active')
      .exists('The Songs tab is active');
  });

  test('Create a song', async function (assert) {
    this.server.create('band', { name: 'Metallica' });
    await visit('/');
    await createBand('The Wiggles');
    await waitFor('[data-test-rr="no-songs-text"]');

    await createSong('Hot Potato');
    await waitFor('[data-test-rr="song-list-item"]');
    assert
      .dom('[data-test-rr="song-list-item"]')
      .exists({ count: 1 }, 'A new song is created');

    assert
      .dom('[data-test-rr="song-list-item"]:first-child')
      .hasText('Hot Potato');
  });

  test('Create multiple songs', async function (assert) {
    this.server.create('band', { name: 'Metallica' });
    await visit('/');
    await createBand('The Wiggles');
    await waitFor('[data-test-rr="no-songs-text"]');

    await createSong('Song 1');
    await waitFor('[data-test-rr="song-list-item"]');
    await createSong('Song 2');
    await waitFor('[data-test-rr="song-list-item"]:nth-child(2)');
    await createSong('Song 3');
    await waitFor('[data-test-rr="song-list-item"]:nth-child(3)');

    assert
      .dom('[data-test-rr="song-list-item"]')
      .exists({ count: 3 }, '3 songs were created');

    assert
      .dom('[data-test-rr="song-list-item"]:last-child')
      .hasText('Song 3', 'The last song entered is at the end of the list');
  });

  test('Rate a song', async function (assert) {
    this.server.create('band', { name: 'Metallica' });
    await visit('/');
    await click('[data-test-rr="band-link"]');
    await createSong('Song 1');
    await waitFor('[data-test-rr="song-list-item"]');
    await click('[data-test-rr="star-rating-button"]:nth-child(3)');
    assert
      .dom(
        '[data-test-rr="star-rating-button"]:nth-child(3) > [data-prefix="fas"]'
      )
      .exists('Star 3 is filled');
    assert
      .dom(
        '[data-test-rr="star-rating-button"]:nth-child(4) > [data-prefix="far"]'
      )
      .exists('Star 4 is outline');
  });
});
