const LoginPage = require('../../src/classes/auth/login');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const CreateTask = require('../../src/classes/task/createTask');
const { createWebdriverChrome } = require('../../src/utils/webdriver');
const { describe } = require('mocha');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const config = require('../../src/utils/config');

describe('Tasks tests @S02097389', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Sort tasks by number  @Tc3e82eca', async () => {
    await lambdaParameters('Sort tasks by number', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const sortTasksByNumber = new CreateTask(driverChrome);

    await loginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await sortTasksByNumber.goToTasksList(config.projectNameMain);
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
