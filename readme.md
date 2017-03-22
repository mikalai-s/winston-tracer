The package is inspired by ASP.NET tracing API. The main ideas are:
 - Each component/module acquires a `tracing tag` to trace messages with
 - Tracing is configured in a single place - config file
 - Tracing configuration specifies transports to be used by a `tracing tag` for a given log level

I found it's a little clumsy to do with `winston`, so I created a wrapper that helps me to archive what I need.

Installation:

```bash
npm install winston-tracer --save
```

Resolving:

```js
const tracer = require('winston-tracer');
```

`tracer` object has the following API:
 - `winston` - property that references `winston` module
 - `get(tag)` - returns `winston` logger for a given `tracing tag` (i.e., label)
 - `configure(config)` - configures `winston` loggers

`config` is an array of the following objects structure:
 - `pattern` - regex to match tracing tags
 - `getOptions(tag)` - function that accept `tracing tag` as the parameter and returns `winston` configuration object

Below is example of how to use that.

Tracing is configured on an app start up:

```js
// get tracer
const tracer = require('winston-tracer');

// tracer configuration that enables verbose logging for all tracing tags
tracer.configure([
    {
        pattern: '.*',
        getOptions (tag) {
            return {
                level: 'verbose',
                transports: [new (tracer.winston.transports.Console)({
                    label: tag, // that is important to let winston know about tracing tag
                    colorize: true,
                    prettyPrint: true,
                    timestamp: true
                })]
            };
        }
    }
]);
```

Loggers are used in the following way, for example, in `server.js`:

```js
const logger = require('winston-tracer').get('server');

logger.verbose('Starting to serve on', server.info.uri);
```