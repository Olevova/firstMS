const { createWebdriverChrom } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const CreateCompany = require('../src/classes/company/createCompany');
const RemoveCompany = require('../src/classes/company/removeCompany');
const EditCompany = require('../src/classes/company/editCompany');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Create, edit and remove company in the chrom browser, test-cases #4, 20, 11', async () => {
  // here add parameters for creation
  
  let driverChrome = null;

  const newConpanyName = 'Fortest';
  const newCompanyStreet = 'test2';
  const newCompanyApp = '15';
  const newCompanyZip = '00000';
  const newCompanyPhone = '+1111112111';
  const newCompanyEmail = 'fortest@test.com';
  const newCompanyPlan = 'Enterprise';
  const newCompanyType = 'tiling';
  const newCompanyState = 'New York';
  const newCompanyCity = 'New York';

  const editCompanyName = 'Fortestedit';

  beforeEach(async () => {
    console.log(process.env);
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create new company', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createCompany = new CreateCompany(driverChrome);

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
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_create');
      throw error;
    }
  });

  it('edit new company', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editCompany = new EditCompany(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await editCompany.goToCompanyList();
      await editCompany.findCompany(newConpanyName, config.companiesPage);
      await editCompany.editCompany(editCompanyName);
      // await editCompany.checkCompanyPlane('Enterprise',1000)
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_edit');
      throw error;
    }
  });

  it('remove company', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeCompany = new RemoveCompany(driverChrome);

    try {
      await logginPageTest.openLoginForm();
      await logginPageTest.fillEmailInput(config.email);
      await logginPageTest.fillPasswordInput(config.password);
      await logginPageTest.checkSaveForFuture();
      await logginPageTest.login(config.urlhomePageForCheck);

      await removeCompany.goToCompanyList();
      await removeCompany.findCompany(editCompanyName, config.companiesPage);
      await removeCompany.removefindCompany(editCompanyName);
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_remove');
      throw error;
    }
  });
});
