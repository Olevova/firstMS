const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const InviteUser = require('../../src/classes/user/inviteUser');
const LoginPage = require('../../src/classes/auth/login');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Invite users tests @S22695f61', async () => {
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

  it('Invite PM to company @T4ed1496e', async () => {
    await lambdaParameters('invite user by the super admin, ', driverChrome);

    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

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
      await lambdaParameters('passed', driverChrome);
      await driverChrome.sleep(1000);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_create_by_SA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Invite CA to company', async () => {
    await lambdaParameters('Invite CA to company, ', driverChrome);

    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await inviteUserTest.goToInviteUsersForm('sa');
      await inviteUserTest.fillInviteForm(
        config.emailUseForTestCA,
        config.companyName,
      );
      await inviteUserTest.checkNewUser(
        config.emailUseForTestCA,
        config.usersPage
      );
      await lambdaParameters('passed', driverChrome);
      await driverChrome.sleep(1000);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_create_by_SA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


  it('Delete user from company @Tc2677be5', async () => {
    await lambdaParameters('remove user by the super admin', driverChrome);
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeUserTest = new InviteUser(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await removeUserTest.goToUserList('sa');
      await removeUserTest.findUser(config.emailUseForTest, config.usersPage);
      await removeUserTest.removefindUser();
      await removeUserTest.notificationCheck();
      await removeUserTest.checkDeleteItem(
        '.user-email',
        config.emailUseForTest
      );
      await removeUserTest.findUser(config.emailUseForTestCA, config.usersPage);
      await removeUserTest.removefindUser();
      await removeUserTest.notificationCheck();
      await removeUserTest.checkDeleteItem(
        '.user-email',
        config.emailUseForTestCA
      );
      // await removeUserTest.checkIfUserRemove(
      //   config.emailUseForTest,
      //   config.usersPage
      // );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_remove_by_SA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
