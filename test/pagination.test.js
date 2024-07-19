const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const PaginationByNumberPerPage = require('../src/classes/pagination/paginationByNumberPerPage');
const PaginationByButton = require('../src/classes/pagination/paginationByBtn');
const PaginationByArrow = require('../src/classes/pagination/paginationByArrow');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Pagination tests, test-cases #45, 47,48', async () => {
  // here add parameters for creation
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Pagination by the Number of Entities per Page', async () => {
    await lambdaParameters('Pagination by the Number of Entities per Page',driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const paginationByNumber = new PaginationByNumberPerPage(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await paginationByNumber.goToProjectsPage();
      await paginationByNumber.executionOfPagination('50');
      await lambdaParameters('passed',driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'pagination_by_number');
      await lambdaParameters('failed',driverChrome);
      throw error;
    }
  });

  it('Pagination by button ', async () => {
    await lambdaParameters('Pagination by button',driverChrome);
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const paginationByBtn = new PaginationByButton(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await paginationByBtn.goToProjectsPage();
      await paginationByBtn.executionOfPagination();
      await lambdaParameters('passed',driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'pagination_by_btn');
      await lambdaParameters('failed',driverChrome);
      throw error;
    }
  });

  it('Pagination by arrow ', async () => {
    await lambdaParameters('Pagination by arrow',driverChrome);
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const paginationByArrow = new PaginationByArrow(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await paginationByArrow.goToProjectsPage();
      await paginationByArrow.executionOfPagination();
      await lambdaParameters('passed',driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'pagination_by_arrow');
      await lambdaParameters('failed',driverChrome);
      throw error;
    }
  });
});
