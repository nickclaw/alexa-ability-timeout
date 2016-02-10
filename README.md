# alexa-ability-timeout [![Build Status](https://travis-ci.org/nickclaw/alexa-ability-timeout.svg?branch=master)](https://travis-ci.org/nickclaw/alexa-ability-timeout)

### Example

```js
import { Ability, events } from 'alexa-ability';
import { handleAbility } from 'alexa-ability-lambda-handler';
import { timeout, TimeoutError } from 'alexa-ability-timeout';

const app = new Ability({
    applicationId: 'my-application-id'
});

app.use(timeout(5000)); // 5 seconds

// slow, cancelable operation.
// Listen for the `timeout` event on the request and cancel the request appropriately
app.on(e.launch, function(req, next) {
    const cancel = slowCancelableOperation(function(output) {
        req.say(output).end();  // send output
    });

    req.on('timeout', cancel);
});

// slow, operation that we can't cancel.
// just check the `req.timedOut` property to see if it is safe to continue
app.on(e.end, function(req, next) {
    slowOperation(function(output) {
        if (req.timedOut) return;  // halt if timed out
        req.say(output).end();     // otherwise send output
    });
});

app.onError(function(err, req, next) {
    if (err instanceof TimeoutError) {
        req.say('Sorry, that took to long. Please try again.').send();
    } else {
        req.say('Sorry, something went wrong. Please try again later.').end();
    }
});

export const handler = handleAbility(app);

```

### API

##### `timeout(ms) -> middleware`
Creates a middleware function that times out the request after
the given `ms` have passed.

##### `req.clearTimeout()`
A function to stop the timeout completely.

##### `req.timedOut`
A boolean indicating whether the request has timed out.
