const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateCustomStatus = require('../../src/classes/statusAndWeight/createCustomStatus');
const DeleteCustomStatus = require('../../src/classes/statusAndWeight/deleteCustomStatus');
const EditCustomStatus = require('../../src/classes/statusAndWeight/editCustomStatus');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Company admin role @Se7b2355c', async () => {
  let driverChrome = null;

  const colorNumber = 11

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('CA can customize statuses @Teba08c4f', async () => {
    await lambdaParameters('CA can customize statuses', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createStatus = new CreateCustomStatus(driverChrome);
    const checkStatus = new EditCustomStatus(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await createStatus.goToView(config.projectNameForCA, 'ca');
      for(let i = 0; i<colorNumber; i+=1){
        const customColor = await createStatus.creatCustomStatus("status"+i, false);
        await checkStatus.checkCustomStatusAndColor("status"+i,customColor);
      }
      
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'custom_status_create_by_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('CA can delete a custom status', async () => {
    // time and site or lochalhost there tests are going
    await lambdaParameters(
      'CA can delete a custom status',
      driverChrome
    );
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const deleteStatus = new DeleteCustomStatus(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );
    try {
      await deleteStatus.goToView(config.projectNameForCA, 'ca');
    //   for(let i = 0; i<colorNumber; i+=1){
      await deleteStatus.deleteAllCustomStatus();
      const resul = await deleteStatus.checkProjectHasCustomStatus();
      if(resul){
        throw new Error ('Project has custom status')
      }
    //   }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'custom_status_try_delete');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});