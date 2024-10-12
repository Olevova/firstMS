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

  const newTaskName = config.randomDate;
 

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
        config.taskDescription,
        config.taskDate
      );
      await createTask.checkTaskCreation(newTaskName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Add media attachment to the task edit @T9f8ae49e', async () => {
    await lambdaParameters('Add media attachment to the task edit @T9f8ae49e', driverChrome);
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
        await updateTaskDetail.addAttachment(newTaskName, config.attachmentFileVideo);
        await updateTaskDetail.checkAttachment(
            newTaskName,
            config.attachmentFileVideo
        );
      
        await lambdaParameters('passed', driverChrome);
    } catch (error) {
        await lambdaParameters('failed', driverChrome);
        await makeScreenshot(driverChrome, 'task_attachment_media');
        throw error;
    }
  });

  it('Add document attachment to the task @Ta8fb3301', async () => {
    await lambdaParameters('Add document attachment to the task @Ta8fb3301', driverChrome);
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
        await updateTaskDetail.addAttachment(newTaskName, config.attachmentFileDoc);
        await updateTaskDetail.checkAttachment(
            newTaskName,
            config.attachmentFileDoc
        );
      
        await lambdaParameters('passed', driverChrome);
    } catch (error) {
        await lambdaParameters('failed', driverChrome);
        await makeScreenshot(driverChrome, 'task_attachment_doc');
        throw error;
    }
  });

  it('Add other attachment to the task (.zip/.rar, .exe) @T1231ae22', async () => {
    await lambdaParameters('Add other attachment to the task (.zip/.rar, .exe) @T1231ae22', driverChrome);
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
        await updateTaskDetail.addAttachment(newTaskName, config.attachmentFileZip);
        await updateTaskDetail.checkAttachment(
            newTaskName,
            config.attachmentFileZip
        );
      
        await lambdaParameters('passed', driverChrome);
    } catch (error) {
        await lambdaParameters('failed', driverChrome);
        await makeScreenshot(driverChrome, 'task_attachment_zip');
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
      await removeTask.taskRemove(newTaskName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_remove');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
