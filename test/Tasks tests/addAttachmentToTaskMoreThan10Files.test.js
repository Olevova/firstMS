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

  it('Add Attachment to the task more than 10 files @T1d72849f', async () => {
    await lambdaParameters('Add Attachment to the task more than 10 files @T1d72849f', driverChrome);
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
        await updateTaskDetail.openTaskPopUp(newTaskName);
        for (let i=0; i<11; i+=1){
            let fileForAttach
            if(i%2===0){
              fileForAttach = config.attachmentFileDoc;
            }
            else{
                fileForAttach = config.attachmentFileZip;
            }
        await updateTaskDetail.addAttachmentWithoutSave(fileForAttach);
        }
        const errorUpload = await updateTaskDetail.formErrorMsgArray(config.locarorUploadFileErrorCss);
        if(errorUpload.includes('Error to upload. Files amount must not be over 10.')){
            console.log('test passed');  
        }
        else{throw new Error('Test failed')}
        await lambdaParameters('passed', driverChrome);
    } catch (error) {
        await lambdaParameters('failed', driverChrome);
        await makeScreenshot(driverChrome, 'task_attachment_10_file');
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
