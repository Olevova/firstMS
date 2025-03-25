const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateTask = require('../../src/classes/task/createTask');
const InviteUser = require('../../src/classes/user/inviteUser');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Project management role @Sfbe51cff', async () => {
  let driverChrome = null;
  let startTaskNumber;
  const locatorDeleteFilter = '.filters-icon.close-icon-forCheck';
  const locatorTasksElements = '.item-info-list';
  const taskSearchTitle = 'Filter';
  const taskName = ['Task2','Task1']

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('PM can create task @Ta78f7760', async () => {
    await lambdaParameters('PM can create task @Ta78f7760', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createTaskByPM = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await createTaskByPM.goToView(config.projectNameForPM, 'pm');
      await createTaskByPM.goToSelectTab(config.tasks);
      await createTaskByPM.fillCreateTask(
        config.newTaskName,
        config.taskDescription,
        config.taskDate,
        config.taskTestUserCA
      );
      await createTaskByPM.checkTaskCreation(config.newTaskName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_create_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM can edit task @T6a4d76e9', async () => {
    await lambdaParameters('PM can edit task @T6a4d76e9', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const PMUpdateTask = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
        config.emailPM,
        config.passwordPM,
        config.mainCompanyPage
      );

    try {
      await PMUpdateTask.goToView(config.projectNameForPM, 'pm');
      await PMUpdateTask.goToSelectTab(config.tasks);
      await PMUpdateTask.editTask(config.newTaskName, config.newTaskNameForUpdate);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_update_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM can delete task @T6c229cea', async () => {
    await lambdaParameters('PM can delete task @T6c229cea', driverChrome);
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeTaskByPM = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await removeTaskByPM.goToView(config.projectNameForPM, 'pm');
      await removeTaskByPM.goToSelectTab(config.tasks);
      await removeTaskByPM.taskRemove(config.newTaskNameForUpdate);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_remove_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM can filter tasks @T6b975a31', async () => {
    await lambdaParameters('Filter tasks', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const filter = new CreateTask(driverChrome);

    await loginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await filter.goToView(config.projectNameForPM, 'pm');
      await filter.goToSelectTab(config.tasks);
      startTaskNumber = await filter.numberOfItemsInTheList(locatorTasksElements,100, locatorTasksElements)
      await filter.filterTasks(config.done,config.userPMName);
      await filter.chekFilter(config.done, config.userPMName);
      await driverChrome.sleep(500);
      await filter.clickElement(locatorDeleteFilter);
      await filter.waitListDate(locatorTasksElements,startTaskNumber );
      
      const endTaskNumber = await filter.numberOfItemsInTheList(locatorTasksElements, 100, locatorTasksElements)
      if(endTaskNumber===startTaskNumber){
        console.log('Filter test passed');
      }
      else{
        throw new Error('Filter test failed')
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      makeScreenshot(driverChrome, 'filter_task_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM can search tasks @T56f902a0', async () => {
    await lambdaParameters(
      'PM can search tasks',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const searchingTask = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await searchingTask.goToView(config.projectNameForPM, 'pm');
      await searchingTask.goToSelectTab(config.tasks);
      await searchingTask.searchingTasksByName(taskSearchTitle);
      await searchingTask.chekSearchingResult(taskSearchTitle);
      await searchingTask.clearSearchInput();
      const endTaskNumber = await searchingTask.numberOfItemsInTheList(locatorTasksElements,100, locatorTasksElements)
      console.log(endTaskNumber, startTaskNumber);
      if(endTaskNumber === startTaskNumber){
        console.log('Search test passed');
      }
      else{
        throw new Error('Search test failed')
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_search_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM can hide completed tasks @Ta675fc2d', async () => {
    await lambdaParameters('PM can hide completed tasks', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const searchingTask = new CreateTask(driverChrome);
    const filter = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await searchingTask.goToView(config.projectNameForPM, 'pm');
      await searchingTask.goToSelectTab(config.tasks);
      await searchingTask.clickElement(config.locatorHideCompliteBtnCss);
      await searchingTask.waitListDate(locatorTasksElements, 1);
      // await driverChrome.sleep(2000)
      const taskWithDoneStatus = await filter
        .chekFilter(config.done)
        .catch(() => null);
      if (taskWithDoneStatus === null) {
        await searchingTask.clickElement(config.locatorHideCompliteBtnCss);
        await searchingTask.waitListDate(locatorTasksElements, startTaskNumber);
        const endTaskNumber = await searchingTask.numberOfItemsInTheList(
          locatorTasksElements,
          100,
          locatorTasksElements
        );
        console.log(endTaskNumber, startTaskNumber);
        if (endTaskNumber === startTaskNumber) {
          console.log('Hide button test passed');
        } else {
          throw new Error('Hide button test passed');
        }
      } else {
        throw new Error('Test failed, hide task not work');
      }

      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_hide_btn_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM can change task Status @Tce5a7dfa', async () => {
    await lambdaParameters('PM can change task Status @Tce5a7dfa', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeTaskStatus = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await changeTaskStatus.goToView(config.projectNameForPM, 'pm');
      await changeTaskStatus.goToSelectTab(config.tasks);
      await changeTaskStatus.findAllTasksInProject();
      await changeTaskStatus.changeStatus();
      await changeTaskStatus.checkStatus();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_change_status_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM can multiselect tasks @T2c73fde6', async () => {
    await lambdaParameters(
      'PM can multiselect tasks @T2c73fde6',
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);
    // const userSelect = new RemoveUser(driverChrome);
    const changeTaskStatus = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );
    try {
      await changeTaskStatus.goToView(config.projectNameForPM, 'pm');
      await changeTaskStatus.goToSelectTab(config.tasks);
      await changeTaskStatus.waitListDate(locatorTasksElements,startTaskNumber)
      await inviteUserTest.checkElFromArrayInList(taskName,config.locatorTaskName);
      await inviteUserTest.checkCounter(taskName.length);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_multiselect_company_user_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
