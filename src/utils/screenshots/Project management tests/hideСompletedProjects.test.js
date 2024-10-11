const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CheckProjects = require('../../src/classes/project/checkProjects');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Project management tests @Sbae16311', async () => {
  let driverChrome = null;
  let doneStatus;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Hide completed projects @T0ac26714', async () => {
    await lambdaParameters('Hide completed projects', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const checkProject = new CheckProjects(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await checkProject.goToProjectList();
      await checkProject.waitListDate('.table-projects__row', 21);
      await driverChrome.sleep(1000);
      doneStatus = await checkProject.checkProjectsListHaveDoneProjects();
      if (doneStatus) {
        console.log('click hide');
        await driverChrome.sleep(500);
        await checkProject.clickElement('.hide-completed-btn');
        await driverChrome.sleep(1000);
        console.log('click hide 2');
        await checkProject.waitListDate('.table-projects__row', 3);
        await driverChrome.sleep(500);
        doneStatus = await checkProject.checkProjectsListHaveDoneProjects();
        if (!doneStatus) {
          console.log('click show');
          await checkProject.clickElement('.hide-completed-btn');
          await driverChrome.sleep(1000);
          console.log('click show2');
          await checkProject.waitListDate('.table-projects__row', 3);
          await driverChrome.sleep(500);
          doneStatus = await checkProject.checkProjectsListHaveDoneProjects();
          if (!doneStatus) {
            throw new Error('Test failed, button not work');
          }
          console.log('test passed');
        } else {
          throw new Error('Test failed, button not work');
        }
      } else {
        throw new Error('Project list has not project with Done Status');
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_complite_hide');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
