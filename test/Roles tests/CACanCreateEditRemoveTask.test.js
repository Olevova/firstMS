const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateTaskByEmployee = require('../../src/classes/task/employee/employeeCreateTask');
const EmployeeUpdateTask = require('../../src/classes/task/employee/employeeUpdateTask');
const RemoveTaskByEmployee = require('../../src/classes/task/employee/employeeRemoveTask');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Company admin role @Se7b2355c', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('CA can create tasks @T98285107', async () => {
    await lambdaParameters('create new task by employee', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createTaskByCA = new CreateTaskByEmployee(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await createTaskByCA.goToCreateTasksForm();
      await createTaskByCA.fillCreateTask(
        config.newTaskName,
        config.taskDescription,
        config.taskDate,
        config.userCAName
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_create_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('CA can edit tasks @T9d832535', async () => {
    await lambdaParameters('update task by employee', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const CAUpdateTask = new EmployeeUpdateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await CAUpdateTask.goToCreateTasksForm();
      await CAUpdateTask.editTask(config.newTaskName, config.newTaskNameForUpdate);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_update_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('CA can delete tasks', async () => {
    await lambdaParameters('CA can delete tasks', driverChrome);
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeTaskByCA = new RemoveTaskByEmployee(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await removeTaskByCA.goToTasksList();
      await removeTaskByCA.taskRemove(config.newTaskNameForUpdate);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_remove_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
