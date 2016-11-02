'use strict';

exports.isStar = false;
var Priors = {
    'filterIn': 5,
    'select': 3,
    'sortBy': 4,
    'format': 1,
    'limit': 2
};

exports.query = function (collection) {
    var friends = JSON.parse(JSON.stringify(collection));
    var funcList = [];
    for (var i = 1; i < arguments.length; i++) {
        funcList.push(arguments[i]);
    }
    funcList.sort(function (one, another) {
        return Priors[another.name] - Priors[one.name];
    });
    funcList.forEach(function (func) {
        friends = func(friends);
    });

    return friends;
};


exports.select = function () {
    var selectedFields = Array.from(arguments);

    return function select(collection) {
        collection.forEach(function (elem) {
            var properties = Object.keys(elem);
            properties.forEach(function (property) {
                if (selectedFields.indexOf(property) === -1) {
                    delete elem[property];
                }
            });
        });

        return collection;
    };
};


exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        collection = collection.filter(function (elem) {
            if (elem.hasOwnProperty(property)) {
                return values.indexOf(elem[property]) !== -1;
            }

            return false;
        });

        return collection;
    };
};


exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        collection.sort(function (one, another) {
            if (one.hasOwnProperty(property) && another.hasOwnProperty(property)) {
                return one[property] > another[property] ? 1 : -1;
            }

            return 0;
        });
        if (order === 'desc') {
            return collection.reverse();
        }

        return collection;
    };
};

exports.format = function (property, formatter) {
    return function format(collection) {
        collection.forEach(function (elem) {
            if (elem.hasOwnProperty(property)) {
                elem[property] = formatter(elem[property]);
            }
        });

        return collection;
    };
};

exports.limit = function (count) {
    return function limit(collection) {
        return collection.slice(0, count);
    };
};

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.or = function () {
        return;
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.and = function () {
        return;
    };
}
