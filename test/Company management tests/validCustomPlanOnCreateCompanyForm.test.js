const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateCompany = require('../../src/classes/company/createCompany');
const { By, until } = require('selenium-webdriver');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');


describe('Company management tests @Sca85247d', async () => {
  let driverChrome = null;

  const newConpanyName = 'Valid';
  const userNumber = 0;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Enter 0 to the Number of users field when Custom plan is selected on Create company form @T988da911' , async () => {
    await lambdaParameters('Enter 0 to the Number of users field when Custom plan is selected on Create company form', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createCompany = new CreateCompany(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createCompany.goToCreateCompanyForm();
      await createCompany.fillCreateCompanyWithCustomUserNumber(
        newConpanyName,
        config.newCompanyStreet,
        config.newCompanyApp,
        config.newCompanyState,
        config.newCompanyCity,
        config.newCompanyZip,
        config.newCompanyPhone,
        config.newCompanyEmail,
        config.newCompanyCustomPlan,
        config.newCompanyType,
        userNumber
      );
      const errorTextElement = await driverChrome.wait(
        until.elementLocated(By.id('companyPlanMaxNumberUsersError')),
        10000
      );
  
      const errorText = await errorTextElement.getText();
      if (errorText === 'Number of users cannot be 0') {
        console.log('Test successfully passed');
      } else {
        throw new Error('Test failed, check screenshot');
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

});
