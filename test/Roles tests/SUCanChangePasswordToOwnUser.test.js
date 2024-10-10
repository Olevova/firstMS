const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const LogOut = require('../../src/classes/auth/logOut');
const UpdateUser = require('../../src/classes/user/updateUser');
const ForgotPassword = require('../../src/classes/auth/forgotPassword');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');
const { customAlphabet } = require('nanoid')


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
    const updateUser = new UpdateUser(driverChrome);
    const changePassword = new ForgotPassword(driverChrome);
    const logOutUserTest = new LogOut(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await updateUser.openUserMenuPage();
      await changePassword.changePasswordOwnUser(config.passwordSU, config.passwordSUForChange);
      await logOutUserTest.findUserMenu();
      await logOutUserTest.userLogOut(config.urlLoginPage);
      await logginPageTest.userLogIn(
        config.emailSU,
        config.passwordSUForChange,
        config.mainCompanyPage
      );
      await updateUser.openUserMenuPage();
      await changePassword.changePasswordOwnUser(config.passwordSUForChange, config.passwordSU);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'SU_can_edit_own_User_Name');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


});