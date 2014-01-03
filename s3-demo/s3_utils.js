/**
 * Created by ejf3 on 12/29/13.
 * Some examples taken from: http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-examples.html#Amazon_Simple_Storage_Service__Amazon_S3_
 */
var c = require('../constants')
    , crypto = require('crypto')
    , qs = require('querystring');

S3Utils = function (s3) {
    this.listBuckets = function () {
        s3.listBuckets(function (err, data) {
            for (var index in data.Buckets) {
                var bucket = data.Buckets[index];
                console.log("Bucket: ", bucket);
            }
        });
    }

    this.generateUrlPair = function (socket) {
        var urlPair = {};
        var key = crypto.createHash('sha1').update(new Date().getTime().toString()).digest('base64');
        console.log('requesting url pair for', key);
        key = qs.escape(key);
        urlPair[c.S3_KEY] = key;
        var putParams = {Bucket: c.S3_BUCKET, Key: key, ACL: "public-read", ContentType: "application/octet-stream" };
        s3.getSignedUrl('putObject', putParams, function (err, url) {
            if (!!err) {
                console.error(c.S3_GET_URLPAIR, err);
                socket.emit(c.S3_GET_URLPAIR, c.ERROR);
                return;
            }
            urlPair[c.S3_PUT_URL] = url;
            urlPair[c.S3_GET_URL] = "https://aws-node-demos.s3.amazonaws.com/" + qs.escape(key);
            socket.emit(c.S3_GET_URLPAIR, urlPair);
        });
    };

};

module.exports = S3Utils;
