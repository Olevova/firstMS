const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateMaterials = require('../../src/classes/materials/createMaterials');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');


describe('Materials @S48382f8a', async () => {
  
  let driverChrome = null;
  const errorText = "no such element";
 
  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Add materials without Tag specified @T552e656d', async () => {
    await lambdaParameters('Add materials without Tag specified @T552e656d', driverChrome);
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
      await createMaterials.fillOrUpdateMaterialsFields(
        { 
          save:true,
          notification:false,
          unit:config.unit.SF,
          supplier:config.supplier,
          area:config.areaMT,
          submittalStatus:config.SubmittalStatus.Submitted,
          orderStatus:config.OrderStatus.POSubmitted
        }
      );
      const errorMsgArray = await createMaterials.formErrorMsgArray(config.locatorSmallErrorEl);
      console.log(await errorMsgArray.length);
      
      if(await errorMsgArray.length >0){
        for(let er of errorMsgArray){
            if(er !== 'This field is required'){
                throw new Error('Test failed')         
            }
        }
      } 
    else{
        throw new Error('Test failed')
    }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_create_without_tag');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
 
  it('Add material without Submital data specified @Tc71f47e9', async () => {
    await lambdaParameters('Add material without Submital data specified @Tc71f47e9', driverChrome);
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
      await createMaterials.fillOrUpdateMaterialsFields({
        save:true,
        notification:false,
        tag:config.tagMT,
        orderStatus:config.OrderStatus.POSubmitted,
    });
      const errorMsgArray = await createMaterials.formErrorMsgArray(config.locatorSmallErrorEl);
      console.log(await errorMsgArray.length);
      
      if(await errorMsgArray.length > 0){
        for(let er of errorMsgArray){
            if(er !== 'This field is required'){
                throw new Error('Test failed')         
            }
        }
      } 
    else{
        throw new Error('Test failed')
    }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_create_without_submital_data');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Cancel Material creation @Tfbf417a0', async () => {
    await lambdaParameters('Cancel Material creation @Tfbf417a0', driverChrome);
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
      await createMaterials.fillOrUpdateMaterialsFields({
        tag:config.tagMT,
        unit:config.unit.SF,
        supplier:config.supplier,
        area:config.areaMT,
        submittalStatus:config.SubmittalStatus.Submitted,
        orderStatus:config.OrderStatus.POSubmitted,
    });
      await createMaterials.clickElement(config.locatorProjectCancelFormCss);
      await createMaterials.checkDeleteItem(config.locatorMaterialsName, config.tagMT)
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_create_cancel');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('No Unit option cannot be deleted from Unit dropdown @Tf7cccba3', async () => {
    await lambdaParameters('No Unit option cannot be deleted from Unit dropdown @Tf7cccba3', driverChrome);
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
      const deleteUnit = await createMaterials.deletCustomStatusInMaterials(
        config.unit.NOUNIT
      ).catch(error => error.message)
      console.log(deleteUnit, "deleteUnit");
      if(await deleteUnit.includes(errorText)){
        console.log("Test passed");
      }
      else{
        throw new Error('Test failed')
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_cant_delete_unit');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it("No Status option in Payment Status dropdown that can't be deleted @Tff20ac5a", async () => {
    await lambdaParameters("No Status option in Payment Status dropdown that can't be deleted @Tff20ac5a", driverChrome);
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
      const deletePaymentStatus= await createMaterials.deletCustomStatusInMaterials(
        false, config.materialsPaymentNoStatus
      ).catch(error => error.message)
      console.log(deletePaymentStatus, "deleteUnit");
      if(await deletePaymentStatus.includes(errorText)){
        console.log("Test passed");
      }
      else{
        throw new Error('Test failed');
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_cant_delete_payment');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it("There is No Location status in Stored Location dropdown and it can't be deleted @Tce2a5112", async () => {
    await lambdaParameters("There is No Location status in Stored Location dropdown and it can't be deleted @Tce2a5112", driverChrome);
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
      const deletePaymentStatus= await createMaterials.deletCustomStatusInMaterials(
        false, false, config.materialsLocation
      ).catch(error => error.message)
      console.log(deletePaymentStatus, "deleteUnit");
      if(await deletePaymentStatus.includes(errorText)){
        console.log("Test passed");
      }
      else{
        throw new Error('Test failed');
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_cant_delete_location');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
