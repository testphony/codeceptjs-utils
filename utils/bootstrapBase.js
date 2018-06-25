/**
 * Основа бутстрап файлов
 */
const Timer = require('./Timer');

module.exports = async (func, onError, delay = 5000, timeout = 120000) => {
  const bootstrapFn = async (done) => {
    console.info('We are waiting, when environment will be ready');
    const fn = async () => {
      try {
        await func();
        console.info('Environment is ready, now starting testing');
        return true;
      } catch (err) {
        await onError();
        return false;
      }
    };

    const timer = new Timer(delay, timeout, fn, true, true);

    return timer
      .then(() => done())
      .catch((e) => {
        done(e);
      });
  };

  return bootstrapFn;
};
