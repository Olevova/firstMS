const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateTask = require('../../src/classes/task/createTask');
const CheckUserNotificationsList = require('../../src/classes/notification/checkUserNotificationsList');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Standard user role @S7e09d7c0', async () => {
  let driverChrome = null;

  const newTaskName = 'FortesTaskEmployee';
  const newTaskNameForUpdate = 'ForetaskEmployee2';
  let taskIdForNotification = '';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Standard user crates task @Tf74bce5a', async () => {
    await lambdaParameters('Standard user crates task', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createTaskByEmployee = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await createTaskByEmployee.goToCreateTasksForm(null, 'ca');
      await createTaskByEmployee.fillCreateTask(
        newTaskName,
        config.taskDescription,
        config.taskDate,
        config.userCAName
      );
      await createTaskByEmployee.checkTaskCreation(newTaskName);
      taskIdForNotification = await createTaskByEmployee.getTaskId(newTaskName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('SU receives notification about assigning to the task @T31d44088', async () => {
    await lambdaParameters(
      'SU receives notification about assigning to the task',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const checkUserNotificationsList = new CheckUserNotificationsList(
      driverChrome
    );

    await logginPageTest.userLogIn(config.emailCA, config.passwordCA, null);

    try {
      await checkUserNotificationsList.goToNotificationList();
      await checkUserNotificationsList.checkLastNotification(
        taskIdForNotification
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'check_notification');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('SU can edit own tasks @Td2b8f868', async () => {
    await lambdaParameters('SU can edit own tasks', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const employeeUpdateTask = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await employeeUpdateTask.goToCreateTasksForm(null, 'ca')
      await employeeUpdateTask.editTask(newTaskName, newTaskNameForUpdate);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_update');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('SU can delete own tasks @T3355b8b5', async () => {
    await lambdaParameters('remove task', driverChrome);
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeTaskByEmployee = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await removeTaskByEmployee.goToCreateTasksForm(null, 'ca')
      await removeTaskByEmployee.taskRemove(newTaskNameForUpdate);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_remove');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
