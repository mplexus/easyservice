var express = require('express');
var bodyParser = require('body-parser')
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.put('/accept', function (req, res) {
  res.send('Thank you.');
});

app.post('/token', function (req, res) {
  res.send('Thank you.');
});

app.post('/simulator', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  res.send('Received transfer id ' + req.body.data.id
    + ' and amount ' + (req.body.data.amount / 100)
    + ' ' + req.body.data.currency
    + ' \n')
});

app.post('/pay', function (req, res, next) {
  if (!req.body["checkout-token"]) return res.sendStatus(400);
  if (!req.body["amount"]) return res.sendStatus(400);
  if (!req.body["merchant-reference"]) return res.sendStatus(400);

  var token = req.body["checkout-token"] || '';
  var amount = req.body["amount"] || '';
  var reference = req.body["merchant-reference"] || '';

  var sk64 = "c2tfOHNvZHZ5WVVLbml4ZE1FblFLTDZtcWRHSHBDajl0cnE6"; //standard merchant

  request({
    method: 'POST',
    url: 'https://api.sandbox.torawallet.gr/v1/payments',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + sk64
    },
    body: "amount="+ amount + "&source=" + token + "&merchant_reference=" + reference
  }, function (error, response, body) {
    console.log('Response:', response);
    // you can use this response based on your needs.
    // i.e send it back to your app and show a confirmation message to end user
  });
});

var server = app.listen(8081, "127.0.0.1", function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log("Example app listening at http://%s:%s", host, port)
})
