const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateCompany = require('../../src/classes/company/createCompany');
const RemoveCompany = require('../../src/classes/company/removeCompany');
const CreateProject = require('../../src/classes/project/createProject');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { nanoid } = require('nanoid');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Company management tests @Sb36e9099', async () => {
  let driverChrome = null;

  const newConpanyName = 'CompanyProject';

  const userStatus = 'sa';
  const newProjectName = 'InCom' + nanoid(2);
  const newProjectkey = 'AABB';
  const newProjectNumber = '71';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create new company, and new project @Tbc6b497c', async () => {
    await lambdaParameters('create new company, and new project', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createCompany = new CreateCompany(driverChrome);
    const createProjectTest = new CreateProject(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createCompany.goToCreateCompanyForm();
      await createCompany.fillCreateCompany(
        newConpanyName,
        config.newCompanyStreet,
        false,
        config.newCompanyState,
        config.newCompanyCity,
        config.newCompanyZip,
        config.newCompanyPhone,
        config.newCompanyEmail,
        config.newCompanyPlan,
        config.newCompanyType
      );
      await createCompany.checkCreationOfNewCompany();
      await createProjectTest.goToCreateProjectForm();
      await createProjectTest.fillCreateProjectFields(
        userStatus,
        newProjectName,
        newProjectkey,
        newProjectNumber,
        newConpanyName,
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
      await makeScreenshot(driverChrome, 'company_create_with_project');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('remove company with the project @T6cb9b9df', async () => {
    await lambdaParameters('remove company with the project', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeCompany = new RemoveCompany(driverChrome);
    const createProjectTest = new CreateProject(driverChrome);

    try {
      await logginPageTest.userLogIn(
        config.email,
        config.password,
        config.urlhomePageForCheck
      );

      await removeCompany.goToCompanyList();
      await removeCompany.removeCompanyViaThreeDotsMenu(newConpanyName);
      await createProjectTest.goToDashboardTab(config.projects);
      await createProjectTest.checkDeleteItem(
        '.list-name-wrapper',
        newProjectName
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_remove_with_project');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
