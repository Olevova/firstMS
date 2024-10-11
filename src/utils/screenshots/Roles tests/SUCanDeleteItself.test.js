const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const UpdateUser = require('../../src/classes/user/updateUser');
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

  it("SU can delete itself @T03203956", async () => {
    await lambdaParameters("SU can delete itself @T03203956", driverChrome);
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
      await updateUser.openUserMenuPage();
      await updateUser.clickElement(config.locatotDeleteUserOpenModalCss);
      const delBtnMissing = await updateUser.checkMissingElement(config.locatorDeletePoUpBtnCss);
      if(!delBtnMissing){
        console.log("SU can delete itself test passed");   
      }
      else{
        throw new Error("SU can delete itself test failed")
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'SU_can_edit_own_User_Name');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


});
