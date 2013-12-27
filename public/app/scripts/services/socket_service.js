/**
 * Created by ejf3 on 12/24/13.
 */
myServices.service('SocketService', function SocketService($rootScope, Constants) {
    var self = this;
    this.socketCon = {};

    this.getUsers = function(){
        self.socketCon.emit(Constants.DYN_GET_USERS);
    };

    // Socket.io disconnect
    this.disconnect = function() {
        self.socketCon.disconnect();
    };

    // Socket.io connect
    (function() {
        // Connect to Socket.io server
        self.socketCon = io.connect('http://127.0.0.1:3001');

        // Connection to Server made
        self.socketCon.on(Constants.CONNECTED, function() {
            $rootScope.$broadcast(Constants.CONNECTED);
        });

        // Server initialized data
        self.socketCon.on(Constants.DYN_GET_USERS, function(data) {
            $rootScope.$broadcast(Constants.DYN_GET_USERS, data);
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
