const LoginPage = require('../src/classes/auth/login');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const SortTasksByNumber = require('../src/classes/task/sortTaskByNumber');
const { createWebdriverChrom } = require('../src/utils/webdriver');
const { describe } = require('mocha');
const { By, until } = require('selenium-webdriver');
const makeScreenshot = require('../src/utils/makeScreenShot');
const config = require('../src/utils/config');

describe('Sort tasks test in the chrome browser , test-cases #38', async () => {
  // here add parameters for creation
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Sort tasks by number ', async () => {
    await lambdaParameters('Sort tasks by number',driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const sortTasksByNumber = new SortTasksByNumber(driverChrome);

    await loginPageTest.openLoginForm();
    await loginPageTest.fillEmailInput(config.email);
    await loginPageTest.fillPasswordInput(config.password);
    await loginPageTest.checkSaveForFuture();
    await loginPageTest.login(config.urlhomePageForCheck);

    try {
      await sortTasksByNumber.goToTasksLists(config.projectNameMain);
      await sortTasksByNumber.sortTasks();
      await lambdaParameters('passed',driverChrome);
    } catch (error) {
      // if something wrong make screen in utils/screenshot
      makeScreenshot(driverChrome, 'sort_task_by_number');
      throw error;
    }
  });
});
