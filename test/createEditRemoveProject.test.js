const { createWebdriverChrom } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const CreateProject = require('../src/classes/project/createProject');
const EditProject = require('../src/classes/project/editProject');
const RemoveProject = require('../src/classes/project/removeProject');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');
const { nanoid } = require('nanoid');

describe('Create, edit and remove project in the chrom browser, test-cases #5,19,12', async () => {
  // here add parameters for creation
  let driverChrome = null;

  const newProjectName = 'FTP' + nanoid(2);
  const newProjectkey = null;
  const newProjectNumber = '71';
  const newProjectStreet = 'Test2 new';
  const newProjectApp = '22';
  const newProjectZip = '02200';
  const newCompanyProjectBelong = config.companyName;
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

  it('create new project', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createProjectTest = new CreateProject(driverChrome);

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
      // await createProjectTest.chekCreationOfNewProject(newProjectName);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_create');
      throw error;
    }
  });

  it('edit project', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editProject = new EditProject(driverChrome);

    try {
      await logginPageTest.openLoginForm();
      await logginPageTest.fillEmailInput(config.email);
      await logginPageTest.fillPasswordInput(config.password);
      await logginPageTest.checkSaveForFuture();
      await logginPageTest.login(config.urlhomePageForCheck);

      await editProject.goToProjectList();
      await editProject.findProject(newProjectName, config.projectsPage);
      await editProject.editProject(newEditName);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_edit');
      throw error;
    }
  });

  it('remove project', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeProject = new RemoveProject(driverChrome);

    try {
      await logginPageTest.openLoginForm();
      await logginPageTest.fillEmailInput(config.email);
      await logginPageTest.fillPasswordInput(config.password);
      await logginPageTest.checkSaveForFuture();
      await logginPageTest.login(config.urlhomePageForCheck);

      await removeProject.goToProjectList();
      await removeProject.findProject(newEditName, config.projectsPage);
      await removeProject.removefindProject(newEditName);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_remove');
      throw error;
    }
  });
});
