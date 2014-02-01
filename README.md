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

The `addUpdateUser` method takes in a user object, generates an id based off of the hash of
the email, then does a `putItem` to Dynamo, which will either create a new entry, or update
a current one. Finally, `deleteUser` runs the Dynamo API method `deleteItem`.

The following is a few methods that you'll find in the node.js code. Essentially,
the basics are there, and we spit the results out over a socket.io socket. The socket
will be used throughout most of the examples.

<h3>Initialize</h3>

<pre class="pre-scrollable">
AWS.config.region = &quot;us-east-1&quot;;
AWS.config.apiVersions = {
    dynamodb: '2012-08-10',
};
var dynamodb = new AWS.DynamoDB();
</pre>

<h3>Get all the users</h3>

<pre class="pre-scrollable">
var getAll = function (socket) {
    dynamodb.scan({
        &quot;TableName&quot;: c.DYN_USERS_TABLE,
        &quot;Limit&quot;: 100
    }, function (err, data) {
    if (err) {
        socket.emit(c.DYN_GET_USERS, &quot;error&quot;);
    } else {
        var finalData = converter.ArrayConverter(data.Items);
        socket.emit(c.DYN_GET_USERS, finalData);
    }
    });
};
</pre>

<h3>Insert or update a user</h3>

<pre class="pre-scrollable">
var addUpdateUser = function (user, socket) {
    user.id = genIdFromEmail(user.email);
    var userObj = converter.ConvertFromJson(user);
    dynamodb.putItem({
        &quot;TableName&quot;: c.DYN_USERS_TABLE,
        &quot;Item&quot;: userObj
    }, function (err, data) {
        if (err) {
            socket.emit(c.DYN_UPDATE_USER, &quot;error&quot;);
        } else {
           socket.emit(c.DYN_UPDATE_USER, data);
        }
    });
};
</pre>

<h3>Delete a user</h3>

<pre class="pre-scrollable">
var deleteUser = function (userId, socket) {
    var userObj = converter.ConvertFromJson({id: userId});
    dynamodb.deleteItem({
        &quot;TableName&quot;: c.DYN_USERS_TABLE,
        &quot;Key&quot;: userObj
    }, function (err, data) {
        if (err) {
            socket.emit(c.DYN_DELETE_USER, &quot;error&quot;);
        } else {
            socket.emit(c.DYN_DELETE_USER, data);
        }
    });
};
</pre>


<a name="rds">RDS</a>
---------------------

This one's pretty simple, RDS gives you an olde fashioned SQL database server. It's
so common that I had to add the 'e' to the end of old, to make sure you understand
just how common this is. Pick your favorite database server, fire it up, then use
whichever node module works best for you. There's a bit of setup and configuration,
which I'll dive into in the blog post. [Here's the code.](rds-demo/users.js)

I'm not sure that there's even much to talk about with this one. This example uses
the `mysql` npm module, and is really, really straightforward. We need to start off
by connecting to our DB, but that's about it. The only thing you'll need to figure
out is the deployment of RDS, and making sure that you're able to connect to it, but
that's a very standard topic, that I'm not going ot cover here since there's nothing
specific to node.js or AngularJS.

The following is a few methods that you'll find in the node.js code. Essentially,
the basics are there, and we spit the results out over a socket.io socket. The socket
will be used throughout most of the examples.

<h3>Initialize</h3>

