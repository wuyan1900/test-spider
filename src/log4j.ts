const log4js = require('log4js');
const configuer = {
    "appenders": {
      "console": {
        "type": "stdout"
      },
      "error": {
        "type": "dateFile",
        "filename": "log/error-",
        "pattern": ".yyyy-MM-dd.log",
        "maxLogSize": 10000000,
        "encoding": "utf-8",
        "alwaysIncludePattern": true,
        "layout": {
          "type": "pattern",
          "pattern": "[%d{ISO8601}][%5p  %z  %c] %m"
        },
        "compress": true
      }
    },
    "categories": {
      "default": {
        "appenders": [
          "console",
          "error"
        ],
        "level": "debug"
      }
    }
}

  
log4js.configure(configuer);
export const logger = log4js.getLogger();