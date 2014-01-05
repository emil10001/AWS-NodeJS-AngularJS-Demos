'use strict';

myApp.controller('S3Ctrl', function ($scope, $http, SocketService, Constants) {
    delete $http.defaults.headers.common['Accept'];
    delete $http.defaults.headers.common['Accept-Encoding'];
    delete $http.defaults.headers.common['Accept-Language'];
    delete $http.defaults.headers.common['Connection'];
    delete $http.defaults.headers.common['Content-Length'];
    delete $http.defaults.headers.common['Content-Type'];
    delete $http.defaults.headers.common['DNT'];
    delete $http.defaults.headers.common['X-Requested-With'];
    $http.defaults.headers.put["Content-Type"] = "application/octet-stream";
    $http.defaults.useXDomain = true;

    /**
     * Note: You'll need to
     */

    $scope.fileInputChange = function () {
        SocketService.getUrlPair();
    };

    $scope.$on(Constants.S3_GET_URLPAIR, function (event, data) {
        console.log(Constants.S3_GET_URLPAIR, data);

        var fileInput = document.getElementById('fileInput');
        console.log('detected file', fileInput.files[0]);

        var url = data[Constants.S3_PUT_URL];
        var getUrl = data[Constants.S3_GET_URL];

        var file = fileInput.files[0];
        var userMedia = {
            uid: 1,
            name: file.name,
            type: file.type,
            url: getUrl
        };

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
                $scope.$apply(function(){
                    $scope.fileImgUrl = getUrl;
                });
            }
        };
        xhr.open('PUT', url, true);
        xhr.setRequestHeader("Content-Type","application/octet-stream");
        xhr.send(file);
    });
});
