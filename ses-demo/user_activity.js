/**
 * Created by ejf3 on 1/12/14.
 */
var c = require('../constants');

UserActivity = function (ses, dynamoMedia) {
    this.ses = ses;
    this.dynamoMedia = dynamoMedia;
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
        self.dynamoMedia.getUserMediaForEmail(user.id, function(userMedia, err){
            if (!!err){
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


    };

};

function getHtmlBodyFor(user, userMedia) {
    var title = "<h1>" + user.name + "'s media</h1>"
    var imgs = "";

    for (var i = 0; i < userMedia.length; i++) {
        imgs += "<br><img src=" + userMedia[i].url + " width=\"300\">"
    }

    return title + imgs;
}

module.exports = UserActivity;