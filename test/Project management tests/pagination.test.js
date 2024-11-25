const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const Pagination = require('../../src/classes/pagination/pagination');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Project management tests @Sbae16311', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Pagination by the number of rows per page @T199518ec', async () => {
    await lambdaParameters(
      'Pagination by the number of rows per page',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const paginationByNumber = new Pagination(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await paginationByNumber.goToProjectsPage();
      await paginationByNumber.executionOfMenuPagination('50');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'pagination_by_number');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Pagination works by clicking button with page number @Tb5db969f', async () => {
    await lambdaParameters('Pagination works by clicking button with page number', driverChrome);
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const paginationByBtn = new Pagination(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await paginationByBtn.goToProjectsPage();
      await paginationByBtn.executionOfPagination();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'pagination_by_btn');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Pagination work by  clicking arrow  @T10299de0', async () => {
    await lambdaParameters('Pagination work by  clicking arrow', driverChrome);
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const paginationByArrow = new Pagination(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await paginationByArrow.goToProjectsPage();
      await paginationByArrow.executionOfArrowPagination();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'pagination_by_arrow');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
