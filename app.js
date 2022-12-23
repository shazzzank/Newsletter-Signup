const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html')
});

app.post('/', function(request, response) {
    const fName = request.body.fName;
    const lName = request.body.lName;
    const email = request.body.email;
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: { FNAME: fName, LNAME: lName }
        }]
    }

    const jsonData = JSON.stringify(data);
    const listID = '576b265a53';
    const url = 'https://us14.api.mailchimp.com/3.0/lists/' + listID;
    const apiKey = 'xyz:' + '41310d2c8cf82cdf683b14de7ca97d45-us14'
    const options = { method: 'POST', auth: apiKey }
    const justAnotherConstant =
        https.request(url, options, function(res) {
            res.on('data', function(data) {
                const jsonResponse = JSON.parse(data);
               	
               		if(jsonResponse.error_count > 0 ){
               			response.send('<h1>' + jsonResponse.errors[0].error +  '</h1>');
               		}else response.send('<h1> You are ' + jsonResponse.new_members[0].status +  ' !</h1>');
            });
        });
    justAnotherConstant.write(jsonData);
    justAnotherConstant.end();

});


app.listen(3000, function() {
    console.log('server started at port 3000')
});
