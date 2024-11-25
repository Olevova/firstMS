const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateProject = require('../../src/classes/project/createProject');
const CreateTask = require('../../src/classes/task/createTask');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Project management tests @Sbae16311', async () => {
  let driverChrome = null;

  const userStatus = 'sa';
  const newProjectName = 'task project';
  const newProjectkey = 'APWU';
  const newProjectNumber = '629';
  const newProjectStreet = 'Test2 new';
  const newProjectApp = null;
  const newProjectZip = '03200';
  const newCompanyProjectBelong = 'AT2024';
  const newProjectClientName = 'Test with user';
  const newProjectState = 'New York';
  const newCompanProjectCity = 'New York';
  const taskTitle = 'taskRemoveProject';
  const taskDescription = 'check remove project with task';
  const newTaskDueData = '15.12.2024';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Create the project and create task in it @T4717f011', async () => {
    await lambdaParameters(
      'Create the project and create task in it',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createProjectTest = new CreateProject(driverChrome);
    const createTask = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createProjectTest.goToCreateProjectForm();
      await createProjectTest.fillCreateProjectFields(
        userStatus,
        newProjectName,
        newProjectkey,
        newProjectNumber,
        newCompanyProjectBelong,
        newProjectStreet,
        newProjectApp,
        newProjectState,
        newCompanProjectCity,
        newProjectZip,
        newProjectClientName,
        // startDate,
        // eneDate
      );
      await createProjectTest.goToView(newProjectName);
      await createProjectTest.goToSelectTab('Tasks');
      await createTask.openTaskForm();
      await createTask.fillCreateTask(
        taskTitle,
        taskDescription,
        newTaskDueData
      );
      await createTask.checkTaskCreation(taskTitle);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_create_task_add');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Delete project with task @T32a31c21', async () => {
    await lambdaParameters('Delete project with task', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeProject = new CreateProject(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await removeProject.goToProjectList();
      await removeProject.findProject(newProjectName, config.projectsPage);
      await removeProject.removefindProject(newProjectName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_with_task_remove');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
