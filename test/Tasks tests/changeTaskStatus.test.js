const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
// const ChangeStatusTask = require('../../src/classes/task/changeStatus');
const CreateTask = require('../../src/classes/task/createTask');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
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

  it('Change task status from Tasks list page@Tf6ae65d7', async () => {
    await lambdaParameters('Change task status from Tasks list page', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeTaskStatus = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await changeTaskStatus.goToTasksList(config.projectNameMain);
      await changeTaskStatus.findAllTasksInProject();
      await changeTaskStatus.changeStatus();
      await changeTaskStatus.checkStatus();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_change_status');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
