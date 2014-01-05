/**
 * Created by ejf3 on 1/5/14.
 */
myServices.service('DynamoService', function DynamoService($rootScope, Constants, SocketService) {
    var self = this;
    this.users = [];

    this.calcId = function(){
        if (!this.users)
            return 0;
        if (this.users.length < 1)
            return 0;

        var retVal = -1;
        for (var i=0; i<this.users.length; i++){
            if (this.users[i].id > retVal)
                retVal = this.users[i].id;
        }

        return retVal + 1;
    }

    $rootScope.$on(Constants.DYN_GET_USERS, function (event, data) {
        console.log(Constants.DYN_GET_USERS, data);
        self.users = data;
        $rootScope.$broadcast(Constants.DYN_SERVICE_UPDATE);
    });

    $rootScope.$on(Constants.DYN_UPDATE_USER, function (event, data) {
        SocketService.getDynUsers();
    });
    $rootScope.$on(Constants.DYN_DELETE_USER, function (event, data) {
        SocketService.getDynUsers();
    });

    SocketService.getDynUsers();
});