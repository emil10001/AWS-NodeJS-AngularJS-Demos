/**
 * Created by ejf3 on 1/12/14.
 */
var c = require('../constants');

var UserActivity = function (ses, dynamoMedia, dynamoEmails) {
    this.ses = ses;
    this.dynamoMedia = dynamoMedia;
    this.dynamoEmails = dynamoEmails;
    var self = this;

    var params = {IdentityType: "EmailAddress"};
    this.ses.listIdentities(params, function (err, data) {
        if (err) {
            console.log(err); // an error occurred
        } else {
            console.log(data); // successful response
        }
    });

    this.sendEmail = function (user, socket) {
        self.dynamoEmails.allowedToSend(user.email, function (allowed, err) {
            if (!!err) {
                console.log(err); // an error occurred
                socket.emit(c.SES_SEND_EMAIL, c.ERROR);
                return;
            }
            if (!allowed) {
                console.log("not allowed to send"); // an error occurred
                socket.emit(c.SES_SEND_EMAIL, "not allowed to send");
                return;
            }
            self.dynamoEmails.iterateEmail(user.email, function (data, err) {
                console.log("iterate email", data, err);
            });
            self.dynamoMedia.getUserMediaForEmail(user.id, function (userMedia, err) {
                if (!!err) {
                    console.log(err); // an error occurred
                    socket.emit(c.SES_SEND_EMAIL, c.ERROR);
                    return;
                }

                var params = {
                    Source: "ejohn@feigdev.com",
                    Destination: {
                        ToAddresses: [user.email]
                    },
                    Message: {
                        Subject: {
                            Data: user.name + "'s media"
                        },
                        Body: {
                            Text: {
                                Data: "please enable HTML to view this message"
                            },
                            Html: {
                                Data: getHtmlBodyFor(user, userMedia)
                            }
                        }
                    }
                };

                self.ses.sendEmail(params, function (err, data) {
                    if (err) {
                        console.log(err); // an error occurred
                        socket.emit(c.SES_SEND_EMAIL, c.ERROR);
                    } else {
                        console.log(data); // successful response
                        socket.emit(c.SES_SEND_EMAIL, c.SUCCESS);
                    }
                });

            });

        });


    };

};

function getHtmlBodyFor(user, userMedia) {
    var title = "<h1>" + user.name + "'s media</h1>"
    var imgs = "";
    var unsubscribe = "<br><small><a href=\"http://awsnodeangulardemos-env.elasticbeanstalk.com/#/ses\">Unsubscribe</a></small>"

    for (var i = 0; i < userMedia.length; i++) {
        imgs += "<br><img src=" + userMedia[i].url + " width=\"300\">"
    }

    return title + imgs + unsubscribe;
}

module.exports = UserActivity;