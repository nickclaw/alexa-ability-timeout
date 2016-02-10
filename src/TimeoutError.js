
// from https://phabricator.babeljs.io/T3083
// makes new TimeoutError() instanceof TimeoutError === true
function extendableBuiltin(cls) {
    function ExtendableBuiltin() {
        cls.apply(this, arguments);
    }
    ExtendableBuiltin.prototype = Object.create(cls.prototype);
    Object.setPrototypeOf(ExtendableBuiltin, cls);

    return ExtendableBuiltin;
}

export class TimeoutError extends extendableBuiltin(Error) {
    constructor(message = 'Operation timed out.') {
        super(message);
        this.name = 'TimeoutError';
    }
}
