const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateProject = require('../../src/classes/project/createProject');
const RemoveProject = require('../../src/classes/project/removeProject');
const CreateUnit = require('../../src/classes/view/unit/createUnit');
const CreateRoom = require('../../src/classes/view/room/createRoom');
const CreateArea = require('../../src/classes/view/area/createArea');
const RoomTemplate = require('../../src/classes/view/room/roomTemplate');
const CreateTask = require('../../src/classes/task/createTask');
const InviteUser = require('../../src/classes/user/inviteUser');
const RemoveUser = require('../../src/classes/user/removeUser');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Project management tests @Sbae16311', async () => {
  let driverChrome = null;

  const userStatus = 'sa';
  const newProjectName = 'full-field project';
  const newProjectkey = 'FFPD';
  const newProjectNumber = '321';
  const newProjectStreet = 'Test2 new';
  const newProjectApp = '22';
  const newProjectZip = '03200';
  const newCompanyProjectBelong = 'AT2024';
  const newProjectClientName = 'Test with user';
  const newProjectState = 'New York';
  const newCompanProjectCity = 'New York';
  const startDate = '12.12.23';
  const eneDate = '12.12.25';

  const newUnitName = 'fullUnit';
  const newRoomName = 'fillRoom';
  const newAreaName = 'fullArea';

  const taskTitle = 'taskRemoveFullProject';
  const taskDescription = 'check remove full project with task and user';
  const newTaskDueData = '15.12.2024';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create a project and fill it with a unit, a room, a template, add User and create task @T42acb296', async () => {
    await lambdaParameters(
      'create a project and fill it with a unit, a room, a template, add User and create task',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createProjectTest = new CreateProject(driverChrome);
    const createUnit = new CreateUnit(driverChrome);
    const createRoom = new CreateRoom(driverChrome);
    const createArea = new CreateArea(driverChrome);
    const roomTemplate = new RoomTemplate(driverChrome);
    const inviteUserTest = new InviteUser(driverChrome);
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
        startDate,
        eneDate
      );
      await createProjectTest.goToView(newProjectName);
      await createProjectTest.goToSelectTab(config.view);
      await createUnit.createUnit(newUnitName);
      await createUnit.checkCreateUnit(newUnitName);
      await createRoom.createRoom('_', newRoomName, true);
      await createRoom.checkCreateNewRoom(newRoomName);
      await createArea.openEditRoomFormViaThreeDots(newRoomName);
      await createArea.addAreaInRoom(newAreaName);
      await createArea.checkCreateArea(newRoomName, newAreaName);
      await roomTemplate.checkTemplateInList('_', newAreaName);
      await createProjectTest.goToSelectTab('Users');
      await inviteUserTest.openInviteUserFormInProject();
      await inviteUserTest.fillInviteFormByCA(
        config.emailUseForTest,
        config.projManager
      );
      await inviteUserTest.checkCreateNewUser(config.emailUseForTest);
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

  it('remove project @T915269b2', async () => {
    await lambdaParameters(
      'remove project with a unit, a room, a template, add User and create task',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeProject = new RemoveProject(driverChrome);
    const removeUserTest = new RemoveUser(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await removeProject.goToProjectList();
      await removeProject.findProject(newProjectName, config.projectsPage);
      await removeProject.removefindProject(newProjectName);
      await removeUserTest.goToUserList('incompany');
      await removeUserTest.findUser(
        config.emailUseForTest,
        config.mainCompanyUsersPage
      );
      await removeUserTest.removefindUser();
      await removeUserTest.checkIfUserRemove(
        config.emailUseForTest,
        config.mainCompanyUsersPage
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_with_task_remove');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
