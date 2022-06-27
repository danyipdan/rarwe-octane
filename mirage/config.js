export default function () {
  this.get('/bands');
  this.get('/bands/:id');
  this.get('/bands/:id/songs', function (schema, request) {
    const id = request.params.id;
    return schema.songs.where({ bandId: id });
  });

  this.post('/bands');
  this.post('/songs');

  this.patch('/songs/:id');
}
