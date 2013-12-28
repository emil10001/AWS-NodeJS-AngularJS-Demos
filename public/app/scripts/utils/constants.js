/**
 * Created by ejf3 on 11/20/13.
 */

'use strict';

myUtils.factory('Constants', function () {
    function Constants() {
    }

    // generic strings
    Constants.CONNECTED = 'connected!';
    Constants.ERROR = 'error';

    // dynamo request constants
    Constants.DYN_GET_USERS = 'dynamo_get_users';
    Constants.DYN_GET_MEDIA = 'dynamo_get_media';
    Constants.DYN_GET_USER_MEDIA = 'dynamo_get_user_media';
    Constants.DYN_GET_PRIVATE = 'dynamo_get_private';
    Constants.DYN_UPDATE_USER = 'dynamo_update_user';
    Constants.DYN_UPDATE_MEDIA = 'dynamo_update_media';
    Constants.DYN_DELETE_USER = 'dynamo_delete_user';
    Constants.DYN_DELETE_MEDIA = 'dynamo_delete_media';

    // dynamo tables
    Constants.DYN_USERS_TABLE = 'aws_node_demo_dynamo_users';
    Constants.DYN_MEDIA_TABLE = 'aws_node_demo_dynamo_media';

    return Constants;
});