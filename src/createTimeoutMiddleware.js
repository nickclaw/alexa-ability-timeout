import debug from 'debug';
import assert from 'assert';
import { TimeoutError } from './TimeoutError';

const log = debug('timeout');

export function createTimeoutMiddleware(time) {
    assert(time, 'expected a time argument');
    assert(typeof time === 'number', 'expected a number');
    assert(time > 0, 'expected a timeout larger than 0');
    log(`creating timeout middleware for ${time}ms`);

    return function timeoutMiddleware(req, next) {
        log(`starting timer`);

        // start waiting
        const timeout = setTimeout(() => {
            log('request timed out');

            // make sure request wasn't sent
            if (req.sent) {
                log('timed out request somehow already sent');
                return;
            }

            // alert downstream
            req.timedOut = true;
            req.emit('timeout', req);

            // fail
            log('failing with timeout error');
            next(new TimeoutError()); // TODO is this super dirty?
        }, time);

        // be ready to cancel the timeout
        const onSent = () => {
            if (!req.timedOut) log('request finished on time');
            clearTimeout(timeout);
        };
        req.on('finished', onSent);
        req.on('failed', onSent);

        log('setup timer');
        req.timedOut = false;
        next();
    };
}
