const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const CreateProject = require('../src/classes/project/createProject');
const RemoveProject = require('../src/classes/project/removeProject');
const CreateUnit = require('../src/classes/view/unit/createUnit');
const CreateRoom = require('../src/classes/view/room/createRoom');
const CreateArea = require('../src/classes/view/area/createArea');
const RoomTemplate = require('../src/classes/view/room/roomTemplate');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Removing the project with full-filled View tab, test case #12.3', async () => {
  // here add parameters for creation
  let driverChrome = null;

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

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create a project and fill it with a unit, a room, a template', async () => {
    await lambdaParameters(
      'create a project and fill it with a unit, a room, a template',
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

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await createProjectTest.goToCreateProjectForm();
      await createProjectTest.fillCreateProjectFields(
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
      await createProjectTest.goToSelektTab(config.view);
      await createUnit.createUnit(newUnitName);
      await createUnit.checkCreateUnit(newUnitName);
      await createRoom.createRoom('_', newRoomName, true);
      await createRoom.checkCreateNewRoom(newRoomName);
      await createArea.openEditRoomFormViaThreeDots(newRoomName);
      await createArea.addAreaInRoom(newAreaName);
      await createArea.checkCreateArea(newRoomName, newAreaName);
      await roomTemplate.checkTemplateInList('_', newAreaName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_create_task_add');
      throw error;
    }
  });

  it('remove project', async () => {
    await lambdaParameters('remove fullfield project ', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeProject = new RemoveProject(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

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
