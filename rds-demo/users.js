/**
 * Created by ejf3 on 12/28/13.
 */
var c = require('../constants')
    , converter = require('../utils/dynamo_to_json.js')
    , mysql = require('mysql');


Users = function (rds, conf, rdsMedia) {
    this.rds = rds;
    this.connection = mysql.createConnection(conf);
    this.rdsMedia = rdsMedia;
    var self = this;

    this.connection.connect(function(err){
        if (err)
            console.error("couldn't connect",err);
        else
            console.log("mysql connected");
    });

    this.getAll = function(socket){
        var query = this.connection.query('select * from users;', function(err,result){
            if (err){
                console.error("failed to get",err);
                socket.emit(c.RDS_GET_USERS, c.ERROR);
            } else {
                console.log("got",result);
                socket.emit(c.RDS_GET_USERS, result);
            }
        });
        console.log(query.sql);
    };

    this.addUpdateUser = function(user, socket){
        var query = this.connection.query('INSERT INTO users SET ?', user, function(err, result) {
            if (err) {
                console.error("failed to insert",err);
                socket.emit(c.RDS_UPDATE_USER, c.ERROR);
            } else {
                console.log("inserted",result);
                socket.emit(c.RDS_UPDATE_USER, result);
            }
        });
        console.log(query.sql);
    };

    this.deleteUser = function(userId, socket){
        self.rdsMedia.deleteUserMedia(userId, function(){
            var query = self.connection.query('DELETE FROM users WHERE id = ?', userId, function(err, result) {
                if (err) {
                    console.error("failed to delete",err);
                    socket.emit(c.RDS_DELETE_USER, c.ERROR);
                } else {
                    console.log("deleted",result);
                    socket.emit(c.RDS_DELETE_USER, result);
                }
            });
            console.log(query.sql);
        }, socket);
    };
};

module.exports = Users;