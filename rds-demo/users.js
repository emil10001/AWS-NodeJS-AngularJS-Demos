/**
 * Created by ejf3 on 12/28/13.
 */
var c = require('../constants')
    , converter = require('../utils/dynamo_to_json.js');

Users = function (rds) {
    this.rds = rds;
};
module.exports = Users;