const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateProject = require('../../src/classes/project/createProject');
const InviteUser = require('../../src/classes/user/inviteUser');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

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

  it('Create the project and invite user to the project @T1c6d82e7', async () => {
    await lambdaParameters(
      'Create the project and invite user to the project',
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

  it('Delete project with user @T4553e845', async () => {
    await lambdaParameters('Delete project with user', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeProject = new CreateProject(driverChrome);
    const removeUserTest = new InviteUser(driverChrome);

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
        config.mainCompanyPage
      );
      await removeUserTest.removefindUser();
      await removeUserTest.checkIfUserRemove(
        config.emailForTest,
        config.mainCompanyPage
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_with_user_remove');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
