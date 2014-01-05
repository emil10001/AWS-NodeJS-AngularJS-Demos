/**
 * Created by ejf3 on 12/24/13.
 */
myServices.service('SocketService', function SocketService($rootScope, Constants) {
    var self = this;
    this.socketCon = {};

    /**** Dynamo *****/
    this.getDynUsers = function(){
        self.socketCon.emit(Constants.DYN_GET_USERS);
    };

    this.putDynUser = function(user){
        self.socketCon.emit(Constants.DYN_UPDATE_USER, user);
    };

    this.deleteUser = function(id){
        self.socketCon.emit(Constants.DYN_DELETE_USER, id);
    };


    /**** RDS *****/
    this.getRdsUsers = function(){
        self.socketCon.emit(Constants.RDS_GET_USERS);
    };

    this.putRdsUser = function(user){
        self.socketCon.emit(Constants.RDS_UPDATE_USER, user);
    };

    this.deleteRdsUser = function(id){
        self.socketCon.emit(Constants.RDS_DELETE_USER, id);
    };

    /**** S3 *****/
    this.getUrlPair = function(){
        self.socketCon.emit(Constants.S3_GET_URLPAIR);
    };


    // Socket.io disconnect
    this.disconnect = function() {
        self.socketCon.disconnect();
    };

    // Socket.io connect
    (function() {
        // Connect to Socket.io server
        self.socketCon = io.connect('http://127.0.0.1:3001');

        /**** Dynamo *****/
        // Server returned data, inform listeners
        self.socketCon.on(Constants.DYN_GET_USERS, function(data) {
            $rootScope.$broadcast(Constants.DYN_GET_USERS, data);
        });
        // Server updated data, inform listeners
        self.socketCon.on(Constants.DYN_UPDATE_USER, function() {
            $rootScope.$broadcast(Constants.DYN_UPDATE_USER);
        });
        self.socketCon.on(Constants.DYN_DELETE_USER, function() {
            $rootScope.$broadcast(Constants.DYN_DELETE_USER);
        });

        /**** RDS *****/
        // Server returned data, inform listeners
        self.socketCon.on(Constants.RDS_GET_USERS, function(data) {
            $rootScope.$broadcast(Constants.RDS_GET_USERS, data);
        });
        // Server updated data, inform listeners
        self.socketCon.on(Constants.RDS_UPDATE_USER, function() {
            $rootScope.$broadcast(Constants.RDS_UPDATE_USER);
        });
        self.socketCon.on(Constants.RDS_DELETE_USER, function() {
            $rootScope.$broadcast(Constants.RDS_DELETE_USER);
        });

        /**** S3 *****/
        // Server returned data, inform listeners
        self.socketCon.on(Constants.S3_GET_URLPAIR, function(data) {
            $rootScope.$broadcast(Constants.S3_GET_URLPAIR, data);
        });

        /**** Housekeeping *****/
        // Connection to Server made
        self.socketCon.on(Constants.CONNECTED, function() {
            $rootScope.$broadcast(Constants.CONNECTED);
        });
        // Disconnected
        self.socketCon.on('end', function() {
            $rootScope.$broadcast('disconnect');
        });
        self.socketCon.on('error', function() {
            $rootScope.$broadcast('disconnect');
        });
        self.socketCon.on('reconnecting', function() {
            $rootScope.$broadcast('disconnect');
        })
    })();


});