<pre class="pre-scrollable">
AWS.config.region = &quot;us-east-1&quot;;
AWS.config.apiVersions = {
    rds: '2013-09-09',
};
var rds_conf = {
    host: mysqlHost,
    database: "aws_node_demo",
    user: mysqlUserName,
    password: mysqlPassword
};
var mysql = require('mysql');
var connection = mysql.createConnection(rds_conf);
var rds = new AWS.RDS();
connection.connect(function(err){
    if (err)
        console.error(&quot;couldn't connect&quot;,err);
    else
        console.log(&quot;mysql connected&quot;);
});
</pre>

<h3>Get all the users</h3>

<pre class="pre-scrollable">
var getAll = function(socket){
    var query = this.connection.query('select * from users;',
      function(err,result){
        if (err){
            socket.emit(c.RDS_GET_USERS, c.ERROR);
        } else {
            socket.emit(c.RDS_GET_USERS, result);
        }
    });
};
</pre>

<h3>Insert or update a user</h3>

<pre class="pre-scrollable">
var addUpdateUser = function(user, socket){
    var query = this.connection.query('INSERT INTO users SET ?',
      user, function(err, result) {
        if (err) {
            socket.emit(c.RDS_UPDATE_USER, c.ERROR);
        } else {
            socket.emit(c.RDS_UPDATE_USER, result);
        }
    });
};
</pre>

<h3>Delete a user</h3>

<pre class="pre-scrollable">
var deleteUser = function(userId, socket){
    var query = self.connection.query('DELETE FROM users WHERE id = ?',
      userId, function(err, result) {
        if (err) {
            socket.emit(c.RDS_DELETE_USER, c.ERROR);
        } else {
            socket.emit(c.RDS_DELETE_USER, result);
        }
    });
};
</pre>

<a name="s3">S3</a>
---------------------

This one was a little tricky, but basically, we're just generating a unique random
key and using that to keep track of the object. We then generate both GET and PUT
URLs on the node.js server, so that the client does not have access to our AWS auth
tokens. The client only gets passed the URLs it needs. [Check out the code!](s3-demo/s3_utils.js)

The [s3_utils.js](s3-demo/s3_utils.js) file is very simple. `listBuckets` is a method to
verify that you're up and running, and lists out your current s3 buckets. Next up,
`generateUrlPair` is simple, but important. Essentially, what we want is a way for the
client to push things up to S3, without having our credentials. To accomplish this, we can
generate signed URLs on the server, and pass those back to the client, for the client to
use. This was a bit tricky to do, because there are a lot of important details, like making
certain that the client uses the same exact content type when it attempts to PUT the object.
We're also making it world readable, so instead of creating a signed GET URL, we're just
calculating the publicly accessible GET URL and returning that. The key for the object is
random, so we don't need to know anything about the object we're uploading ahead of time.
(However, this demo assumes that only images will be uploaded, for simplicity.) Finally,
`deleteMedia` is simple, we just use the S3 API to delete the object.

There are actually two versions of the S3 demo, the DynamoDB version, and the S3 version.
For Dynamo, we use the [Dynamo media.js](dynamo-demo/media.js) file. Similarly, for the
RDS version, we use the [RDS media.js](rds-demo/media.js).

Looking first at the Dynamo version, `getAll` is not very useful, since we don't really
want to see everyone's media, I don't think this even gets called. The methods here are
very similar to those in user.js, we leverage the `scan`, `putItem`, and `deleteItem`
APIs.

The same is true of the RDS version with respect to our previous RDS example. We're just
making standard SQL calls, just like we did before.

You'll need to modify the CORS settings on your S3 bucket for this to work. Try the following configuration:

<pre>
    &lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
    &lt;CORSConfiguration xmlns=&quot;http://s3.amazonaws.com/doc/2006-03-01/&quot;&gt;
        &lt;CORSRule&gt;
            &lt;AllowedOrigin&gt;*&lt;/AllowedOrigin&gt;
            &lt;AllowedOrigin&gt;http://localhost:3000&lt;/AllowedOrigin&gt;
            &lt;AllowedMethod&gt;GET&lt;/AllowedMethod&gt;
            &lt;AllowedMethod&gt;PUT&lt;/AllowedMethod&gt;
            &lt;AllowedMethod&gt;POST&lt;/AllowedMethod&gt;
            &lt;AllowedMethod&gt;DELETE&lt;/AllowedMethod&gt;
            &lt;MaxAgeSeconds&gt;3000&lt;/MaxAgeSeconds&gt;
            &lt;AllowedHeader&gt;Content-*&lt;/AllowedHeader&gt;
            &lt;AllowedHeader&gt;Authorization&lt;/AllowedHeader&gt;
            &lt;AllowedHeader&gt;*&lt;/AllowedHeader&gt;
        &lt;/CORSRule&gt;
    &lt;/CORSConfiguration&gt;
</pre>

The following is a few methods that you'll find in the node.js code. Essentially,
the basics are there, and we spit the results out over a socket.io socket. The socket
will be used throughout most of the examples.

<h3>Initialize</h3>

<pre class="pre-scrollable">
AWS.config.region = &quot;us-east-1&quot;;
AWS.config.apiVersions = {
    s3: '2006-03-01',
};
var s3 = new AWS.S3();

</pre>

<h3>Generate signed URL pair</h3>

The GET URL is public, since that's how we want it. We could have easily
generated a signed GET URL, and kept the objects in the bucket private.

<pre class="pre-scrollable">
var generateUrlPair = function (socket) {
    var urlPair = {};
    var key = genRandomKeyString();
    urlPair[c.S3_KEY] = key;
    var putParams = {Bucket: c.S3_BUCKET, Key: key, ACL: &quot;public-read&quot;, ContentType: &quot;application/octet-stream&quot; };
    s3.getSignedUrl('putObject', putParams, function (err, url) {
        if (!!err) {
            socket.emit(c.S3_GET_URLPAIR, c.ERROR);
            return;
        }
        urlPair[c.S3_PUT_URL] = url;
        urlPair[c.S3_GET_URL] = &quot;https://aws-node-demos.s3.amazonaws.com/&quot; + qs.escape(key);
        socket.emit(c.S3_GET_URLPAIR, urlPair);
    });
};
</pre>

<h3>Delete Object from bucket</h3>

<pre class="pre-scrollable">
var deleteMedia = function(key, socket) {
    var params = {Bucket: c.S3_BUCKET, Key: key};
    s3.deleteObject(params, function(err, data){
        if (!!err) {
            socket.emit(c.S3_DELETE, c.ERROR);
            return;
        }
        socket.emit(c.S3_DELETE, data);
    });
}
</pre>

### Client-side send file

    var sendFile = function(file, url, getUrl) {
        var xhr = new XMLHttpRequest();
        xhr.file = file; // not necessary if you create scopes like this
        xhr.addEventListener('progress', function(e) {
            var done = e.position || e.loaded, total = e.totalSize || e.total;
            var prcnt = Math.floor(done/total*1000)/10;
            if (prcnt % 5 === 0)
                console.log('xhr progress: ' + (Math.floor(done/total*1000)/10) + '%');
        }, false);
        if ( xhr.upload ) {
            xhr.upload.onprogress = function(e) {
                var done = e.position || e.loaded, total = e.totalSize || e.total;
                var prcnt = Math.floor(done/total*1000)/10;
                if (prcnt % 5 === 0)
                    console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done/total*1000)/10) + '%');
            };
        }
        xhr.onreadystatechange = function(e) {
            if ( 4 == this.readyState ) {
                console.log(['xhr upload complete', e]);
                // emit the 'file uploaded' event
                $rootScope.$broadcast(Constants.S3_FILE_DONE, getUrl);
            }
        };
        xhr.open('PUT', url, true);
        xhr.setRequestHeader("Content-Type","application/octet-stream");
        xhr.send(file);
    }


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

