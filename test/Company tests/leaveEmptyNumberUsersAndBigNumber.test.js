const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateCompany = require('../../src/classes/company/createCompany');
const { By, until } = require('selenium-webdriver');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');


describe('Company tests @Sca85247d', async () => {
  let driverChrome = null;

  const newConpanyName = 'Valid';
  let userNumber = 'A';
  let userNumberSecond = 1000001

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Leave empty Number of users field when Custom plan is selected on Create company form @Tcb6bd01e', async () => {
    await lambdaParameters('Leave empty Number of users field when Custom plan is selected on Create company form @Tcb6bd01e', driverChrome);
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
        userNumber,
      );
      
      
      const errorTextElement = await driverChrome.wait(
        until.elementLocated(By.id('companyPlanMaxNumberUsersError')),
        10000
      );
  
      const errorText = await errorTextElement.getText();
      if (errorText === 'This field is required') {
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

  it('Enter 100001 to the Number of users field when Custom plan is selected on Create company form @Tcc11064f', async () => {
    await lambdaParameters('Enter 100001 to the Number of users field when Custom plan is selected on Create company form @Tcc11064f', driverChrome);
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
        userNumberSecond,
        false
      );
      await driverChrome.sleep(500);
      const numberUser = await createCompany.getElementText(config.locatorUserNumberCss ,false ,'value');
      if(numberUser === '100000'){
        console.log('Test passed');
        
      }
      else{
        throw new Error("Test failed")
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

});