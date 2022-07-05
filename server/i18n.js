import i18n from 'i18n';

i18n.configure({
  // setup some locales - other locales default to en silently
  locales:['en', 'es', 'br'],

  // where to store json files - defaults to './locales' relative to modules directory
  directory: __dirname + '/locales',
  
  defaultLocale: 'es',
  
  // sets a custom cookie name to parse locale settings from  - defaults to NULL
  cookie: 'lang',
});

export default function(req, res, next) {

i18n.init(req, res);
  res.location('__', res.__);

  var current_locale = i18n.getLocale();

  return next();
};