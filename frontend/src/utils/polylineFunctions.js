var defaultOptions = function (options) {
    if (typeof options === 'number') {
        // Legacy
        options = {
            precision: options
        };
    } else {
        options = options || {};
    }

    options.precision = options.precision || 5;
    options.factor = options.factor || Math.pow(10, options.precision);
    options.dimension = options.dimension || 2;
    return options;
};

function decode(encoded, options) {
    options = defaultOptions(options);

    var flatPoints = decodeDeltas(encoded, options);

    var points = [];
    for (var i = 0, len = flatPoints.length; i + (options.dimension - 1) < len;) {
        var point = [];

        for (var dim = 0; dim < options.dimension; ++dim) {
            point.push(flatPoints[i++]);
        }

        points.push(point);
    }

    return points;
}

function decodeDeltas(encoded, options) {
    options = defaultOptions(options);

    var lastNumbers = [];

    var numbers = decodeFloats(encoded, options);
    for (var i = 0, len = numbers.length; i < len;) {
        for (var d = 0; d < options.dimension; ++d, ++i) {
            numbers[i] = Math.round((lastNumbers[d] = numbers[i] + (lastNumbers[d] || 0)) * options.factor) / options.factor;
        }
    }

    return numbers;
}

function decodeFloats(encoded, options) {
    options = defaultOptions(options);

    var numbers = decodeSignedIntegers(encoded);
    for (var i = 0, len = numbers.length; i < len; ++i) {
        numbers[i] /= options.factor;
    }

    return numbers;
}

function decodeSignedIntegers(encoded) {
    var numbers = decodeUnsignedIntegers(encoded);

    for (var i = 0, len = numbers.length; i < len; ++i) {
        var num = numbers[i];
        numbers[i] = (num & 1) ? ~(num >> 1) : (num >> 1);
    }

    return numbers;
}

function decodeUnsignedIntegers(encoded) {
    var numbers = [];

    var current = 0;
    var shift = 0;

    for (var i = 0, len = encoded.length; i < len; ++i) {
        var b = encoded.charCodeAt(i) - 63;

        current |= (b & 0x1f) << shift;

        if (b < 0x20) {
            numbers.push(current);
            current = 0;
            shift = 0;
        } else {
            shift += 5;
        }
    }

    return numbers;
}

export {
   decode
};