Sending email with SES is fairly simple, however getting it to production requires
jumping through a couple extra hoops. Basically, you'll need to use [SNS](#sns) to
keep track of bounces and complaints.

What we're doing here is for a given user, grab all their media, package it up in some
auto-generated HTML, then use the `sendEmail` API call to actually send the message.
We are also keeping track of the number of times we send each user an email. Since this
is just a stupid demo that I'm hoping can live on auto-pilot for a bit, I set a very low
limit on the number of emails that may be sent to a particular address. Emails also
come with a helpful 'ubsubscribe' link.

The following is a few methods that you'll find in the node.js code. Essentially,
the basics are there, and we spit the results out over a socket.io socket. The socket
will be used throughout most of the examples.

<h3>Initialize</h3>

<pre class="pre-scrollable">
AWS.config.region = &quot;us-east-1&quot;;
AWS.config.apiVersions = {
    sns: '2010-03-31',
    ses: '2010-12-01'
};
var ses = new AWS.SES();
</pre>

<h3>Send Email</h3>

<pre class="pre-scrollable">
var sendEmail = function (user, userMedia, socket) {
    var params = {
        Source: &quot;me@mydomain.com&quot;,
        Destination: {
            ToAddresses: [user.email]
        },
        Message: {
            Subject: {
                Data: user.name + &quot;'s media&quot;
            },
            Body: {
                Text: {
                    Data: &quot;please enable HTML to view this message&quot;
                },
                Html: {
                    Data: getHtmlBodyFor(user, userMedia)
                }
            }
        }
    };
    ses.sendEmail(params, function (err, data) {
        if (err) {
            socket.emit(c.SES_SEND_EMAIL, c.ERROR);
        } else {
            socket.emit(c.SES_SEND_EMAIL, c.SUCCESS);
        }
    });
};
</pre>

