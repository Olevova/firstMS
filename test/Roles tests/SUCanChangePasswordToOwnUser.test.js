const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const InviteUser = require('../../src/classes/user/inviteUser');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');



describe('Standard User role @S7e09d7c0', async () => {
  let driverChrome = null;
  
  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it("SU can change password to own user @T11c6a55b", async () => {
    await lambdaParameters("SU can change password to own user @T11c6a55b", driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const updateUser = new InviteUser(driverChrome);
    

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await updateUser.openUserMenuPage();
      await logginPageTest.changePasswordOwnUser(config.passwordSU, config.passwordSUForChange);
      await logginPageTest.findUserMenu();
      await logginPageTest.userLogOut(config.urlLoginPage);
      await logginPageTest.userLogIn(
        config.emailSU,
        config.passwordSUForChange,
        config.mainCompanyPage
      );
      await updateUser.openUserMenuPage();
      await logginPageTest.changePasswordOwnUser(config.passwordSUForChange, config.passwordSU);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'SU_can_change_password_own_User_Name');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


});