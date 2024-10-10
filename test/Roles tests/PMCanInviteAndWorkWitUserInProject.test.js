const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const InviteUser = require('../../src/classes/user/inviteUser');
const LoginPage = require('../../src/classes/auth/login');
const RemoveUser = require('../../src/classes/user/removeUser');
const AddRemoveUserToProject = require('../../src/classes/user/addAndRemoveUserToProject');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');
const { By, until, error } = require('selenium-webdriver');

describe('Project management role @Sfbe51cff', async () => {
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

  it("PM can invite a user to project via project's user tab @T09e15608", async () => {
    await lambdaParameters(
      "PM can invite a user to project via project's user tab @T09e15608",
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");
    const inviteUserTest = new InviteUser(driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );
    try {
      await inviteUserTest.goToView(config.projectNameForPM, 'pm');
      await inviteUserTest.goToSelectTab(config.users);
      await inviteUserTest.openInviteUserFormInProject();
      await inviteUserTest.fillInviteFormByCA(
        config.inviteUserEmail,
        false
      );
      await inviteUserTest.checkCreateNewUser(config.inviteUserEmail);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_invite_in_project_via_project_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it("PM can invite user to project @T52c3796c", async () => {
    await lambdaParameters(
      "PM can invite user to project @T52c3796c",
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");
    const inviteUserTest = new InviteUser(driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );
    try {
      await inviteUserTest.goToView(config.projectNameForPM, 'pm');
      await inviteUserTest.goToInviteUsersForm('pm');
      await inviteUserTest.fillInviteFormByCA(
        config.inviteUserEmailSU
      );
      await inviteUserTest.checkCreateNewUser(config.inviteUserEmailSU);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_invite_in_project_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('SA can delete unconfirmed company user', async () => {
    await lambdaParameters(
      'SA can delete unconfirmed company user',
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeUserTest = new RemoveUser(driverChrome);
    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );
    try {
      await removeUserTest.goToUserList('sa');
      await removeUserTest.findUser(
        config.inviteUserEmail,
        config.usersPage
      );
      await removeUserTest.removefindUser();
      await removeUserTest.checkIfUserRemove(
        config.inviteUserEmail,
        config.usersPage
      );
      await removeUserTest.findUser(
        config.inviteUserEmailSU,
        config.usersPage
      );
      await removeUserTest.removefindUser();
      await removeUserTest.checkIfUserRemove(
        config.inviteUserEmailSU,
        config.usersPage
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_unconfirmed_delete_from_project_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM cannot delete user from company @T28ed51e3', async () => {
    await lambdaParameters('PM cannot delete user from company', driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeUserTest = new RemoveUser(driverChrome);
    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await removeUserTest.goToUserList('pm');
      await driverChrome.sleep(2000);
      const missingThreeDotsMenu = await removeUserTest.findUser(
         config.taskTestUserEmail,
         config.mainCompanyUsersPage
      ).catch(() => null);
      console.log(missingThreeDotsMenu, 'missingThreeDotsMenu');
      
      if(missingThreeDotsMenu === null){
        console.log('PM cannot delete user from company via Three dots menu, test passed');
      }
      else {
        throw new Error('PM can delete user from company via Three dots menu')
      }
      await removeUserTest.findAndClickOnLinInTheList(config.taskTestUser,'.list-name-wrapper');
      await driverChrome.wait(until.elementLocated(By.css('app-user-profile .table-details-wrapper')),10000);
      const deleteBtn = await removeUserTest.checkMissingElement(config.locatorDeleteUserCss, 1000);
      console.log(deleteBtn);
      
      if(deleteBtn){
        console.log('Test passed PM cannot delete User');
        
      }
      if(!deleteBtn){
        throw new Error('PM can delete User, test failed')
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_cannot_remove_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM cannot edit user @T1b33f616', async () => {
    await lambdaParameters('PM cannot edit user', driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeUserTest = new RemoveUser(driverChrome);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await removeUserTest.goToUserList('pm');
      const missingThreeDotsMenu = await removeUserTest.findUser(
         config.taskTestUserEmail,
         config.mainCompanyUsersPage
      ).catch(() => null);
      console.log(missingThreeDotsMenu, 'missingThreeDotsMenu');
      
      if(missingThreeDotsMenu === null){
        console.log('PM cannot edit user from company via Three dots menu, test passed');
      }
      else {
        throw new Error('PM can delete edit from company via Three dots menu')
      }
      await removeUserTest.findAndClickOnLinInTheList(config.taskTestUser,'.list-name-wrapper');
      await driverChrome.wait(until.elementLocated(By.css('app-user-profile .table-details-wrapper')),10000);
      const deleteBtn = await removeUserTest.checkMissingElement(config.locatorEditUserCss, 1000);
      console.log(deleteBtn);
      
      if(deleteBtn){
        console.log('Test passed PM cannot edit User');
        
      }
      if(!deleteBtn){
        throw new Error('PM can edit User, test failed')
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_cannot_edit_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM can add existing users to the project via project user tab @Tcbfb9612', async () => {
    await lambdaParameters(
      'PM can add existing users to the project via project user tab',
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");
    const addRemoveUserToProject = new AddRemoveUserToProject(driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );
    try {
      await addRemoveUserToProject.goToView(config.projectNameForPM, 'pm');
      await addRemoveUserToProject.goToSelectTab(config.users);
      await addRemoveUserToProject.addExistingUser(config.taskTestUser);
      // await addRemoveUserToProject.removeUserFromProject(config.taskTestUser);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_invite_in_project_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM cannot delete user from project exept Standard User @Tb11b2a25', async () => {
    await lambdaParameters(
      'PM cannot delete user from project exept Standard User',
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");
    const addRemoveUserToProject = new AddRemoveUserToProject(driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );
    try {
      await addRemoveUserToProject.goToView(config.projectNameForPM, 'pm');
      await addRemoveUserToProject.goToSelectTab(config.users);
      await addRemoveUserToProject.removeUserFromProject(config.taskTestUser).catch(()=> null);
      const canDeleteCA = await addRemoveUserToProject.removeUserFromProject(config.taskTestUserPM).catch(()=>null);
      if(canDeleteCA === null){
        console.log('Test passed, PM cannot delete user from project exept Standard User ');
      }
      else{
        throw new Error('Test failed, PM can delete user from project exept Standard User')
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_invite_in_project_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

});
