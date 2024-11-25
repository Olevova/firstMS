const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const InviteUser = require('../../src/classes/user/inviteUser');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');
const { customAlphabet } = require('nanoid')


describe('Standard User role @S7e09d7c0', async () => {
  let driverChrome = null;
  const nanoid  = customAlphabet('1234567890', 10);

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it("SU can edit it's own User Details @T6e7203f6", async () => {
    await lambdaParameters("SU can edit it's own User Details @T6e7203f6", driverChrome);
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
      await updateUser.openUserForm();
      await updateUser.updateAndCheck(config.userSUNameEdit,false, nanoid());
      await updateUser.openUserForm();
      await updateUser.updateAndCheck(config.userSUName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'SU_can_edit_own_User_Name');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


});
