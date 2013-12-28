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
AWS.config.apiVersions = {
    rds: '2013-09-09',
    dynamodb: '2012-08-10'
};

var dynamoUsers = require('./dynamo-demo/users.js')
    , dynamoMedia = require('./dynamo-demo/media.js')
    , rdsUsers = require('./rds-demo/media.js')
    , rdsMedia = require('./rds-demo/media.js')
    ;



AwsWrapper = function () {
    // Dynamo
    this.dynamodb = new AWS.DynamoDB();
    this.DyanmoUsers = new dynamoUsers(this.dynamodb);
    this.DyanmoMedia = new dynamoMedia(this.dynamodb);
    console.log('init dynamo wrappers', this.dynamodb, this.DyanmoUsers, this.DyanmoMedia);

    // RDS
    this.rds = new AWS.RDS();
    this.RdsUsers = new rdsUsers(this.rds);
    this.RdsMedia = new rdsMedia(this.rds);
    console.log('init rds wrappers', this.rds, this.RdsUsers, this.RdsMedia);
};

module.exports = AwsWrapper;