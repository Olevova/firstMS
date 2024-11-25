const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateProject = require('../../src/classes/project/createProject');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Standard User role @S7e09d7c0', async () => {
  let driverChrome = null;
  let startProjectsNumber;
  let endProjectsNumber;
  let projName;
  const clientName = 'su test';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  // it('SU search through the projects @T7bfd1eea', async () => {
  //   await lambdaParameters(
  //     'SU search through the projects @T7bfd1eea',
  //     driverChrome
  //   );
  //   // time and site or lochalhost there tests are going
  //   console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

  //   const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  //   const searchProject = new CreateProject(driverChrome);

  //   await logginPageTest.userLogIn(
  //     config.emailSU,
  //     config.passwordSU,
  //     config.mainCompanyPage
  //   );

  //   try {
  //     await searchProject.clickElement(config.locatorProjectsLinkCss);
  //     await searchProject.waitListDate(config.locatorProjectsCss, 4);
  //     startProjectsNumber = await searchProject.numberOfItemsInTheList(
  //       config.locatorCompanyListCss
  //     );
  //     await searchProject.enterTextInSearchInput(config.projectNameForSU);
  //     await searchProject.waitListDate(config.locatorProjectsCss, 1);
  //     endProjectsNumber = await searchProject.numberOfItemsInTheList(
  //       config.locatorCompanyListCss
  //     );
  //     projName = await searchProject.getElementText(
  //       config.locatorProjectNameInListCss
  //     );
  //     if (
  //       startProjectsNumber > endProjectsNumber &&
  //       projName === config.projectNameForSU
  //     ) {
  //       console.log(`Test passed, you search project is ${projName}`);
  //     } else {
  //       throw new Error('Test search through the projects failed');
  //     }
  //     await lambdaParameters('passed', driverChrome);
  //   } catch (error) {
  //     await makeScreenshot(driverChrome, 'search_through_the_projects_by_SU');
  //     await lambdaParameters('failed', driverChrome);
  //     throw error;
  //   }
  // });

  it('SU can filter projects @Tcd3ea846', async () => {
    await lambdaParameters('SU can filter projects @Tcd3ea846', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const filterProject = new CreateProject(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSUSecond,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await filterProject.clickElement(config.locatorProjectsLinkCss);
      await filterProject.waitListDate(config.locatorProjectsCss, 4);
      startProjectsNumber = await filterProject.numberOfItemsInTheList(
        config.locatorCompanyListCss
      );
      await filterProject.filterProject('su', clientName);
      endProjectsNumber = await filterProject.numberOfItemsInTheList(
        config.locatorCompanyListCss
      );
      projClient = await filterProject.getElementText(
        config.locatorProjectClientNameCss
      );
      
      
      if (
        startProjectsNumber > endProjectsNumber 
      ) {
        console.log(`Test passed, you search client name is ${projClient}`);
      } else {
        throw new Error('Test filter projects failed');
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'filter_the_projects_by_SU');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
