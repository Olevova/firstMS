const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const InviteUser = require('../../src/classes/user/inviteUser');
const LoginPage = require('../../src/classes/auth/login');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Company admin role @Se7b2355c', async () => {
  let driverChrome = null;
  const userSUName = ['PM_parallel', 'SU_parallel']

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
    return;
  });

  it('CA can multiselect company user @Tbe25b072', async () => {
    await lambdaParameters(
      'CA can multiselect company user',
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );
    try {
      await inviteUserTest.goToView(config.projectNameMain, 'ca');
      await inviteUserTest.goToUserList('ca');
      await inviteUserTest.checkElFromArrayInList(userSUName, config.locatorUserNames);
      await inviteUserTest.checkCounter(userSUName.length);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_multiselect_company_user_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

});
