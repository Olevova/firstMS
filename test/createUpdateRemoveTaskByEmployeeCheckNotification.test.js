const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const CreateTaskByEmployee = require('../src/classes/task/employee/employeeCreateTask');
const EmployeeUpdateTask = require('../src/classes/task/employee/employeeUpdateTask');
const RemoveTaskByEmployee = require('../src/classes/task/employee/employeeRemoveTask');
const CheckUserNotificationsList = require('../src/classes/notification/checkUserNotificationsList');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Create, edit and remove task by the employee in the chrom browser,test-cases # 18,20,21 in the SU,#161 in the CA', async () => {
  // here add parameters for creation
  let driverChrome = null;

  const newTaskName = 'FortesTaskEmployee';
  const newTaskNameForUpdate = 'ForetaskEmployee2';
  const newTaskDescription = 'Test description';
  const newTaskDueData = '15.12.24';
  let taskIdForNotification = '';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create new task by employee', async () => {
    await lambdaParameters('create new task by employee', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createTaskByEmployee = new CreateTaskByEmployee(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailSU);
    await logginPageTest.fillPasswordInput(config.passwordSU);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      await createTaskByEmployee.goToCreateTasksForm();
      await createTaskByEmployee.fillCreateTask(
        newTaskName,
        newTaskDescription,
        newTaskDueData,
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

  it('Check receive notification about assigning in the Task', async () => {
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
    // const addUserToComment = new MentionUserToArea(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailCA);
    await logginPageTest.fillPasswordInput(config.passwordCA);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.loginWithoutCheckingURL();

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

  it('update task by employee', async () => {
    await lambdaParameters('update task by employee', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const employeeUpdateTask = new EmployeeUpdateTask(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailSU);
    await logginPageTest.fillPasswordInput(config.passwordSU);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

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

  it('remove task', async () => {
    await lambdaParameters('remove task', driverChrome);
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeTaskByEmployee = new RemoveTaskByEmployee(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailSU);
    await logginPageTest.fillPasswordInput(config.passwordSU);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

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
