const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const InviteUser = require('../src/classes/user/inviteUser');
const LoginPage = require('../src/classes/auth/login');
const RemoveUser = require('../src/classes/user/removeUser');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Invite and remove user  test-cases #7, 13', async () => {
  // here add parameters for creation
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

  it('invite user by the super admin', async () => {
    await lambdaParameters('invite user by the super admin, ',driverChrome);
    // await driverChrome.executeScript("document.body.style.zoom='50%'");

    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await inviteUserTest.goToInviteUsersForm('sa');
      await inviteUserTest.fillInviteForm(
        config.emailUseForTest,
        config.companyName,
        config.projManager
      );
      await inviteUserTest.checkNewUser(
        config.emailUseForTest,
        config.usersPage
      );
      await lambdaParameters('passed',driverChrome);
      await driverChrome.sleep(1000);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_create_by_SA');
      await lambdaParameters('failed',driverChrome);
      throw error;
    }
  });

  it('remove user by the super admin', async () => {
    await lambdaParameters('remove user by the super admin',driverChrome);
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeUserTest = new RemoveUser(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await removeUserTest.goToUserList('sa');
      await removeUserTest.findUser(config.emailUseForTest, config.usersPage);
      await removeUserTest.removefindUser();
      await removeUserTest.checkIfUserRemove(
        config.emailUseForTest,
        config.usersPage
      );
      await lambdaParameters('passed',driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_remove_by_SA');
      await lambdaParameters('failed',driverChrome);
      throw error;
    }
  });
});
