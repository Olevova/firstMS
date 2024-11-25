const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateCompany = require('../../src/classes/company/createCompany');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Company management tests @Sca85247d', async () => {
  let driverChrome = null;

  const newConpanyName = 'Fortest';
  const editCompanyName = 'Fortestedit';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Create new company @T39b080c5', async () => {
    await lambdaParameters('Create new company', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createCompany = new CreateCompany(driverChrome);
   

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
        config.newCompanyApp,
        config.newCompanyState,
        config.newCompanyCity,
        config.newCompanyZip,
        config.newCompanyPhone,
        config.newCompanyEmail,
        config.newCompanyPlan,
        config.newCompanyType
      );
      await createCompany.checkCreationOfNewCompany();
      await driverChrome.sleep(500);
      await createCompany.findCompany(newConpanyName, config.companiesPage);
      await createCompany.checkCompanyPlane(config.newCompanyPlan, 10000);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Update a company @Td9fe49ea0', async () => {
    await lambdaParameters('Update a company', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editCompany = new CreateCompany(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await editCompany.goToCompanyList();
      await editCompany.findCompany(newConpanyName, config.companiesPage);
      await editCompany.editCompany(editCompanyName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_edit');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Delete company @T9b9142ee', async () => {
    await lambdaParameters('Delete company', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeCompany = new CreateCompany(driverChrome);

    try {
      await logginPageTest.userLogIn(
        config.email,
        config.password,
        config.urlhomePageForCheck
      );

      await removeCompany.goToCompanyList();
      await removeCompany.findCompany(editCompanyName, config.companiesPage);
      await removeCompany.removefindCompany(editCompanyName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await lambdaParameters('failed', driverChrome);
      await makeScreenshot(driverChrome, 'company_remove');
      throw error;
    }
  });
});
