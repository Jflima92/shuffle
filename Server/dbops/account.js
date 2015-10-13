var Account = require('../models/account');
//var sha256 = require('sha256');
//var mandrill = require('node-mandrill')('Kj-1SGPKFICoSgUIo9OEqw');
//Tokens
//var jwt = require('jsonwebtoken');
//var secret_key = 'shhhhhhared-secret';


function register(req, res) {
    var email = req.body.email.toString();
    Account.findOne({
        "email": req.body.email
    }, function(err,data){
        if(err) {
            res.json(err);
        }
        else if(data === null) {
            var temp;
            temp = req.body;
            temp.name = req.body.name;
            var person = new Account(temp);
            person.save(function(error, data) {
                if (error) {
                    res.json(error);
                } else {
                   res.json(data);
                }
            });
        }
        else {
            console.log("Invalid use: already in use.");
            res.json("AU");
        }
    });
}

module.exports.reg = register;