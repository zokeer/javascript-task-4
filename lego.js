'use strict';

exports.isStar = false;
var priors = {
    filterIn: 5,
    sortBy: 4,
    select: 3,
    limit: 2,
    format: 1
};

function copyElem(elem) {
    var copied = {};
    for (var attr in elem) {
        if (elem.hasOwnProperty(attr)) {
            copied[attr] = elem[attr];
        }
    }

    return copied;
}

function copyCollection(collection) {
    var copiedCollection = [];
    collection.forEach(function (elem) {
        copiedCollection.push(copyElem(elem));
    });

    return copiedCollection;
}

exports.query = function (collection) {
    var copiedCollection = copyCollection(collection);
    var funcList = [].slice.call(arguments, 1);

    return funcList.sort(function (one, another) {
        return priors[another.name] - priors[one.name];
    })
    .reduce(function (changedCollection, func) {
        return func(changedCollection);
    }, copiedCollection);
};


exports.select = function () {
    var selectedFields = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (elem) {
            var changedElem = {};
            selectedFields.forEach(function (field) {
                if (field in elem) {
                    changedElem[field] = elem[field];
                }
            });

            return changedElem;
        });
    };
};


exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        return collection.filter(function (elem) {
            return values.indexOf(elem[property]) !== -1;
        });
    };
};


exports.sortBy = function (property, order) {
    var sign = order === 'asc' ? 1 : -1;

    return function sortBy(collection) {
        return collection.sort(function (one, another) {
            return sign * (one[property] > another[property] ? 1 : -1);
        });
    };
};

exports.format = function (property, formatter) {
    return function format(collection) {
        return collection.map(function (elem) {
            if (elem.hasOwnProperty(property)) {
                elem[property] = formatter(elem[property]);
            }

            return elem;
        });
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
