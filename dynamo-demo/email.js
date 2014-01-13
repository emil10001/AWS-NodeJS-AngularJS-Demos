/**
 * Created by ejf3 on 1/7/14.
 */
var c = require('../constants')
    , converter = require('../utils/dynamo_to_json.js');

Emails = function (dynamodb) {
    this.dynamodb = dynamodb;

    /**
     * This does not do any thinking, just grabs stuff from Dynamo
     * and returns the object
     *
     * @param email - a string, e.g. "steve@example.com"
     * @param callback
     */
    this.getEmail = function (email, callback) {
        console.log(c.DYN_GET_EMAIL);
        this.dynamodb.query({
            "TableName": c.DYN_EMAIL_TABLE,
            "Limit": 100,
            "KeyConditions": {
                "email": {
                    "AttributeValueList": [
                        {
                            "S": email
                        }
                    ],
                    "ComparisonOperator": "EQ"
                }
            }
        }, function (err, data) {
            if (err) {
                console.log(c.DYN_GET_EMAIL, err);
                callback(null, c.ERROR);
            } else {
                var finalData = converter.ArrayConverter(data.Items);
                console.log(c.DYN_GET_EMAIL, finalData);
                callback(finalData);
            }
        });
    };

    /**
     * Update the number of times someone has sent an email
     *
     * This does not do any thinking, it dumps the data into Dynamo
     * and moves on
     *
     * @param emailCount - an object,
     *     e.g. {
     *            email: "steve@example.com",
     *            count: 1
     *          }
     * @param callback - function(data, error){...}
     *     data shall be in the format of an emailCount object
     *
     * See 'unsubscribe' method for implementation
     */
    this.addUpdateEmail = function (emailCount, callback) {
        console.log(c.DYN_UPDATE_EMAIL);
        var emailObj = converter.ConvertFromJson(emailCount);
        this.dynamodb.putItem({
            "TableName": c.DYN_EMAIL_TABLE,
            "Item": emailObj
        }, function (err, data) {
            if (err) {
                console.log(c.DYN_UPDATE_EMAIL, err);
                callback(null, c.ERROR);
            } else {
                var finalData = converter.ArrayConverter(data.Items);
                console.log(c.DYN_UPDATE_EMAIL, finalData);
                callback(finalData);
            }
        });
    };

    /**
     * This can be called similarly to how the other Dynamo examples.
     * It just creates a record that should disallow further mailings.
     *
     * @param email - a string, e.g. "steve@example.com"
     * @param socket
     */
    this.unsubscribe = function (email, socket) {
        var callback = function (data, error) {
            if (!!error) {
                console.log(c.DYN_UNSUBSCRIBE_EMAIL, error);
                socket.emit(c.DYN_UNSUBSCRIBE_EMAIL, error);
            } else {
                console.log(c.DYN_UNSUBSCRIBE_EMAIL, data);
                socket.emit(c.DYN_UNSUBSCRIBE_EMAIL, data);
            }
        };

        var dontEmail = {
            email: email,
            count: 1000
        }
        this.addUpdateEmail(dontEmail, callback);
    };

};

module.exports = Emails;