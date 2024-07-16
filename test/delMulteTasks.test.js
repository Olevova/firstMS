const { createWebdriverChrom } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const CreateTask = require('../src/classes/task/createTask');
const DeleteMulteTasks = require('../src/classes/task/deleteMulteTasks');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Delete Multiple Tasks in the chrom browser, test-case #41', async () => {
  // here add parameters for creation
  let driverChrome = null;
  
  const newFirstTaskName = 'Fortest';
  const newTaskDescription = 'Test description';
  const newTaskDueData = '15.12.2024';
  const newSecondTaskName = 'Fortest2';
  const newTasksArray = ['Fortest', 'Fortest2'];

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('delete two task', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createTask = new CreateTask(driverChrome);
    const deleteMulteTasks = new DeleteMulteTasks(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await createTask.goToCreateTasksForm(config.projectNameMain);
      await createTask.fillCreateTask(
        newFirstTaskName,
        newTaskDescription,
        newTaskDueData
      );
      await createTask.checkTaskCreation(newFirstTaskName);
      await createTask.fillCreateTask(
        newSecondTaskName,
        newTaskDescription,
        newTaskDueData
      );
      await createTask.checkTaskCreation(newSecondTaskName);
      await deleteMulteTasks.findAllTasksInProject();
      await deleteMulteTasks.checkTasksInList(newTasksArray);
      await deleteMulteTasks.removeCheckingTasks();
    } catch (error) {
      await makeScreenshot(driverChrome, 'del_two_tasks');
      throw error;
    }
  });
});
