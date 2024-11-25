const { createWebdriverChrome } = require('../webdriver');
const LoginPage = require('../../classes/auth/login');
// const ChangeAreaStatus = require('../../classes/view/area/changeAreaStatusInView');
// const ChangeAreaStatusInProjectProgress = require('../../classes/view/area/changeAreaStatusInProjectProgress');
// const CreateArea = require('../../src/classes/view/area/createArea');
const makeScreenshot = require('../makeScreenShot');
const { describe } = require('mocha');
const should = require('chai').should();
const config = require('../config');


describe('check metrics', async () => {
  // here add parameters for creation
  let driverChrome = null;

  // const URL = 'http://frontend-cj:4200/login';
  // const urlForCheck = "http://frontend-cj:4200/system/dashboard";
  // const companiesPage = 'http://frontend-cj:4200/system/companies';

  const companiesPage =
    'https://dev-frontend.colorjob.terenbro.com/system/companies';
  const URL = 'https://dev-frontend.colorjob.terenbro.com/login';
  const urlForCheck =
    'https://dev-frontend.colorjob.terenbro.com/system/dashboard';
  const email = 'superadmin@gmail.com';
  const password = 'colorjob';
  const project = 'testing template';
  let obtainedMetrics;
  let performance;
  let navigationTimings;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  // it('check metrics', async () => {
  //   // time and site or lochalhost there tests are going
  //   console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

  //   const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  //   const changeAreaStatusInProgress = new ChangeAreaStatusInProjectProgress(
  //     driverChrome
  //   );

  //   await logginPageTest.userLogIn(
  //     config.email,
  //     config.password,
  //     config.urlhomePageForCheck
  //   );

  //   try {
  //     await changeAreaStatusInProgress.goToView(project);
  //     await changeAreaStatusInProgress.goToSelectTab('Project Progress');
  //     await driverChrome.sendAndGetDevToolsCommand('Performance.enable');
  //     obtainedMetrics = await driverChrome.sendAndGetDevToolsCommand(
  //       'Performance.getMetrics'
  //     );
  //     performance = await driverChrome.executeScript(
  //       'return window.performance.timing;'
  //     );
  //     navigationTimings = await driverChrome.executeScript(
  //       "return window.performance.getEntriesByType('navigation')"
  //     );
  //     // const timeToFirstByte = performance.responseStart - performance.requestStart;
  //     // console.log(`Time to First Byte (TTFB): ${timeToFirstByte} ms`);
  //     // const domContentLoadedTime = performance.domContentLoadedEventEnd - performance.navigationStart;
  //     // console.log(`DOM Content Loaded Time: ${domContentLoadedTime} ms`);
  //     // const pageLoadTime = performance.loadEventEnd - performance.navigationStart;
  //     // console.log(`Page Load Time: ${pageLoadTime} ms`);

  //     console.log(
  //       obtainedMetrics,
  //       '1',
  //       performance,
  //       '2',
  //       navigationTimings,
  //       '3'
  //     );
  //     await lambdaParameters('passed', driverChrome);
  //   } catch (error) {
  //     await makeScreenshot(driverChrome, 'change_area_status_project');
  //     await lambdaParameters('failed', driverChrome);
  //     throw error;
  //   }
  // });
});
