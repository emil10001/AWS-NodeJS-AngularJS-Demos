/**
 * Created by ejf3 on 12/28/13.
 */
var c = require('../constants')
    , converter = require('../utils/dynamo_to_json.js')
    , mysql = require('mysql');

Media = function (rds, conf) {
    this.rds = rds;
    this.connection = mysql.createConnection(conf);
    this.connection.connect(function (err) {
        if (err)
            console.error("couldn't connect", err);
        else
            console.log("mysql connected");
    });

    this.getAll = function(socket){
        var query = this.connection.query('select * from media;', function(err,result){
            if (err){
                console.error("failed to get",err);
                socket.emit(c.RDS_GET_MEDIA, c.ERROR);
            } else {
                console.log("got",result);
                socket.emit(c.RDS_GET_MEDIA, result);
            }
        });
        console.log(query.sql);
    };

    this.getUserMedia = function(uId, socket){
        var query = this.connection.query('select * from media where uid = ?;', uId, function(err,result){
            if (err){
                console.error("failed to get",err);
                socket.emit(c.RDS_GET_USER_MEDIA, c.ERROR);
            } else {
                console.log("got",result);
                socket.emit(c.RDS_GET_USER_MEDIA, result);
            }
        });
        console.log(query.sql);
    };

    this.addUpdateMedia = function(media, socket){
        var query = this.connection.query('INSERT INTO media SET ?;', media, function(err, result) {
            if (err) {
                console.error("failed to insert",err);
                socket.emit(c.RDS_UPDATE_MEDIA, c.ERROR);
            } else {
                console.log("inserted",result);
                socket.emit(c.RDS_UPDATE_MEDIA, result);
            }
        });
        console.log(query.sql);
    };

    this.deleteMedia = function(mediaId, socket){
        var query = this.connection.query('DELETE FROM media WHERE id = ?;', mediaId, function(err, result) {
            if (err) {
                console.error("failed to delete",err);
                socket.emit(c.RDS_DELETE_MEDIA, c.ERROR);
            } else {
                console.log("deleted",result);
                socket.emit(c.RDS_DELETE_MEDIA, result);
            }
        });
        console.log(query.sql);
    };


};
module.exports = Media;