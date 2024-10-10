const LoginPage = require('../../src/classes/auth/login');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const SortTasksByNumber = require('../../src/classes/task/sortTaskByNumber');
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

  it('Sort tasks by number  @Te56adcd1', async () => {
    await lambdaParameters('Sort tasks by number', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const sortTasksByNumber = new SortTasksByNumber(driverChrome);

    await loginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await sortTasksByNumber.goToTasksLists(config.projectNameMain);
      await sortTasksByNumber.sortTasks();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      // if something wrong make screen in utils/screenshot
      makeScreenshot(driverChrome, 'sort_task_by_number');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
