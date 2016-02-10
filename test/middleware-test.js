import { createTimeoutMiddleware } from '../src/createTimeoutMiddleware';
import { TimeoutError } from '../src/TimeoutError';
import { Ability } from 'alexa-ability';

const intentRequest = require('./fixtures/intent-request');

describe('middleware behavior', function() {
    this.timeout(5000);

    let app = null;

    beforeEach(function() {
        app = new Ability({
            applicationId: intentRequest.session.application.applicationId
        });
    });

    it('should set "req.timedOut" to false', function() {
        app.use(createTimeoutMiddleware(500));
        const req = app.handle(intentRequest);
        expect(req.timedOut).to.equal(false);
    });

    it('should set "req.timedOut" to true when timed out', function(done) {
        app.use(createTimeoutMiddleware(500));
        app.on('GetZodiacHoroscopeIntent', function(req) {
            setTimeout(() => {
                expect(req.timedOut).to.equal(true);
                done();
            }, 1000);
        });
        app.handle(intentRequest);
    });

    it('should emit a "timeout" event when timed out', function(done) {
        const spy = sinon.spy();
        app.use(createTimeoutMiddleware(500));
        app.on('GetZodiacHoroscopeIntent', function(req) {
            req.on('timeout', spy);
            setTimeout(() => {
                expect(spy).to.be.called;
                done();
            }, 1000);
        });
        app.handle(intentRequest);
    });

    it('should raise the error handler with a TimeoutError', function(done) {
        app.use(createTimeoutMiddleware(500));
        app.on('GetZodiacHoroscopeIntent', function(req) {
            setTimeout(() => req.timedOut || req.end(), 1000);
        });
        app.onError(function(err) {
            expect(err).to.be.instanceOf(TimeoutError);
            done();
        });
        app.handle(intentRequest);
    });

    it('should not interrupt execution that doesn\'t go over the time limit', function(done) {
        const spy = sinon.spy(req => req.end());
        const timeoutSpy = sinon.spy();

        app.use(createTimeoutMiddleware(500));
        app.on('GetZodiacHoroscopeIntent', spy);
        app.handle(intentRequest, function(err, req) {
            if (err) return done(err);
            expect(err).to.be.falsy;
            expect(req.sent).to.be.true;
            expect(spy).to.be.called;

            req.on('timeout', timeoutSpy);
            setTimeout(function() {
                expect(timeoutSpy).to.not.be.called;
                done();
            }, 1000);
        });
    });
});
