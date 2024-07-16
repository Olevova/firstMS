const LoginPage = require('../src/classes/auth/login');
const FilterTaskByStatus = require('../src/classes/task/filterTaskByStatus');
const { createWebdriverChrom } = require('../src/utils/webdriver');
const { describe } = require('mocha');
const { By, until } = require('selenium-webdriver');
const makeScreenshot = require('../src/utils/makeScreenShot');
const config = require('../src/utils/config')

describe('Filter tasks test, test-case #39', async () => {
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

  it('Filter tasks', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const filter = new FilterTaskByStatus(driverChrome);

    await loginPageTest.openLoginForm();
    await loginPageTest.fillEmailInput(config.email);
    await loginPageTest.fillPasswordInput(config.password);
    await loginPageTest.checkSaveForFuture();
    await loginPageTest.login(config.urlhomePageForCheck);

    try {
      await filter.goToTasksList(config.projectNameMain);
      await filter.filterTasksByStatus(config.done);
      await filter.chekFilter(config.done);
    } catch (error) {
      // if something wrong make screen in utils/screenshot
      makeScreenshot(driverChrome, 'filter');
      throw error;
    }
  });
});
