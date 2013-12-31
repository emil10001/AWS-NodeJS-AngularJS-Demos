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
        var fileInput = document.getElementById('fileInput');
        var fileInputArea = document.getElementById('fileInputArea');
        SocketService.getUrlPair();
    };

    $scope.$on(Constants.S3_GET_URLPAIR, function (event, data) {
        console.log(Constants.S3_GET_URLPAIR, data);

        var fileInput = document.getElementById('fileInput');
        var fileInputArea = document.getElementById('fileInputArea');

        var readerImg = new FileReader();
        var readerBuf = new FileReader();

        readerImg.onload = function (progress) {
            if (!!progress.error) {
                console.error("failed to read file", progress.error);
                return;
            }
            console.log("read file progress", progress);

            console.log("read file", fileInput.files[0]);
            fileDisplayArea.innerHTML = "";

            // Create a new image.
            var img = new Image();
            // Set the img src property using the data URL.
            img.src = progress.target.result;

            // Add the image to the page.
            fileDisplayArea.appendChild(img);
        }
        readerBuf.onload = function (progress) {
            if (!!progress.error) {
                console.error("failed to read file", progress.error);
                return;
            }
            console.log("read file", progress);
            var rawData = progress.target.result;

            var blob = new Blob([ rawData ]);
            $http.put(data[Constants.S3_PUT_URL], blob).error(function () {
                console.log("failed to upload for", data[Constants.S3_KEY]);
            }).success(function () {
                    console.log("upload succeeded for", data[Constants.S3_KEY]);
                });
        }

        readerBuf.readAsBinaryString(fileInput.files[0]);
        readerImg.readAsDataURL(fileInput.files[0]);


    });
});
