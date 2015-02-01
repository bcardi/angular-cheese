angular.module('cheese')
    .constant('Formats', {
        DATE: 'date',
        CIRCLE: 'circle',
        AMOUNT: 'amount'
    })
    .service('Formatter', ["Formats", "moment", function(Formats, moment) {
        var pad = function(value) {
            if (new String(value).length == 1) {
                return '0' + value;
            }
            return value;
        };
        return {
            format: function(type, format, data) {
                if (!type || !data) return data;

                if (type === Formats.DATE && !!format) {
                    var date = moment.utc(data).toDate();

                    var year = date.getFullYear();
                    var month = date.getMonth()+1;
                    var day = date.getDate();

                    switch (format) {
                        case 'yyyy-mm-dd':
                            data = year + '-' + pad(month) + '-' + pad(day);
                            break;
                        case 'mm/dd/yyyy':
                            data = pad(month) + '/' + pad(day) + '/' + year;
                            break;
                    }
                } else if (type === Formats.CIRCLE) {
                    return data.substring(0, 1).toUpperCase();
                } else if (type === Formats.AMOUNT) {
                    if (data) {
                        if (typeof data === 'string') {
                            data = parseFloat(data);
                        }
                        if (typeof data === 'number') {
                            data = (data < 100 ? data*100 : data);
                            data = '' + data.toFixed(2);
                            var temp = data.split('.')[0];
                            var decimal = data.split('.')[1];
                            data = '';

                            if (temp.length > 3) {
                                var i = temp.length-3;
                                for (; i >= 0; i=i-3) {
                                    data = (i > 0 ? ',' : '') + temp.substring(i, i+3) + data;
                                }
                            }
                            data = temp.substring(0, temp.length%3 == 0 ? 3 : temp.length%3) + data;
                            data = '$' + data + '.' + decimal;
                        }
                    }
                }
                return data;
            },
            formatClass: function(type, data) {
                if (!type || !data) return data;

                switch (type) {
                    case Formats.CIRCLE:
                        switch (data.toUpperCase()) {
                            case 'LOYALTY':
                                data = 'red';
                                break;

                            case 'CREDIT':
                                data = 'blue';
                                break;
                            case 'DEBIT':
                                data = 'green';
                                break;
                        }
                        break;
                }
                return data;
            }
        }
    }]);