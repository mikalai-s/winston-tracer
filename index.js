'use strict';

var winston = require('winston');


function Tracer() {
    this.winston = winston;
    this.config = [];
}

Tracer.prototype.get = function(tag) {
    var tracer = winston.loggers.add(tag, { console: { level: 'info' } });
    this.configure(this.config);
    return tracer;
};

Tracer.prototype.configure = function(config) {
    this.config = config || [];
    var loggerTags = Object.keys(winston.loggers.loggers);
    loggerTags.forEach(tag => {
        this.config.forEach(cfg => {
            var match = tag.match(new RegExp(cfg.pattern, 'i'));
            if (match && match.length) {
                if (!cfg.getOptions) {
                    throw new Error('Tracer configuration doesn\'t have "getOptions(tag)" function');
                }
                var config = cfg.getOptions(tag);
                if (!config) {
                    throw new Error(`"getOptions('${tag}')" returned unexpected value`);
                }
                winston.loggers.loggers[tag].configure(config);
            }
        });
    });
};


module.exports = new Tracer();