Demos using AWS with Node.JS and an AngularJS frontend
====================

This is still very early, and only barely works.

This project's goal is to build small demo utilities that should be a
reasonable approximation of what we might see in an application that uses
the aws-sdk node.js module. AngularJS will serve as a front-end, with no
direct access to the aws libraries, and will use the node server to handle
all requests.

Data Set
---------------------

Both DynamoDB and RDS are going to use the same basic data set. It will be
a very simple set, with two tables that are JOINable. Here's the schema:

    Users: {
        id: 0,
        name: "Steve",
        email: "steve@example.com"
    }

    Media: {
        id: 0,
        uid: 0,
        url: "http://example.com/image.jpg",
        type: "image/jpg"
    }

The same schema will be used for both Dynamo and RDS, almost. RDS uses an
mkey field in the media table, to keep track of the key. Dynamo uses a string
id, which should be the key of the media object in S3.


DynamoDB
---------------------

RDS
---------------------

S3
---------------------

SES
---------------------

