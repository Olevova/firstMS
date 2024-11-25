const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateTask = require('../../src/classes/task/createTask');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Tasks tests @S02097389', async () => {
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

  it('Create a tasks with all required fields @T04c98212', async () => {
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

  it('Attach more than 4 files to the task @T1d72849f', async () => {
    await lambdaParameters('Attach more than 4 files to the task  @T849de717', driverChrome);
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
        await updateTaskDetail.openTaskPopUp(newTaskName);
        for (let i=0; i<5; i+=1){
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
        if(errorUpload.includes(config.filesAttachments)){
            console.log('test passed');  
        }
        else{throw new Error('Test failed')}
        await lambdaParameters('passed', driverChrome);
    } catch (error) {
        await lambdaParameters('failed', driverChrome);
        await makeScreenshot(driverChrome, 'task_attachment_4_file');
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
      await removeTask.taskRemove(newTaskName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_remove');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
