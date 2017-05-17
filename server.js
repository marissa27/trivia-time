const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Trivia Time!';

app.get('/', (request, response) => {
  response.send('It is trivia up in here')
});

app.listen(app.get('port'), () => {
  console.log('Your app is running')
});
