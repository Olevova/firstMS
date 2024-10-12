const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const ChangeStatusTask = require('../../src/classes/task/changeStatus');
const InviteUser = require('../../src/classes/user/inviteUser');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Standard User role @S7e09d7c0', async () => {
  let driverChrome = null;
  let startTaskNumber = 2;
  const taskName = ['Test task2','Test task1']

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('SU can change tasks status on preview page @T38b4ee1a', async () => {
    await lambdaParameters('SU can change tasks status on preview page @T38b4ee1a', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeTaskStatus = new ChangeStatusTask(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await changeTaskStatus.goToView(config.projectNameForSU, 'pm');
      await changeTaskStatus.goToSelectTab(config.tasks);
      await changeTaskStatus.findAllTasksInProject();
      await changeTaskStatus.changeStatus();
      await changeTaskStatus.checkStatus();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_change_status_by_SU');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM can multiselect tasks @T2c73fde6', async () => {
    await lambdaParameters(
      'PM can multiselect tasks @T2c73fde6',
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);
    // const userSelect = new RemoveUser(driverChrome);
    const changeTaskStatus = new ChangeStatusTask(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );
    try {
      await changeTaskStatus.goToView(config.projectNameForSU, 'pm');
      await changeTaskStatus.goToSelectTab(config.tasks);
      await changeTaskStatus.waitListDate(config.locatorTasksElementsCss, startTaskNumber)
      await inviteUserTest.checkElFromArrayInList(taskName,config.locatorTaskName);
      await inviteUserTest.checkCounter(taskName.length);
      await driverChrome.sleep(2000)
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_multiselect_tasks_by_SU');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
