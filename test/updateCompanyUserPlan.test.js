const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const EditCompany = require('../src/classes/company/editCompany');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Update Company User Plane and check it in the chrom browser, test-cases #4, 20, 11', async () => {
  // here add parameters for creation
  let driverChrome = null;

  const conpanyName = 'Check-plane';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
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

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

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

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

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
