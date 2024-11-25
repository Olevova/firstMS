const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateMaterials = require('../../src/classes/materials/createMaterials');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');


describe('Materials @S48382f8a', async () => {
  
  let driverChrome = null;
  let newStatus = config.randomDate;
  const errorText = 'Stored Location with such name already exists';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Add custom statuses to Stored Location dropdown @T719e9910', async () => {
    await lambdaParameters('Add custom statuses to Stored Location dropdown @T719e9910', driverChrome);
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
      await createMaterials.goToView(config.projectNameMain,'sa');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.openMaterialsAddMaterialsForm();
      await createMaterials.addCustomStatusInMaterials(false,true,false,newStatus);
      await createMaterials.clickElement(config.locatorProjectCancelFormCss);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'add_custom_statuses_to_location');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('It is not possible to add Stored Location with duplicated names @Tdef27e09', async () => {
    await lambdaParameters('It is not possible to add Stored Location with duplicated names @Tdef27e09', driverChrome);
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
      await createMaterials.goToView(config.projectNameMain,'sa');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.openMaterialsAddMaterialsForm();
      await createMaterials.addCustomStatusInMaterials(false,false,false,newStatus);
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
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'not_possible_duplicate_custom_statuses_to_location');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Delete custom statuses from Stored Location dropdown @T7c4142a2', async () => {
    await lambdaParameters('Delete custom statuses from Stored Location dropdown @T7c4142a2', driverChrome);
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
      await createMaterials.goToView(config.projectNameMain,'sa');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.openMaterialsAddMaterialsForm();
      await createMaterials.deletCustomStatusInMaterials(false, false, newStatus);
      await createMaterials.clickElement(config.locatorProjectCancelFormCss);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'delete_location_custom_statuses');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
