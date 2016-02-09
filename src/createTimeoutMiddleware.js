import { TimeoutError } from './TimeoutError';

export function createTimeoutMiddleware(time) {
    return function timeoutMiddleware(req, next) {
        // start waiting
        const timeout = setTimeout(() => {
            // make sure request wasn't sent
            if (req.sent) return;

            // alert downstream
            req.timedOut = true;
            req.emit('timeout', req);

            // fail
            next(new TimeoutError()); // TODO is this super dirty?
        }, time);

        // be ready to cancel the timeout
        const onSent = () => clearTimeout(timeout);
        req.on('finished', onSent);
        req.on('failed', onSent);

        req.timedOut = false;
        next();
    };
}
