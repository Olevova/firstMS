const { createWebdriverChrom } = require('../src/utils/webdriver');
const InviteUser = require('../src/classes/user/inviteUser');
const LoginPage = require('../src/classes/auth/login');
const RemoveUser = require('../src/classes/user/removeUser');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const should = require('chai').should();
const config = require('../src/utils/config');

describe('Invite and remove user by the Company Admin on the User tab and check the counter of avaliable invitations by the PM, test-cases in the CA #5, 29.1,in the PM 189', async () => {
 // time and site or lochalhost there tests are going
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
    return;
  });

  it('invite user by the company admin', async () => {
    // await driverChrome.executeScript("document.body.style.zoom='50%'");

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);
    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailCA);
    await logginPageTest.fillPasswordInput(config.passwordCA);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      await inviteUserTest.goToInviteUsersForm('ca');
      await inviteUserTest.fillInviteFormByCA(config.emailUseForTest, 'Company Admin');
      await inviteUserTest.checkCreateNewUser(config.emailUseForTest);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_create_by_CA');
      throw error;
    }
  });

  it('Check the counter of avaliable invitations by the PM test-cases in the PM 189', async () => {
    // await driverChrome.executeScript("document.body.style.zoom='50%'");

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);
    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailPM);
    await logginPageTest.fillPasswordInput(config.passwordPM);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      await inviteUserTest.checkNumberOfUsersInUsersList('pm');
      await inviteUserTest.checkAvailibleNumberOfUsersInInviteForm();

      //   await inviteUserTest.checkCreateNewUser(config.emailUseForTest);
    } catch (error) {
      await makeScreenshot(driverChrome, 'check_avaliable_invitations');
      throw error;
    }
  });

  it('remove user by the company admin', async () => {
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeUserTest = new RemoveUser(driverChrome);
    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailCA);
    await logginPageTest.fillPasswordInput(config.passwordCA);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      await removeUserTest.goToUserList('ca');
      await removeUserTest.findUser(config.emailUseForTest, config.mainCompanyUsersPage);
      await removeUserTest.removefindUser();
      await removeUserTest.checkIfUserRemove(config.emailUseForTest, config.mainCompanyUsersPage);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_remove_by_CA');
      throw error;
    }
  });
});
