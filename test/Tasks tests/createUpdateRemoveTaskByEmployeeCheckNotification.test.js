const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateTaskByEmployee = require('../../src/classes/task/employee/employeeCreateTask');
const EmployeeUpdateTask = require('../../src/classes/task/employee/employeeUpdateTask');
const RemoveTaskByEmployee = require('../../src/classes/task/employee/employeeRemoveTask');
const CheckUserNotificationsList = require('../../src/classes/notification/checkUserNotificationsList');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Tasks tests @S26f6875e', async () => {
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

  it('create new task by employee @T98285107', async () => {
    await lambdaParameters('create new task by employee', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createTaskByEmployee = new CreateTaskByEmployee(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await createTaskByEmployee.goToCreateTasksForm();
      await createTaskByEmployee.fillCreateTask(
        newTaskName,
        config.taskDescription,
        config.taskDate,
        config.userCAName
      );
      taskIdForNotification = await createTaskByEmployee.getTaskId(newTaskName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Check receive notification about assigning in the Task @T2426c107', async () => {
    await lambdaParameters(
      'Check receive notification about assigning in the Task',
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

  it('update task by employee @T579133b6', async () => {
    await lambdaParameters('update task by employee', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const employeeUpdateTask = new EmployeeUpdateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await employeeUpdateTask.goToCreateTasksForm();
      await employeeUpdateTask.editTask(newTaskName, newTaskNameForUpdate);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_update');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('remove task @Te905fd21', async () => {
    await lambdaParameters('remove task', driverChrome);
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeTaskByEmployee = new RemoveTaskByEmployee(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await removeTaskByEmployee.goToTasksList();
      await removeTaskByEmployee.taskRemove(newTaskNameForUpdate);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_remove');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
