const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const EditCompany = require('../../src/classes/company/editCompany');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Company management tests @Sb36e9099', async () => {
  let driverChrome = null;

  const conpanyName = 'Check-plane';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('edit company plane from Custom to the Team', async () => {
    await lambdaParameters(
      'edit company plane from Custom to the Team',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editCompany = new EditCompany(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await editCompany.goToCompanyList();
      await editCompany.findCompany(conpanyName, config.companiesPage);
      await editCompany.editCompanyPlan('Team');
      await editCompany.checkCompanyPlane('Team', 20);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_plan_check');
      throw error;
    }
  });

  it('edit company plane from Team to the Custom', async () => {
    await lambdaParameters(
      'edit company plane from Custom to the Team',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editCompany = new EditCompany(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await editCompany.goToCompanyList();
      await editCompany.findCompany(conpanyName, config.companiesPage);
      await editCompany.editCompanyPlan('Custom', 1000);
      await editCompany.checkCompanyPlane('Custom', 1000);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_plan_check');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
