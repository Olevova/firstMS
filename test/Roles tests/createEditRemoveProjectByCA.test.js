const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateProject = require('../../src/classes/project/createProject');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');
const { nanoid } = require('nanoid');

describe('Company admin role @Se7b2355c', async () => {
  let driverChrome = null;

  const userStatus = 'ca';
  const newProjectName = 'Aaa' + nanoid(2);
  const newProjectkey = 'ABCD';
  const newProjectNumber = '88';
  const newProjectStreet = 'Test2 new';
  const newProjectApp = '22';
  const newProjectZip = '02200';
  const newProjectClientName = 'Auto Test';
  const newProjectState = 'New York';
  const newCompanProjectCity = 'New York';
  const startDate = '12.12.23';
  const eneDate = '12.12.25';
  const newEditName = 'testProjectEdit';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create new project by the company admin @T9a225b0b', async () => {
    await lambdaParameters(
      'create new project by the company admin',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createProjectTest = new CreateProject(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await createProjectTest.goToCreateProjectForm('ca');
      await createProjectTest.fillCreateProjectFields(
        userStatus,
        newProjectName,
        newProjectkey,
        newProjectNumber,
        '_',
        newProjectStreet,
        newProjectApp,
        newProjectState,
        newCompanProjectCity,
        newProjectZip,
        newProjectClientName,
        startDate,
        eneDate
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_create_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('edit project by the company admin through the three dots menu @Tfa55087f', async () => {
    await lambdaParameters(
      'edit project by the company admin through the three dots menu',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editProject = new CreateProject(driverChrome);

    try {
      await logginPageTest.userLogIn(
        config.emailCA,
        config.passwordCA,
        config.mainCompanyPage
      );

      await editProject.goToProjectList('ca');
      await editProject.editProjectViaThreeDotsMenu(
        newProjectName,
        newEditName
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_edit_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('remove project by the company admin through the three dots menu @Tdd1a27f2', async () => {
    await lambdaParameters(
      'remove project by the company admin through the three dots menu',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeProject = new CreateProject(driverChrome);

    try {
      await logginPageTest.userLogIn(
        config.emailCA,
        config.passwordCA,
        config.mainCompanyPage
      );

      await removeProject.goToProjectList('ca');
      await removeProject.removeProjectViaThreeDotsMenu(newEditName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_remove_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
