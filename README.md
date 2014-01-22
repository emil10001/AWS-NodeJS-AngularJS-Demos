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

Using the above schema, we set up a couple Dynamo tables. These can be treated in a
similar way to how you would treat any NoSQL database, except that Dynamo's API is
a bit onerous. I'm not sure why they insisted on not using standard JSON, but a converter
can be easily written to go back and forth between Dynamo's JSON format, and the normal
JSON that you'll want to work with. [Take a look at how the converter works](utils/dynamo_to_json.js).
Also, [check out some other dynamo code here](dynamo-demo/users.js).

RDS
---------------------

This one's pretty simple, RDS gives you an olde fashioned SQL database server. It's
so common that I had to add the 'e' to the end of old, to make sure you understand
just how common this is. Pick your favorite database server, fire it up, then use
whichever node module works best for you. There's a bit of setup and configuration,
which I'll dive into in the blog post. [Here's the code.](rds-demo/users.js)

S3
---------------------

This one was a little tricky, but basically, we're just generating a unique random
key and using that to keep track of the object. We then generate both GET and PUT
URLs on the node.js server, so that the client does not have access to our AWS auth
tokens. The client only gets passed the URLs it needs. [Check out the code!](s3-demo/s3_utils.js)

SES
---------------------

SES uses another DynamoDB table to track emails that have been sent. We want
to ensure that users have the ability to unsubscribe, and we don't want people
sending them multiple messages. Here's the schema for the Dynamo table:

     Emails: {
         email: "steve@example.com",
         count: 1
     }

That's it! We're just going to check if the email is in that table, and what the
count is before doing anything, then update the record after the email has been sent.
[Take a look at how it works.](ses-demo/user_activity.js)

SNS
---------------------

We're also listening for SNS messages to tell us if there's an email that's bounced or
has a complaint. In the case that we get something, we immediately add an entry to the
`Emails` table with a count of 1000. We will never attempt to send to that email address
again.

AngularJS
---------------------

The AngularJS code for this is pretty straightforward. Essentially, we just have a
service for our socket.io connection, and to keep track of data coming in from Dynamo
and RDS. There are controllers for each of the different views that we have, and they
also coordinate with the services. We are also leveraging Angular's built-in events
system, to inform various pieces about when things get updated.