<a name="sns">SNS</a>
---------------------

We're also listening for SNS messages to tell us if there's an email that's bounced or
has a complaint. In the case that we get something, we immediately add an entry to the
`Emails` table with a count of 1000. We will never attempt to send to that email address
again.

I have my SES configured to tell SNS to send REST requests to my service, so that I can
simply parse out the HTML, and grab the data that I need that way. Some of this is done in
[app.js](app.js), and the rest is handled in [bounces.js](ses-demo/bounces.js). In bounces,
we first need to verify with SNS that we're receiving the requests and handling them properly.
That's what `confirmSubscription` is all about. Then, in `handleBounce` we deal with any
complaints and bounces by unsubscribing the email.

<a name="angularjs">AngularJS</a>
---------------------

The AngularJS code for this is pretty straightforward. Essentially, we just have a
service for our socket.io connection, and to keep track of data coming in from Dynamo
and RDS. There are controllers for each of the different views that we have, and they
also coordinate with the services. We are also leveraging Angular's built-in events
system, to inform various pieces about when things get updated.

There's nothing special about the AngularJS code here, we use socket.io to shuffle data
to and from the server, then dump it to the UI with the normal bindings. I do use Angular
events which I will discuss in a separate post.

<a name="ebs_deploy">Elastic Beanstalk Deployment</a>
---------------------

[Here's the AWS doc on setting up deployment with git integration straight from your
project](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.sdlc.html).
It's super simple. What's not so straightforward, however, is that you need to make sure
that the ports are set up correctly. If you can just run your node server on port 80,
that's the easiest thing, but I don't think that the instance that you get from Amazon
will allow you to do that. So, you'll need to configure your LoadBalancer to forward port
80 to whatever port you're running on, then open that port in the EC2 Security Group that
the Beanstalk environment is running in.


A couple of other notes about the deployment. First, you're going to need to make sure that the node.js version is set correctly, AWS Elastic Beanstalk currently supports up to v0.10.21, but runs an earlier version by default. You will also need to add several environment variables from the console. I use the following parameters:

 * AWS_ACCESS_KEY_ID
 * AWS_SECRET_ACCESS_KEY
 * AWS_RDS_HOST
 * AWS_RDS_MYSQL_USERNAME
 * AWS_RDS_MYSQL_PASSWORD

Doing this allowed me to not ever commit sensitive data. To get there, log into your AWS console, then go to Elastic Beanstalk and select your environment. Navigate to 'Configuration', then to 'Software Configuration'. From here you can set the node.js version, and add environment variables. You'll need to add the custom names above along with the values. If you're deploying to your own box, you'll need to at least export the above environment variables:

<pre>
export AWS_ACCESS_KEY_ID='AKID'
export AWS_SECRET_ACCESS_KEY='SECRET'
export AWS_RDS_HOST='hostname'
export AWS_RDS_MYSQL_USERNAME='username'
export AWS_RDS_MYSQL_PASSWORD='pass'
</pre>

Once again, do use the git command-line deployment tools, as it allows you to deploy in
one line after a `git commit`, using `git aws.push`.
