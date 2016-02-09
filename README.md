# alexa-ability-timeout

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
// Listen for the custom `timeout` event the middleware
// emits and cancel the request appropriately
app.on(e.launch, function(req, next) {
    const cancel = slowCancelableOperation(function(err, output) {
        if (err) return next(err);  // pass along error if we can't handle it
        req.say(output).end();      // otherwise send output
    });

    req.on('timeout', cancel);
});

// slow, operation that we can't cancel.
// in this case just check the `req.timedOut` property
// to see if it is safe to continue
app.on(e.end, function(req, next) {
    slowOperation(function(err, output) {
        if (req.timedOut) return;  // halt if timed out
        if (err) return next(err); // or pass along error if we can't handle it
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
