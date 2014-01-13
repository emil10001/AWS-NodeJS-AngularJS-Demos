/**
 * Created by ejf3 on 11/20/13.
 */
var c = require('../constants')
    , converter = require('../utils/dynamo_to_json.js');


Media = function (dynamodb) {
    this.dynamodb = dynamodb;

    this.getAll = function (socket) {
        console.log(c.DYN_GET_MEDIA);
        this.dynamodb.scan({
            "TableName": c.DYN_MEDIA_TABLE,
            "Limit": 100
        }, function (err, data) {
            if (err) {
                console.log(c.DYN_GET_MEDIA, err);
                socket.emit(c.DYN_GET_MEDIA, c.ERROR);
            } else {
                var finalData = converter.ArrayConverter(data.Items);
                console.log(c.DYN_GET_MEDIA, finalData);
                socket.emit(c.DYN_GET_MEDIA, finalData);
            }
        });
    };

    this.getUserMediaForEmail = function(uid, callback){
        console.log(c.DYN_GET_USER_MEDIA);
        this.dynamodb.scan({
            "TableName": c.DYN_MEDIA_TABLE,
            "Limit": 100,
            "ScanFilter": {
                "uid": {
                    "AttributeValueList": [
                        {
                            "N": uid.toString()
                        }
                    ],
                    "ComparisonOperator": "EQ"
                }
            }
        }, function (err, data) {
            if (err) {
                console.log(c.DYN_GET_USER_MEDIA, err);
                callback(null, c.ERROR);
            } else {
                var finalData = converter.ArrayConverter(data.Items);
                console.log(c.DYN_GET_USER_MEDIA, finalData);
                callback(finalData, null);
            }
        });
    }

    this.getUserMedia = function (uid, socket) {
        console.log(c.DYN_GET_USER_MEDIA);
        this.dynamodb.scan({
            "TableName": c.DYN_MEDIA_TABLE,
            "Limit": 100,
            "ScanFilter": {
                "uid": {
                    "AttributeValueList": [
                        {
                            "N": uid.toString()
                        }
                    ],
                    "ComparisonOperator": "EQ"
                }
            }
        }, function (err, data) {
            if (err) {
                console.log(c.DYN_GET_USER_MEDIA, err);
                socket.emit(c.DYN_GET_USER_MEDIA, c.ERROR);
            } else {
                var finalData = converter.ArrayConverter(data.Items);
                console.log(c.DYN_GET_USER_MEDIA, finalData);
                socket.emit(c.DYN_GET_USER_MEDIA, finalData);
            }
        });
    };

    this.addUpdateMedia = function (media, socket) {
        console.log("dyn.media.addUpdateMedia");
        var mediaObj = converter.ConvertFromJson(media);
        this.dynamodb.putItem({
            "TableName": c.DYN_MEDIA_TABLE,
            "Item": mediaObj
        }, function (err, data) {
            if (err) {
                console.log(c.DYN_UPDATE_MEDIA, err);
                socket.emit(c.DYN_UPDATE_MEDIA, c.ERROR);
            } else {
                var finalData = converter.ArrayConverter(data.Items);
                console.log(c.DYN_UPDATE_MEDIA, finalData);
                socket.emit(c.DYN_UPDATE_MEDIA, finalData);
            }
        });
    };

    this.deleteMedia = function (mid, socket) {
        console.log(c.DYN_DELETE_MEDIA, mid);
        var mediaObj = converter.ConvertFromJson({id: mid});
        this.dynamodb.deleteItem({
            "TableName": c.DYN_MEDIA_TABLE,
            "Key": mediaObj
        }, function (err, data) {
            if (err) {
                console.log(c.DYN_DELETE_MEDIA, err);
                socket.emit(c.DYN_DELETE_MEDIA, "error");
            } else {
                var finalData = converter.ArrayConverter(data.Items);
                console.log(c.DYN_DELETE_MEDIA, finalData);
                socket.emit(c.DYN_DELETE_MEDIA, finalData);
            }
        });
    };

};


module.exports = Media;