/**
 * Created by ejf3 on 11/20/13.
 */

'use strict';

myUtils.factory('Constants', function () {
    return {
        // angular specific strings
        RDS_SERVICE_UPDATE: 'rds_service_update',
        DYN_SERVICE_UPDATE: 'dyn_service_update',

        // generic strings
        CONNECTED: 'connected!',
        ERROR: 'error',

        // dynamo request constants
        DYN_GET_USERS: 'dynamo_get_users',
        DYN_GET_MEDIA: 'dynamo_get_media',
        DYN_GET_USER_MEDIA: 'dynamo_get_user_media',
        DYN_GET_PRIVATE: 'dynamo_get_private',
        DYN_UPDATE_USER: 'dynamo_update_user',
        DYN_UPDATE_MEDIA: 'dynamo_update_media',
        DYN_DELETE_USER: 'dynamo_delete_user',
        DYN_DELETE_MEDIA: 'dynamo_delete_media',

        // dynamo tables
        DYN_USERS_TABLE: 'aws_node_demo_dynamo_users',
        DYN_MEDIA_TABLE: 'aws_node_demo_dynamo_media',

        // rds request constants
        RDS_GET_USERS: 'rds_get_users',
        RDS_GET_MEDIA: 'rds_get_media',
        RDS_GET_USER_MEDIA: 'rds_get_user_media',
        RDS_GET_PRIVATE: 'rds_get_private',
        RDS_UPDATE_USER: 'rds_update_user',
        RDS_UPDATE_MEDIA: 'rds_update_media',
        RDS_DELETE_USER: 'rds_delete_user',
        RDS_DELETE_MEDIA: 'rds_delete_media',

        // s3
        S3_BUCKET: 'aws-node-demos',
        S3_GET_URLPAIR: 's3_get_urlpair',
        S3_GET_URL: 's3_get_url',
        S3_PUT_URL: 's3_put_url',
        S3_KEY: 's3_key'

    }
});