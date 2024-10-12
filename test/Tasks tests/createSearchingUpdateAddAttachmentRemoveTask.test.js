const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateTask = require('../../src/classes/task/createTask');
const SearchingTaskByName = require('../../src/classes/task/searchingTask');
const RemoveTask = require('../../src/classes/task/removeTask');
const UpdateTaskDetail = require('../../src/classes/task/updateTaskDetail');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Tasks tests @S26f6875e', async () => {
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

  it('create new task @Tcdda7369', async () => {
    await lambdaParameters('create new task', driverChrome);
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

  it('searching task by name in the searching form @T551024c6', async () => {
    await lambdaParameters(
      'searching task by name in the searching form',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const searchingTask = new SearchingTaskByName(driverChrome);

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

  it('update task @T94a5fca4', async () => {
    await lambdaParameters('update task', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const updateTaskDetail = new UpdateTaskDetail(driverChrome);
    const goToTasks = new SearchingTaskByName(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );
    await goToTasks.goToTasksList(config.projectNameMain);
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

  it('add attachment to the task @T07c57ec0', async () => {
    await lambdaParameters('add attachment to the task', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const updateTaskDetail = new UpdateTaskDetail(driverChrome);
    const goToTasks = new SearchingTaskByName(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );
    await goToTasks.goToTasksList(config.projectNameMain);

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

  it('remove task @T331e8497', async () => {
    await lambdaParameters('remove task', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeTask = new RemoveTask(driverChrome);

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
