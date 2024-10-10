const LoginPage = require('../../src/classes/auth/login');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const FilterTaskByStatus = require('../../src/classes/task/filterTaskByStatus');
const { createWebdriverChrome } = require('../../src/utils/webdriver');
const { describe } = require('mocha');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const config = require('../../src/utils/config');

describe('Tasks tests @S26f6875e', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Filter tasks @T569ff7fa', async () => {
    await lambdaParameters('Filter tasks', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const filter = new FilterTaskByStatus(driverChrome);

    await loginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await filter.goToTasksList(config.projectNameMain);
      await driverChrome.sleep(2000);
      await filter.filterTasks(config.done);
      await driverChrome.sleep(2000);
      await filter.chekFilter(config.done);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      makeScreenshot(driverChrome, 'filter');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
