/**
 * Created by ejf3 on 11/20/13.
 */

var AWS = require('aws-sdk');

/**
 * Don't hard-code your credentials!
 * Export the following environment variables instead:
 *
 * export AWS_ACCESS_KEY_ID='AKID'
 * export AWS_SECRET_ACCESS_KEY='SECRET'
 */
AWS.config.region = "us-east-1";

var dynamoUsers = require('./dynamo-demo/users.js')
    , dynamoMedia = require('./dynamo-demo/media.js');

AwsWrapper = function () {
    this.dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    this.DyanmoUsers = new dynamoUsers(this.dynamodb);
    this.DyanmoMedia = new dynamoMedia(this.dynamodb);
    console.log('init aws wrapper', this.dynamodb, this.DyanmoUsers, this.DyanmoMedia);
}

module.exports = AwsWrapper;