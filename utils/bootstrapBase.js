/**
 * Основа бутстрап файлов
 */
const Timer = require('./Timer');

module.exports = async ({
  func, onError, delay = 5000, timeout = 1000,
} = {}) => {
  const bootstrapFn = async () => {
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

    try {
      await new Timer(delay, timeout, fn, true, true);
    } catch (e) {
      if (e.message === 'timeout') {
        console.info(`Environment was not be able to start during ${timeout} ms. Exit.`);
        process.exitCode = 1;
        process.exit();
      } else {
        console.error(e);
        process.exitCode = 1;
        process.exit();
      }
    }
  };

  return bootstrapFn;
};
