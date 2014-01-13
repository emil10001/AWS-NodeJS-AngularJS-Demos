/**
 * Created by ejf3 on 1/13/14.
 */
var c = require('../constants');

var Bounces = function (sns, ses, dynamoEmails) {
    this.sns = sns;
    this.ses = ses;
    this.dynamoEmails = dynamoEmails;
    var self = this;

    this.confirmSubscription = function(token){
        var params = {
            TopicArn: "arn:aws:sns:us-east-1:492000747399:aws-node-angular-demos",
            Token: token
        };

        self.sns.confirmSubscription(params, function(err, data){
            console.log("confirmed?",data,err);
        });
    };

    this.handleBounce = function(request){
        if ("SubscriptionConfirmation" === request.Type && !!request.Token){
            self.confirmSubscription(request.Token);
            return;
        }

        if ("Bounce" === request.notificationType && !!request.bounce){
            if (!!request.bounce.bouncedRecipients && !!request.bounce.bouncedRecipients.length > 0){
                for (var i=0; i<request.bounce.bouncedRecipients.length; i++){
                    self.dynamoEmails.silentUnsubscribe(request.bounce.bouncedRecipients[i].emailAddress);
                }
            }
        } else if ("Complaint" === request.notificationType && !!request.complaint){
            if (!!request.complaint.complainedRecipients && !!request.complaint.complainedRecipients.length > 0){
                for (var i=0; i<request.complaint.complainedRecipients.length; i++){
                    self.dynamoEmails.silentUnsubscribe(request.complaint.complainedRecipients[i].emailAddress);
                }
            }
        }
    };

};

module.exports = Bounces;