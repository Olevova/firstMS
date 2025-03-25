const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const InviteUser = require('../../src/classes/user/inviteUser');
const LoginPage = require('../../src/classes/auth/login');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
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

  it('CA can add Existing User to the project @T7c8063fa', async () => {
    await lambdaParameters(
      'CA can add Existing User to the project @T7c8063fa',
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");
    const addRemoveUserToProject = new InviteUser(driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );
    try {
      await addRemoveUserToProject.goToView(config.projectNameMain, 'ca');
      await addRemoveUserToProject.goToSelectTab(config.users);
      await addRemoveUserToProject.addExistingUser(config.taskTestUserPM);
      await addRemoveUserToProject.removeUserFromProject(config.taskTestUserPM);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_invite_in_project_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  
});
