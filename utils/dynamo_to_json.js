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

module.exports = {
    ArrayConverter: ArrayConverter,
    ObjectConverter: ObjectConverter
}