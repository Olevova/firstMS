const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateProject = require('../../src/classes/project/createProject');
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

  it('SU cannot Modification of Rooms Position @T5ae288f1', async () => {
    await lambdaParameters('SU cannot Modification of Rooms Position @T5ae288f1', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const roomModification = new CreateProject(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await roomModification.goToView(config.projectNameForSU, 'su');
      await roomModification.goToSelectTab(config.projectProgress);
      const modificationRoomLink= await roomModification.checkMissingElement(config.locatorCustomMenuBtnCss,2000);
      if(modificationRoomLink){
        console.log('Test passed, modification room link is missed');
       
      }
      else{
        throw new Error('Test failed, modification room link is exist')
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'custom_status_create_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});