/**
 * Created by ejf3 on 11/20/13.
 */
var c = require('../constants')
    , converter = require('../utils/dynamo_to_json.js');

Users = function (dynamodb) {
    this.dynamodb = dynamodb;

    this.getAll = function (socket) {
        console.log(c.DYN_GET_USERS, c.DYN_USERS_TABLE);
        this.dynamodb.scan({
            "TableName": c.DYN_USERS_TABLE,
            "Limit": 100
        }, function (err, data) {
            if (err) {
                console.log(c.DYN_GET_USERS, err);
                socket.emit(c.DYN_GET_USERS, "error");
            } else {
                var finalData = converter.ArrayConverter(data.Items);
                console.log(c.DYN_GET_USERS, finalData);
                socket.emit(c.DYN_GET_USERS, finalData);
            }
        });
    };

    this.addUpdateUser = function (user, socket) {
        console.log(c.DYN_UPDATE_USER);
        var userObj = converter.ConvertFromJson(user);
        this.dynamodb.putItem({
            "TableName": c.DYN_USERS_TABLE,
            "Item": userObj
        }, function (err, data) {
            if (err) {
                console.log(c.DYN_UPDATE_USER, err);
                socket.emit(c.DYN_UPDATE_USER, "error");
            } else {
                console.log(c.DYN_UPDATE_USER, data);
                socket.emit(c.DYN_UPDATE_USER, data);
            }
        });
    };

    this.deleteUser = function (userId, socket) {
        console.log(c.DYN_DELETE_USER);
        var userObj = converter.ConvertFromJson({id: userId});
        this.dynamodb.deleteItem({
            "TableName": c.DYN_USERS_TABLE,
            "Key": userObj
        }, function (err, data) {
            if (err) {
                console.log(c.DYN_DELETE_USER, err);
                socket.emit(c.DYN_DELETE_USER, "error");
            } else {
                console.log(c.DYN_DELETE_USER, data);
                socket.emit(c.DYN_DELETE_USER, data);
            }
        });
    };
};


module.exports = Users;