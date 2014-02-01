Demos using AWS with Node.JS and an AngularJS frontend
====================

This project's goal is to build small demo utilities that should be a
reasonable approximation of what we might see in an application that uses
the aws-sdk node.js module. AngularJS will serve as a front-end, with no
direct access to the aws libraries, and will use the node server to handle
all requests.

[Here's a temporary EBS instance running to demonstrate this](http://awsnodeangulardemos-env.elasticbeanstalk.com/).
It will be taken down in a few weeks, so don't get so attached to it.

ToC
---------------------

1. [Data Set](#dataset)
1. [DynamoDB](#dynamo)
1. [RDS](#rds)
1. [S3](#s3)
1. [SES](#ses)
1. [SNS](#sns)
1. [AngularJS](#angularjs)
1. [Elastic Beanstalk Deployment](#ebs_deploy)


<a name="dataset">Data Set</a>
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

<a name="dynamo">DynamoDB</a>
---------------------

Using the above schema, we set up a couple Dynamo tables. These can be treated in a
similar way to how you would treat any NoSQL database, except that Dynamo's API is
a bit onerous. I'm not sure why they insisted on not using standard JSON, but a converter
can be easily written to go back and forth between Dynamo's JSON format, and the normal
JSON that you'll want to work with. [Take a look at how the converter works](utils/dynamo_to_json.js).
Also, [check out some other dynamo code here](dynamo-demo/users.js).

There are just a couple of things going on in the DynamoDB demo. We have a method for
getting all the users, adding or updating a user (if the user has the same id), and
deleting a user. The `getAll` method does a `scan` on the Dynamo table, but only returns
100 results. It's a good idea to limit your results, and then load more as the user requests.

I also had to write a little converter to quickly translate between standard JSON data,
the format that AWS expects in these requests, and what it returns in results. I have no
idea why Amazon's format is so verbose, but it's relatively easy to write a converter for it.
It would be nice if they rolled something like this into their SDK, and just handled it
auto-magically for you, but such is life.

The `addUpdateUser` method takes in a user object, generates an id based off of the hash of
the email, then does a `putItem` to Dynamo, which will either create a new entry, or update
a current one. Finally, `deleteUser` runs the Dynamo API method `deleteItem`.

<a name="rds">RDS</a>
---------------------

This one's pretty simple, RDS gives you an olde fashioned SQL database server. It's
so common that I had to add the 'e' to the end of old, to make sure you understand
just how common this is. Pick your favorite database server, fire it up, then use
whichever node module works best for you. There's a bit of setup and configuration,
which I'll dive into in the blog post. [Here's the code.](rds-demo/users.js)



<a name="s3">S3</a>
---------------------

This one was a little tricky, but basically, we're just generating a unique random
key and using that to keep track of the object. We then generate both GET and PUT
URLs on the node.js server, so that the client does not have access to our AWS auth
tokens. The client only gets passed the URLs it needs. [Check out the code!](s3-demo/s3_utils.js)

There are actually two versions of the S3 demo, the DynamoDB version, and the S3 version.
For Dynamo, we use the [Dynamo media.js](dynamo-demo/media.js) file. Similarly, for the
RDS version, we use the [RDS media.js](rds-demo/media.js).

Looking first at the Dynamo version, `getAll` is not very useful, since we don't really
want to see everyone's media, I don't think this even gets called. `getUserMedia`
is more useful, we do a `scan` on Dynamo, filtering on the user id.

<a name="ses">SES</a>
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

<a name="sns">SNS</a>
---------------------

We're also listening for SNS messages to tell us if there's an email that's bounced or
has a complaint. In the case that we get something, we immediately add an entry to the
`Emails` table with a count of 1000. We will never attempt to send to that email address
again.

<a name="angularjs">AngularJS</a>
---------------------

The AngularJS code for this is pretty straightforward. Essentially, we just have a
service for our socket.io connection, and to keep track of data coming in from Dynamo
and RDS. There are controllers for each of the different views that we have, and they
also coordinate with the services. We are also leveraging Angular's built-in events
system, to inform various pieces about when things get updated.

<a name="ebs_deploy">Elastic Beanstalk Deployment</a>
---------------------

[Here's the AWS doc on setting up deployment with git integration straight from your project](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.sdlc.html).
It's super simple. What's not so straightforward, however, is that you need to make sure
that the ports are set up correctly. If you can just run your node server on port 80,
that's the easiest thing, but I don't think that the instance that you get from Amazon
will allow you to do that. So, you'll need to configure your LoadBalancer to forward port
80 to whatever port you're running on, then open that port in the EC2 security group that
the Beanstalk environment is running in.