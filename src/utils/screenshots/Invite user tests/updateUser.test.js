const { createWebdriverChrome } = require('../../webdriver');
const lambdaParameters = require('../../lambdaAddParameters');
const LoginPage = require('../../../classes/auth/login');
const UpdateUser = require('../../../classes/user/updateUser');
const makeScreenshot = require('../../makeScreenShot');
const { describe } = require('mocha');
const config = require('../../config');

describe('Invite users tests @S22695f61', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Update user name of Standard User @T3f07d02c', async () => {
    await lambdaParameters('update user name of the Employee', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const updateUser = new UpdateUser(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await updateUser.openUserForm();
      await updateUser.updateAndCheck(config.userSUName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Update user name of the company admin @T0dc5b5cd', async () => {
    await lambdaParameters(
      'update user name of the company admin',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const updateUser = new UpdateUser(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await updateUser.openUserForm();
      await updateUser.updateAndCheck(config.userCAName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_create');
      throw error;
    }
  });
  it('Update user name of the company admin for return old name @Tc86f4dfe', async () => {
    await lambdaParameters(
      'update user name of the company admin for return old name',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const updateUser = new UpdateUser(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await updateUser.openUserForm();
      await updateUser.updateAndCheck(config.userCAName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_create');
      throw error;
    }
  });
});
