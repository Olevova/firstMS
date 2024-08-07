const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const CreateTask = require('../src/classes/task/createTask');
const SearchingTaskByName = require('../src/classes/task/searchingTask');
const RemoveTask = require('../src/classes/task/removeTask');
const UpdateTaskDetail = require('../src/classes/task/updateTaskDetail');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');
const {
  isRunningInDocker,
  isRunningInTeamCity,
  inDocker,
  withoutLambda

} = require('../src/utils/webdriver');

describe('Create, searching by name, add attachment, edit and remove task in the chrom browser, test-cases #34,35,36,40,55.1', async () => {
  // here add parameters for creation
  let driverChrome = null;

  const newTaskName = 'FortesTask';
  const newTaskNameForUpdate = 'Foretask2';
  const newTaskDescription = 'Test description';
  const newTaskDueData = '15.12.2024';
  let attachmentFileNameDocker = '_classpath.txt';
  // const attachmentFileName = 'Logo.png'; //use for local test;
  if (!withoutLambda)
    {
      attachmentFileNameDocker = 'Logo.png';
    }

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create new task', async () => {
    await lambdaParameters('create new task', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createTask = new CreateTask(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

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

  it('searching task by name in the searching form', async () => {
    await lambdaParameters(
      'searching task by name in the searching form',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const searchingTask = new SearchingTaskByName(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

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

  it('update task', async () => {
    await lambdaParameters(
      'update task',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const updateTaskDetail = new UpdateTaskDetail(driverChrome);
    const goToTasks = new SearchingTaskByName(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);
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

  it('add attachment to the task', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const updateTaskDetail = new UpdateTaskDetail(driverChrome);
    const goToTasks = new SearchingTaskByName(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);
    await goToTasks.goToTasksList(config.projectNameMain);

    try {
      await updateTaskDetail.findAllTasksInProject();
      if((isRunningInTeamCity || isRunningInDocker) && !withoutLambda){
        console.log('passed');
      }else{
      await updateTaskDetail.addAttachment(newTaskNameForUpdate);
      // await updateTaskDetail.checkAttachment(newTaskNameForUpdate, attachmentFileName); for local Use
      await updateTaskDetail.checkAttachment(
        newTaskNameForUpdate,
        attachmentFileNameDocker
      );}
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await lambdaParameters('failed', driverChrome);
      await makeScreenshot(driverChrome, 'task_attachment');
      throw error;
    }
  });

  it('remove task', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeTask = new RemoveTask(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await removeTask.goToTasksList(config.projectNameMain);
      await removeTask.taskRemove(newTaskNameForUpdate);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_remove');
      throw error;
    }
  });
});
