const { createWebdriverChrome } = require('../../webdriver');
const lambdaParameters = require('../../lambdaAddParameters');
const LoginPage = require('../../../classes/auth/login');
const CreateProject = require('../../../classes/project/createProject');
const RemoveProject = require('../../../classes/project/removeProject');
const InviteUser = require('../../../classes/user/inviteUser');
const RemoveUser = require('../../../classes/user/removeUser');
const makeScreenshot = require('../../makeScreenShot');
const { describe } = require('mocha');
const config = require('../../config');

describe('Project management tests @Sbae16311', async () => {
  let driverChrome = null;

  const userStatus = 'sa';
  const newProjectName = 'user project';
  const newProjectkey = 'APWU';
  const newProjectNumber = '628';
  const newProjectStreet = 'Test2 new';
  const newProjectApp = '22';
  const newProjectZip = '03200';
  const newCompanyProjectBelong = 'AT2024';
  const newProjectClientName = 'Test with user';
  const newProjectState = 'New York';
  const newCompanProjectCity = 'New York';
  const startDate = '12.12.23';
  const eneDate = '12.12.25';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create the project and invite user to the project @T1c6d82e7', async () => {
    await lambdaParameters(
      'create the project and invite user to the project',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createProjectTest = new CreateProject(driverChrome);
    const inviteUserTest = new InviteUser(driverChrome);

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
      await createProjectTest.goToSelectTab('Users');
      await inviteUserTest.openInviteUserFormInProject();
      await inviteUserTest.fillInviteFormByCA(
        config.emailForTest,
        config.projManager
      );
      await inviteUserTest.checkCreateNewUser(config.emailForTest);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_create_user_add');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('remove project @T4553e845', async () => {
    await lambdaParameters('remove project with user', driverChrome);
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
        config.emailForTest,
        config.mainCompanyUsersPage
      );
      await removeUserTest.removefindUser();
      await removeUserTest.checkIfUserRemove(
        config.emailForTest,
        config.mainCompanyUsersPage
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_with_user_remove');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
