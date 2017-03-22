'use strict';

const winston = require('winston');


class Tracer {
    constructor() {
        this.winston = winston;
        this.config = [];
    }

    get(tag) {
        const tracer = winston.loggers.add(tag, { console: { level: 'info' } });
        this.configure(this.config);
        return tracer;
    }

    configure(config) {
        this.config = config || [];
        const loggerTags = Object.keys(winston.loggers.loggers);
        loggerTags.forEach(tag => {
            this.config.forEach(cfg => {
                const match = tag.match(new RegExp(cfg.pattern, 'i'));
                if (match && match.length) {
                    if (!cfg.getOptions) {
                        throw new Error('Tracer configuration doesn\'t have "getOptions(tag)" function');
                    }
                    const config = cfg.getOptions(tag);
                    if (!config) {
                        throw new Error(`"getOptions('${tag}')" returned unexpected value`);
                    }
                    winston.loggers.loggers[tag].configure(config);
                }
            });
        });
    }
}


module.exports = new Tracer();