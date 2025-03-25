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

  it('CA can invite a new user to the project @T17f1bcb1', async () => {
    await lambdaParameters(
      'CA can invite a new user to the project',
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );
    try {
      await inviteUserTest.goToView(config.projectNameMain, 'ca');
      await inviteUserTest.goToSelectTab(config.users);
      await inviteUserTest.openInviteUserFormInProject();
      await inviteUserTest.fillInviteFormByCA(
        config.inviteUserEmail,
        config.projManager
      );
      await inviteUserTest.checkCreateNewUser(config.inviteUserEmail);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_invite_in_project_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('CA can edit unconfirmed company user @Tacb752b5', async () => {
    await lambdaParameters(
      'CA can edit unconfirmed company user',
      driverChrome
    );
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);
    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await inviteUserTest.goToUserList('ca');
      await inviteUserTest.findUser(
        config.inviteUserEmail,
        config.mainCompanyPage
      );
      await inviteUserTest.updateAndCheck(
        config.inviteUserName,
        true,
        config.inviteUserPhone,
        false,
        true
      );
      await inviteUserTest.checkCreateNewUser(config.inviteUserEmail);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_edit_unconfirmed_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('CA can edit company User Details @T6233cb25', async () => {
    await lambdaParameters('CA can edit company User Details', driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);
    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await inviteUserTest.goToUserList('ca');
      await inviteUserTest.findUser(
        config.inviteUserEmail,
        config.mainCompanyPage
      );
      await inviteUserTest.updateAndCheck(
        config.inviteUserNameEdit,
        true,
        config.inviteUserPhone,
        config.inviteUserNewEmail,
        true
      );
      await inviteUserTest.checkCreateNewUser(config.inviteUserNewEmail);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_edit_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('CA can delete company users @Tee6f30dc', async () => {
    await lambdaParameters('remove user by the company admin', driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeUserTest = new InviteUser(driverChrome);
    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await removeUserTest.goToUserList('ca');
      await removeUserTest.findUser(
        config.inviteUserNewEmail,
        config.mainCompanyPage
      );
      await removeUserTest.removefindUser();
      await removeUserTest.checkIfUserRemove(
        config.inviteUserNewEmail,
        config.mainCompanyPage
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_remove_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('CA can delete unconfirmed company user @T2a80b517', async () => {
    await lambdaParameters(
      'CA can delete unconfirmed company user',
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);
    
    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );
    try {
      await inviteUserTest.goToView(config.projectNameMain, 'ca');
      await inviteUserTest.goToSelectTab(config.users);
      await inviteUserTest.openInviteUserFormInProject();
      await inviteUserTest.fillInviteFormByCA(
        config.inviteUserEmail,
        config.projManager
      );
      await inviteUserTest.checkCreateNewUser(config.inviteUserEmail);
      await inviteUserTest.goToUserList('ca');
      await inviteUserTest.findUser(
        config.inviteUserEmail,
        config.mainCompanyPage
      );
      await inviteUserTest.removefindUser();
      await inviteUserTest.checkIfUserRemove(
        config.inviteUserEmail,
        config.mainCompanyPage
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(
        driverChrome,
        'user_unconfirmed_delete_from_project_by_CA'
      );
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
