/**
 * Created by ejf3 on 12/28/13.
 */
var c = require('../constants')
    , converter = require('../utils/dynamo_to_json.js')
    , mysql = require('mysql');


Users = function (rds, conf) {
    this.rds = rds;
    this.connection = mysql.createConnection(conf);
    this.connection.connect(function(err){
        if (err)
            console.error("couldn't connect",err);
        else
            console.log("mysql connected");
    });
};
module.exports = Users;