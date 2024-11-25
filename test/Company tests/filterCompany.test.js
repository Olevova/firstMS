const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateCompany = require('../../src/classes/company/createCompany');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Standard User role @S7e09d7c0', async () => {
  let driverChrome = null;
  let startCompanyNumber;
  let endCompanyNumber;
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


  it('Filter companies by type @T3573d08e', async () => {
    await lambdaParameters('Filter companies by type @T3573d08e', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const filterCompany = new CreateCompany(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await filterCompany.clickElement(config.locatorCompaniesLinkCss);
      await filterCompany.waitListDate(config.locatorCompanyListCss, 2);
      startCompanyNumber = await filterCompany.numberOfItemsInTheList(
        config.locatorCompanyListCss
      );

      await filterCompany.filterCompany(config.newCompanyType);
      endCompanyNumber = await filterCompany.numberOfItemsInTheList(
        config.locatorCompanyListCss
      );
      companyType = await filterCompany.getElementText(
        '.company-type-item'
      );
      
      if (
        startCompanyNumber > endCompanyNumber
      ) {
        console.log(`Test passed, you search type is ${companyType}`);
      } else {
        throw new Error('Test filter company failed');
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'filter_the_company_type');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Filter companies by state', async () => {
    await lambdaParameters('Filter companies by state', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const filterCompany = new CreateCompany(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await filterCompany.clickElement(config.locatorCompaniesLinkCss);
      await filterCompany.waitListDate(config.locatorCompanyListCss, 2);
      startCompanyNumber = await filterCompany.numberOfItemsInTheList(
        config.locatorCompanyListCss
      );

      await filterCompany.filterCompany(false, 'Alabama');
      endCompanyNumber = await filterCompany.numberOfItemsInTheList(
        config.locatorCompanyListCss
      );
      companyType = await filterCompany.getElementText(
        '.company-type-item'
      );
      
      if (
        startCompanyNumber > endCompanyNumber 
      ) {
        console.log(`Test passed, you search type is ${companyType}`);
      } else {
        throw new Error('Test filter company failed');
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'filter_the_company_state');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});