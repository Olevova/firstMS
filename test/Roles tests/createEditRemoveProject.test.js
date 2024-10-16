const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateProject = require('../../src/classes/project/createProject');
const EditProject = require('../../src/classes/project/editProject');
const RemoveProject = require('../../src/classes/project/removeProject');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');
const { nanoid } = require('nanoid');

describe('Super admin role @S75be5ddc', async () => {
  let driverChrome = null;

  const newProjectName = 'FTP' + nanoid(2);
  const newProjectkey = null;
  const newProjectNumber = '71';
  const newCompanyProjectBelong = config.companyName;
  const newEditName = 'testProjectEdit';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('SA can create project @T7d80876e', async () => {
    await lambdaParameters('SA can create project', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createProjectTest = new CreateProject(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createProjectTest.goToCreateProjectForm();
      await createProjectTest.fillCreateProjectFields(
        'sa',
        newProjectName,
        newProjectkey,
        newProjectNumber,
        newCompanyProjectBelong,
        config.newProjectStreet,
        config.newProjectApp,
        config.newProjectState,
        config.newCompanProjectCity,
        config.newProjectZip,
        config.newProjectClientName,
        config.startDate,
        config.eneDate
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('SA can edit project @Tb1facf33', async () => {
    await lambdaParameters('SA can edit project', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editProject = new EditProject(driverChrome);

    try {
      await logginPageTest.userLogIn(
        config.email,
        config.password,
        config.urlhomePageForCheck
      );

      await editProject.goToProjectList();
      await editProject.findProject(newProjectName, config.projectsPage);
      await editProject.editProject(newEditName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_edit');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('SA can delete project @T6133355b', async () => {
    await lambdaParameters('SA can delete project', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeProject = new RemoveProject(driverChrome);

    try {
      await logginPageTest.userLogIn(
        config.email,
        config.password,
        config.urlhomePageForCheck
      );

      await removeProject.goToProjectList();
      await removeProject.findProject(newEditName, config.projectsPage);
      await removeProject.removefindProject(newEditName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_remove');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
