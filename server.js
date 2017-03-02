var fs = require('fs');
var express = require('express');
var app = express();
var GoogleSearch = require('google-search');
var googleSearch = new GoogleSearch({
  key: fs.readFileSync("./key", 'utf-8'),
  cx: fs.readFileSync("./cx", 'utf-8')
});
var history = [];

app.get('/api/imagesearch/:query', function (req, res) {
    var query = req.params.query;
    var start = 1;
    var results = [];
    if (req.query.offset) {
        start = 1 + (10 * Number(req.query.offset));
    }
    googleSearch.build({
      q: query,
      num: 10,
      searchType: "image",
      start: start
    }, function(error, response) {
        for (var index in response.items) {
            results.push({url: response.items[index].link, snippet: response.items[index].snippet, context: response.items[index].image.contextLink});
        }
        if (history.length < 10 ) {
            history.unshift({term: query, when: new Date()});
        } else {
            history.pop();
            history.unshift({term: query, when: new Date()});
        }
        res.send(results);
    });
});
app.get('/api/latest/imagesearch/', function (req, res) {
    res.send(history);
});

app.listen(8080, function () {
  console.log('image search abstraction server is running');
})





