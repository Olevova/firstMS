const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const PaginationByNumberPerPage = require('../../src/classes/pagination/paginationByNumberPerPage');
const PaginationByButton = require('../../src/classes/pagination/paginationByBtn');
const PaginationByArrow = require('../../src/classes/pagination/paginationByArrow');
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

  it('Pagination by the Number of Entities per Page @T199518ec', async () => {
    await lambdaParameters(
      'Pagination by the Number of Entities per Page',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const paginationByNumber = new PaginationByNumberPerPage(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await paginationByNumber.goToProjectsPage();
      await paginationByNumber.executionOfPagination('50');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'pagination_by_number');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Pagination by button  @Tb5db969f', async () => {
    await lambdaParameters('Pagination by button', driverChrome);
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const paginationByBtn = new PaginationByButton(driverChrome);

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

  it('Pagination by arrow  @T10299de0', async () => {
    await lambdaParameters('Pagination by arrow', driverChrome);
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const paginationByArrow = new PaginationByArrow(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await paginationByArrow.goToProjectsPage();
      await paginationByArrow.executionOfPagination();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'pagination_by_arrow');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
