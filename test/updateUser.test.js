const { createWebdriverChrom } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const UpdateUser = require('../src/classes/user/updateUser');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Update user name of the Employee and the company admin in the chrom browser, taste-cases # 14.1 in the CA, 5 in the SU', async () => {
  // here add parameters for creation
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('update user name of the Employee', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const updateUser = new UpdateUser(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailSU);
    await logginPageTest.fillPasswordInput(config.passwordSU);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      await updateUser.openUserForm();
      await updateUser.updateAndCheck(config.userSUName);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_create');
      throw error;
    }
  });

  it('update user name of the company admin', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const updateUser = new UpdateUser(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailCA);
    await logginPageTest.fillPasswordInput(config.passwordCA);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      await updateUser.openUserForm();
      await updateUser.updateAndCheck(config.userCAName);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_create');
      throw error;
    }
  });
  it('update user name of the company admin for return old name', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const updateUser = new UpdateUser(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailCA);
    await logginPageTest.fillPasswordInput(config.passwordCA);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      await updateUser.openUserForm();
      await updateUser.updateAndCheck(config.userCAName);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_create');
      throw error;
    }
  });
});
