const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const UpdateUser = require('../../src/classes/user/updateUser');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Project management role @Sfbe51cff', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it("PM can edit it's own User Details", async () => {
    await lambdaParameters("PM can edit it's own User Name", driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const updateUser = new UpdateUser(driverChrome);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await updateUser.openUserForm();
      await updateUser.updateAndCheck(config.userPMNameEdit);
      await updateUser.openUserForm();
      await updateUser.updateAndCheck(config.userPMName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'PM_can_edit_own_User_Name');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


});
