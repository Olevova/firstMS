const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const AddRemoveUserToProject = require('../src/classes/user/addAndRemoveUserToProject');
const CreateTask = require('../src/classes/task/createTask');
const RemoveTask = require('../src/classes/task/removeTask');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Checking the addition of a pagination, a pagination counter, after adding and removing a task on the user', async () => {
  // here add parameters for creation
  let driverChrome = null;

  const userName = 'task-test';
  const taskTitle = 'taskforPagination';
  const taskDescription = 'check pagination';
  const newTaskDueData = '15.12.2024';
  let startTaskNumber = null;
  let taskNumberAfterAddTask = null;
  let taskNumberAfterRemoveUser = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('checking the addition of a pagination, a pagination counter, after adding and removing a task on the user', async () => {
    await lambdaParameters(
      'checking the addition of a pagination, a pagination counter, after adding and removing a task on the user',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addRemoveUserToProject = new AddRemoveUserToProject(driverChrome);
    const createTask = new CreateTask(driverChrome);
    const removeTask = new RemoveTask(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await addRemoveUserToProject.goToView(config.projectStatus);
      await addRemoveUserToProject.goToSelektTab(config.users);
      await addRemoveUserToProject.addExistingUser(userName);
      await addRemoveUserToProject.goToSelektTab(config.tasks);
      startTaskNumber = await createTask.numberOfItemsInTheList(
        '.task-name__wrapper',
        '100',
        '.task-name'
      );
      console.log(startTaskNumber, 'startTaskNumber');
      await createTask.openTaskForm();
      await createTask.fillCreateTask(
        taskTitle,
        taskDescription,
        newTaskDueData,
        userName
      );
      await createTask.checkTaskCreation(taskTitle);
      taskNumberAfterAddTask = await createTask.numberOfItemsInTheList(
        '.task-name__wrapper',
        '100',
        '.task-name'
      );
      console.log(taskNumberAfterAddTask, 'taskNumberAfterAddTask');
      await addRemoveUserToProject.goToSelektTab(config.users);
      await addRemoveUserToProject.removeUserFromProject(userName);
      await addRemoveUserToProject.goToSelektTab(config.tasks);
      taskNumberAfterRemoveUser = await createTask.numberOfItemsInTheList(
        '.task-name__wrapper',
        '100',
        '.task-name'
      );
      if (
        taskNumberAfterAddTask == !taskNumberAfterRemoveUser ||
        taskNumberAfterRemoveUser === startTaskNumber
      ) {
        console.log(
          taskNumberAfterAddTask,
          taskNumberAfterRemoveUser,
          startTaskNumber
        );
        throw new Error('Test failed, check screenshot');
      }
      await removeTask.taskRemove(taskTitle);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_pagination');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
