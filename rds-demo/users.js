/**
 * Created by ejf3 on 12/28/13.
 */
var c = require('../constants')
    , converter = require('../utils/dynamo_to_json.js')
    , mysql = require('mysql');


Users = function (rds, conf) {
    this.rds = rds;
    this.connection = mysql.createConnection(conf);
    var self = this;
    this.connection.connect(function(err){
        if (err)
            console.error("couldn't connect",err);
        else
            console.log("mysql connected");
        self.testGet();
    });

    this.testGet = function(){
        var query = this.connection.query('select * from users;', function(err,result){
            if (err)
                console.error("failed to get",err);
            else
                console.log("got",result);
        });
        console.log(query.sql);
    };

    this.testInsert = function(){
        var user  = {id: 0, name: 'Jimmy', email: 'jimmy@example.com'};
        var query = this.connection.query('INSERT INTO users SET ?', user, function(err, result) {
            if (err)
                console.error("failed to insert",err);
            else
                console.log("inserted",result);
        });
        console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
    };
};

module.exports = Users;