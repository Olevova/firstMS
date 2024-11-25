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
  const errorText = 'Unit with such name already exists';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Add custom statuses to Unit dropdown @Tdeaf1afa', async () => {
    await lambdaParameters('Add custom statuses to Unit dropdown @Tdeaf1afa', driverChrome);
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
      await createMaterials.addCustomStatusInMaterials(newStatus);
      await createMaterials.clickElement(config.locatorProjectCancelFormCss);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'add_custom_statuses_to_unit');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('It is not possible to add units with duplicated names @Tbb920db6', async () => {
    await lambdaParameters('It is not possible to add units with duplicated names @Tbb920db6', driverChrome);
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
      await createMaterials.addCustomStatusInMaterials(newStatus, false);
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
      await makeScreenshot(driverChrome, 'not_possible_duplicate_custom_statuses_to_unit');
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
      await createMaterials.goToView(config.projectNameMain,'sa');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.openMaterialsAddMaterialsForm();
      await createMaterials.deletCustomStatusInMaterials(newStatus);
      await createMaterials.clickElement(config.locatorProjectCancelFormCss);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'delete_unit_custom_statuses');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

});
