const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const InviteUser = require('../../src/classes/user/inviteUser');
const LoginPage = require('../../src/classes/auth/login');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const should = require('chai').should();
const config = require('../../src/utils/config');

describe('Company admin role @Se7b2355c', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
    return;
  });

  it('invite user by the company admin @T792c328f', async () => {
    await lambdaParameters('invite user by the company admin', driverChrome);
    // await driverChrome.executeScript("document.body.style.zoom='50%'");

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );
    try {
      await inviteUserTest.goToInviteUsersForm('ca');
      await inviteUserTest.fillInviteFormByCA(
        config.emailUseForTest,
        config.companyUser
      );
      await inviteUserTest.checkCreateNewUser(config.emailUseForTest);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_create_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Check the counter of avaliable invitations by the PM @T1783d43c', async () => {
    await lambdaParameters(
      'Check the counter of avaliable invitations by the PM',
      driverChrome
    );

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);
    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await inviteUserTest.checkNumberOfUsersInUsersList('pm');
      await inviteUserTest.checkAvailibleNumberOfUsersInInviteForm();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'check_avaliable_invitations');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('remove user by the company admin @T307ff4af', async () => {
    await lambdaParameters('remove user by the company admin', driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeUserTest = new InviteUser(driverChrome);
    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await removeUserTest.goToUserList('ca');
      await removeUserTest.findUser(
        config.emailUseForTest,
        config.mainCompanyPage
      );
      await removeUserTest.removefindUser();
      await removeUserTest.checkIfUserRemove(
        config.emailUseForTest,
        config.mainCompanyPage
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_remove_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
