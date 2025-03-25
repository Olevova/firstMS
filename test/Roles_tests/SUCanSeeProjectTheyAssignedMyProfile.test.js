const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const InviteUser = require('../../src/classes/user/inviteUser');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');


describe('Standard User role @S7e09d7c0', async () => {

  let driverChrome = null;
  let projectsInProjectsList;
  let projectsInMenu;
  let clickProjectTitle;
  
  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it("SU can see project they are assigned to My Profile page @T885e2a18", async () => {
    await lambdaParameters("SU can see project they are assigned to My Profile page @T885e2a18", driverChrome);
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
      await updateUser.clickElement(config.locatorProjectsLinkCss);
      await updateUser.waitListDate(config.locatorProjectsCss, 11);
      projectsInProjectsList = await updateUser.numberOfItemsInTheList(config.locatorCompanyListCss);
      await updateUser.openUserMenuPage();
      console.log(projectsInProjectsList);
      
      await updateUser.waitListDate(config.locatorListOfProjectInProfileCss, 4);
      projectsInMenu = await updateUser.numberOfItemsInTheList(config.locatorListOfProjectInProfileCss);
      console.log(projectsInMenu);
      if(projectsInProjectsList !== projectsInMenu){
        throw new Error('Test failed, User cannot see project they are assigned to My Profile page');
      }
      clickProjectTitle = await updateUser.getElementText(config.locatorProjectTitleCss);
      console.log(clickProjectTitle);
      await updateUser.clickElement(config.locatorViewProjectBtnUserMenuCss);
      await updateUser.waitListDate('app-project-details', 1);
      const projectName = await updateUser.getElementText(config.locatorProjectHeaderTitleCss);
      if(clickProjectTitle === projectName){
        console.log('Test passed, User can see project they are assigned to My Profile page ');
      }
      else{
        throw new Error('Test failed, User cannot see project they are assigned to My Profile page');
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'SU_can_see_project_Name_in profile');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
