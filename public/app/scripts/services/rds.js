/**
 * Created by ejf3 on 1/5/14.
 */
myServices.service('RdsService', function RdsService($rootScope, Constants, SocketService) {
    var self = this;
    this.users = [];

    $rootScope.$on(Constants.RDS_GET_USERS, function (event, data) {
        console.log(Constants.RDS_GET_USERS, data);
        self.users = data;
        $rootScope.$broadcast(Constants.RDS_SERVICE_UPDATE);
    });

    $rootScope.$on(Constants.RDS_UPDATE_USER, function (event, data) {
        SocketService.getRdsUsers();
    });
    $rootScope.$on(Constants.RDS_DELETE_USER, function (event, data) {
        SocketService.getRdsUsers();
    });

    SocketService.getRdsUsers();
});