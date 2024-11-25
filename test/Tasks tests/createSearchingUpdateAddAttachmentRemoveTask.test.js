const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateTask = require('../../src/classes/task/createTask');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Tasks tests @S02097389', async () => {
  let driverChrome = null;

  const newTaskName = 'FortesTask';
  const newTaskNameForUpdate = 'Foretask2';
  const newTaskDescription = 'Test description';
  const newTaskDueData = '15.12.2024';
  let attachmentFileNameDocker = 'JavaScript.png';
  // const attachmentFileName = 'Logo.png'; //use for local test;
  // if (!withoutLambda) {
  //   attachmentFileNameDocker = 'Logo.png';
  // }

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Create a tasks with all required fields @T33c7bd7b', async () => {
    await lambdaParameters('Create a tasks with all required fields', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createTask = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createTask.goToCreateTasksForm(config.projectNameMain);
      await createTask.fillCreateTask(
        newTaskName,
        newTaskDescription,
        newTaskDueData
      );
      await createTask.checkTaskCreation(newTaskName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Search task by name @Tbbb5a825', async () => {
    await lambdaParameters(
      'Search task by name',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const searchingTask = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await searchingTask.goToTasksList(config.projectNameMain);
      await searchingTask.searchingTasksByName(newTaskName);
      await searchingTask.chekSearchingResult(newTaskName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_search');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Update task @T0f1a4aee', async () => {
    await lambdaParameters('Update task', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const updateTaskDetail = new CreateTask(driverChrome);
    

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );
    await updateTaskDetail.goToTasksList(config.projectNameMain);
    try {
      await updateTaskDetail.findAllTasksInProject();
      await updateTaskDetail.editTask(newTaskName, newTaskNameForUpdate);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await lambdaParameters('failed', driverChrome);
      await makeScreenshot(driverChrome, 'task_update');
      throw error;
    }
  });

  it('Attach file to a task @T7f6f6389', async () => {
    await lambdaParameters('add attachment to the task', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const updateTaskDetail = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );
    await updateTaskDetail.goToTasksList(config.projectNameMain);

    try {
      await updateTaskDetail.findAllTasksInProject();
      await updateTaskDetail.addAttachment(newTaskNameForUpdate);
      await updateTaskDetail.checkAttachment(
          newTaskNameForUpdate,
          attachmentFileNameDocker
        );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await lambdaParameters('failed', driverChrome);
      await makeScreenshot(driverChrome, 'task_attachment');
      throw error;
    }
  });

  it('Delete task @T04c98212', async () => {
    await lambdaParameters('Delete task', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeTask = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await removeTask.goToTasksList(config.projectNameMain);
      await removeTask.taskRemove(newTaskNameForUpdate);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_remove');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
