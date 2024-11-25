const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateMaterials = require('../../src/classes/materials/createMaterials');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');


describe('Materials @S48382f8a', async () => {
  
  let driverChrome = null;
  const paymentStatus = config.randomDate;
  const errorText = 'Payment Status with such name already exists';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });


  it('Verify that simultaneous attempts to add the same custom field (e.g., Payment Status) are handled correctly @T8d53b341', async () => {
    await lambdaParameters(
      'Verify that simultaneous attempts to add the same custom field (e.g., Payment Status) are handled correctly @T8d53b341',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);
    try {
      const loginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
      const createMaterials = new CreateMaterials(driverChrome);

      await loginPageTest.userLogIn(
        config.emailCA,
        config.passwordCA,
        config.mainCompanyPage
      );
      await createMaterials.goToView(config.projectNameForPM, 'ca');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.openMaterialsAddMaterialsForm();
      await createMaterials.addCustomStatusInMaterials(false,false,paymentStatus, false,false);
      await driverChrome.executeScript('window.open()');
      let handles = await driverChrome.getAllWindowHandles();
      await driverChrome.switchTo().window(handles[1]);
      await loginPageTest.userLogIn(
        config.emailPM,
        config.passwordPM,
        config.mainCompanyPage
      );
      await createMaterials.goToView(config.projectNameForPM, 'pm');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.openMaterialsAddMaterialsForm();
      await createMaterials.addCustomStatusInMaterials(false,true,paymentStatus);
      await driverChrome.switchTo().window(handles[0]);
      await createMaterials.clickElement(config.locatorCreateMaterialStatusBtn);
      const errorMsgArray = await createMaterials.formErrorMsgArray(config.locatorSmallErrorEl);
      console.log(await errorMsgArray.length);
      
      if(await errorMsgArray.length > 0){
        for(let er of errorMsgArray){
            if(er !== errorText){
                throw new Error('Test failed')         
            }
        }
      } 
        else{
        throw new Error('Test failed')
    }
      await driverChrome.sleep(2000);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      makeScreenshot(driverChrome, 'task_open_via_id_name_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Delete custom statuses from Unit dropdown @T4fd0bfd8', async () => {
    await lambdaParameters('Delete custom statuses from Unit dropdown @T4fd0bfd8', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createMaterials = new CreateMaterials(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createMaterials.goToView(config.projectNameForPM,'sa');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.openMaterialsAddMaterialsForm();
      await createMaterials.deletCustomStatusInMaterials(false, paymentStatus);
      await createMaterials.clickElement(config.locatorProjectCancelFormCss);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'delete_unit_custom_statuses');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

});