const { createWebdriverChrom } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const CreateCompany = require('../src/classes/company/createCompany');
const RemoveCompany = require('../src/classes/company/removeCompany');
const CreateProject = require('../src/classes/project/createProject');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { nanoid } = require('nanoid');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Remove company with the project in the chrom browser, test-cases #11.1', async () => {
  // here add parameters for creation
  let driverChrome = null;

  const newConpanyName = 'CompanyProject';
  const newCompanyStreet = 'test2';
  const newCompanyApp = '15';
  const newCompanyZip = '00000';
  const newCompanyPhone = '+1111112111';
  const newCompanyEmail = 'fortest@test.com';
  const newCompanyPlan = 'Enterprise';
  const newCompanyType = 'tiling';
  const newCompanyState = 'New York';
  const newCompanyCity = 'New York';

  const newProjectName = 'InCom' + nanoid(2);
  const newProjectkey = 'AABB';
  const newProjectNumber = '71';
  const newProjectStreet = 'Test2 new';
  const newProjectApp = '22';
  const newProjectZip = '02200';
  const newProjectClientName = 'Auto Test';
  const newProjectState = 'New York';
  const newCompanProjectCity = 'New York';
  const startDate = '12.12.23';
  const eneDate = '12.12.25';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create new company, and new project', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createCompany = new CreateCompany(driverChrome);
    const createProjectTest = new CreateProject(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await createCompany.goToCreateCompanyForm();
      await createCompany.fillCreateCompany(
        newConpanyName,
        newCompanyStreet,
        newCompanyApp,
        newCompanyState,
        newCompanyCity,
        newCompanyZip,
        newCompanyPhone,
        newCompanyEmail,
        newCompanyPlan,
        newCompanyType
      );
      await createCompany.checkCreationOfNewCompany();
      await createProjectTest.goToCreateProjectForm();
      await createProjectTest.fillCreateProjectFields(
        newProjectName,
        newProjectkey,
        newProjectNumber,
        newConpanyName,
        newProjectStreet,
        newProjectApp,
        newProjectState,
        newCompanProjectCity,
        newProjectZip,
        newProjectClientName,
        startDate,
        eneDate
      );
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_create_with_project');
      throw error;
    }
  });

  it('remove company with the project', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeCompany = new RemoveCompany(driverChrome);
    const createProjectTest = new CreateProject(driverChrome);

    try {
      await logginPageTest.openLoginForm();
      await logginPageTest.fillEmailInput(config.email);
      await logginPageTest.fillPasswordInput(config.password);
      await logginPageTest.checkSaveForFuture();
      await logginPageTest.login(config.urlhomePageForCheck);

      await removeCompany.goToCompanyList();
      //   await removeCompany.findCompany(newConpanyName, companiesPage);
      //   await removeCompany.removefindCompany(newConpanyName);
      await removeCompany.removeCompanyViaThreeDotsMenu(newConpanyName);
      await createProjectTest.goToDashboardTab(config.projects);
      await createProjectTest.checkDeleteItem(
        '.list-name-wrapper',
        newProjectName
      );
      //   await driverChrome.sleep(1000)
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_remove');
      throw error;
    }
  });
});
