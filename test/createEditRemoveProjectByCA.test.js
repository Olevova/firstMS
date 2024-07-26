const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const CreateProject = require('../src/classes/project/createProject');
const EditProject = require('../src/classes/project/editProject');
const RemoveProject = require('../src/classes/project/removeProject');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');
const { nanoid } = require('nanoid');

describe('Create, edit and remove project by the company admin through the three dots menu in the chrom browser, test-cases in the CA #4, 29.2, 29.1 ', async () => {
  // here add parameters for creation
  let driverChrome = null;

  const newProjectName = 'Aaa' + nanoid(2);
  const newProjectkey = 'ABCD';
  const newProjectNumber = '88';
  const newProjectStreet = 'Test2 new';
  const newProjectApp = '22';
  const newProjectZip = '02200';
  const newCompanyProjectBelong = 'terenbro1';
  const newProjectClientName = 'Auto Test';
  const newProjectState = 'New York';
  const newCompanProjectCity = 'New York';
  const startDate = '12.12.23';
  const eneDate = '12.12.25';
  const newEditName = 'testProjectEdit';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create new project by the company admin', async () => {
    await lambdaParameters(
      'create new project by the company admin',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const CreateProjectTest = new CreateProject(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailCA);
    await logginPageTest.fillPasswordInput(config.passwordCA);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      await CreateProjectTest.goToCreateProjectForm('ca');
      await CreateProjectTest.fillCreateProjectFieldsByCompanyAdmin(
        newProjectName,
        newProjectkey,
        newProjectNumber,
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

  it('edit project by the company admin through the three dots menu', async () => {
    await lambdaParameters(
      'edit project by the company admin through the three dots menu',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editProject = new EditProject(driverChrome);

    try {
      await logginPageTest.openLoginForm();
      await logginPageTest.fillEmailInput(config.emailCA);
      await logginPageTest.fillPasswordInput(config.passwordCA);
      await logginPageTest.checkSaveForFuture();
      await logginPageTest.login(config.mainCompanyPage);

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

  it('remove project by the company admin through the three dots menu', async () => {
    await lambdaParameters(
      'remove project by the company admin through the three dots menu',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeProject = new RemoveProject(driverChrome);

    try {
      await logginPageTest.openLoginForm();
      await logginPageTest.fillEmailInput(config.emailCA);
      await logginPageTest.fillPasswordInput(config.passwordCA);
      await logginPageTest.checkSaveForFuture();
      await logginPageTest.login(config.mainCompanyPage);

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
