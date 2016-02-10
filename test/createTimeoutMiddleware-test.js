import { createTimeoutMiddleware } from '../src/createTimeoutMiddleware';

describe('createTimeoutMiddleware', function() {

    it('should return a middleware function', function() {
        const middleware = createTimeoutMiddleware(500);
        expect(middleware).to.be.instanceOf(Function);
        expect(middleware.length).to.equal(2);
    });

    it('should throw if an invalid time is requested', function() {
        expect(() => createTimeoutMiddleware()).to.throw();
        expect(() => createTimeoutMiddleware(0)).to.throw();
        expect(() => createTimeoutMiddleware('foo')).to.throw();
    });
});
