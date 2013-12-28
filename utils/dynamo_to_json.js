/**
 * Created by ejf3 on 12/27/13.
 */

ArrayConverter = function (data_in) {
    var data_out = [];
    for (var i = 0; i < data_in.length; i++)
        data_out.push(ObjectConverter(data_in[i]));
    return data_out;
};

ObjectConverter = function (data_in) {
    var data_out = {}

    Object.keys(data_in).forEach(function (key) {
        var val = data_in[key];
        if (!!val["S"]) {
            data_out[key] = val["S"];
        } else if (!!val["N"]) {
            data_out[key] = parseInt(val["N"]);
        } else if (!!val["B"]) {
            data_out[key] = (val["B"].toLowerCase() == "true")
        } else if (!!val["SS"]) {
            data_out[key] = val["SS"];
        } else if (!!val["NS"]) {
            var val_arr = [];
            for (var j = 0; j < val["NS"].length; j++) {
                val_arr.push(parseInt(val["NS"][j]));
            }
            data_out[key] = val_arr;
        } else if (!!val["BS"]) {
            var val_arr = [];
            for (var j = 0; j < val["BS"].length; j++) {
                val_arr.push((val["BS"][j].toLowerCase() == "true"));
            }
            data_out[key] = val_arr;
        }
    });

    return data_out;
};

ConvertFromJson = function (data_in) {
    var data_out = {};

    Object.keys(data_in).forEach(function (key) {
        var subObj = {};
        var val = data_in[key];
        // if
        if (!(typeof val === 'undefined' || (!!!val && typeof val !== 'boolean')))
            subObj = null;

        if (typeof val === 'boolean')
            subObj = {"B": val.toString()};
        else if (typeof val === 'string')
            subObj = {"S": val.toString()};
        else if (typeof val === 'number')
            subObj = {"N": val.toString()};
        else if (typeof val === 'object') {
            if (Array.isArray(val) && val.length >= 1) {
                var subObjKey = null;
                if (typeof val[0] === 'boolean')
                    subObjKey = "BS";
                else if (typeof val[0] === 'string')
                    subObjKey = "SS";
                else if (typeof val[0] === 'number')
                    subObjKey = "NS";

                if (!!subObjKey) {
                    var subObjArr = [];
                    for (var i = 0; i < val.length; i++) {
                        subObjArr.push(val.toString());
                    }
                    subObj[subObjKey] = subObjArr;
                }
            }
        } else
            subObj = null;

        if (!!subObj)
            data_out[key] = subObj;
    });

    return data_out;
}

module.exports = {
    ArrayConverter: ArrayConverter,
    ObjectConverter: ObjectConverter,
    ConvertFromJson: ConvertFromJson
}