const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const AddRemoveUserToProject = require('../../src/classes/user/addAndRemoveUserToProject');
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

  it('Select Add all Users on Add existing user form and unselect the user', async () => {
    await lambdaParameters(
      'Select Add all Users on Add existing user form and unselect the user',
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");
    const addRemoveUserToProject = new AddRemoveUserToProject(driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );
    try {
      await addRemoveUserToProject.goToView(config.projectNameForSU);
      await addRemoveUserToProject.goToSelectTab(config.users);
      await addRemoveUserToProject.removeUserFromProject(config.taskTestUser);
      await addRemoveUserToProject.removeUserFromProject(config.taskTestUserPM);
      await addRemoveUserToProject.addAllExistingUser(false);
      await addRemoveUserToProject.unselectUser(config.taskTestUserPM);
      await lambdaParameters('passed', driverChrome);
   
    } catch (error) {
      await makeScreenshot(driverChrome, 'add_all_users_on_add_existing_form_unselect');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
  
  it('Adding all Users on Add existing user form and click "Cancel"', async () => {
    await lambdaParameters(
      'Adding all Users on Add existing user form and click "Cancel"',
      driverChrome
    );
    const addRemoveUserToProject = new AddRemoveUserToProject(driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );
    try {
      await addRemoveUserToProject.goToView(config.projectNameForSU);
      await addRemoveUserToProject.goToSelectTab(config.users);
      const startNumberUser = await addRemoveUserToProject.numberOfItemsInTheList(config.locatorCompanyListCss)
      console.log(startNumberUser);
      await addRemoveUserToProject.addAllExistingUser(false);
      await addRemoveUserToProject.clickElement(config.locatorCancelPoUpBtnCss);
      await driverChrome.sleep(500);
      const endNumberUser = await addRemoveUserToProject.numberOfItemsInTheList(config.locatorCompanyListCss)
      if(startNumberUser!==endNumberUser){
        throw new Error('Test failed, cancel not work')
      }
      console.log('Test passed');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'add_all_users_on_add_existing_form_cancel');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


  it('Add all Users on Add existing user form', async () => {
    await lambdaParameters(
      'Add all Users on Add existing user form',
      driverChrome
    );
    const addRemoveUserToProject = new AddRemoveUserToProject(driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );
    try {
      await addRemoveUserToProject.goToView(config.projectNameForSU);
      await addRemoveUserToProject.goToSelectTab(config.users);
      await addRemoveUserToProject.addAllExistingUser();
      const noUsers = await addRemoveUserToProject.addAllExistingUser().catch((error)=>error.message);        
      if(noUsers === 'Users list empty'){
        console.log('Test passed');
      }
      else{
        throw new Error('Test failed')
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'add_all_users_on_add_existing_form');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
