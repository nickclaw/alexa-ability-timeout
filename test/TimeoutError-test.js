import { TimeoutError } from '../src/TimeoutError';

describe('TimeoutError', function() {
    it('should extend Error', function() {
        const err = new TimeoutError();
        expect(err).to.be.instanceOf(Error);
        expect(err).to.be.instanceOf(TimeoutError);
    });

    it('should have the name "TimeoutError"', function() {
        const err = new TimeoutError();
        expect(err.name).to.equal('TimeoutError');
    });
});
