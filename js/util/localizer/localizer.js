define([
    'text!util/localizer/en-us.json',
    'text!util/localizer/de-de.json'
], function (enusJSON, dedeJSON) {
    var supportedLocales = ['en-us', 'de-de'];

    var localeMap = {
        'en-us' : enusJSON,
        'de-de' : dedeJSON
    };

    var api = {
        setLocale : function (locale) {
            if (supportedLocales.indexOf(locale) < 0) {
                console.log('WARNING: Locale ' + locale + ' not supported. ' +
                            'Defaulting to locale: en-us');
                locale = 'en-us';
            }

            api = $.extend(api, JSON.parse(localeMap[locale]));
        }
    };

    api.setLocale(localStorage.tossinLocale || 'en-us');

    return api;
});
