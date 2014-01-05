/**
 * Created by ejf3 on 1/5/14.
 */
myServices.service('S3Service', function S3Service($rootScope, Constants) {

    this.sendFile = function(file, url, getUrl) {
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
                $rootScope.$broadcast(Constants.S3_FILE_DONE, getUrl);
            }
        };
        xhr.open('PUT', url, true);
        xhr.setRequestHeader("Content-Type","application/octet-stream");
        xhr.send(file);
    }
});