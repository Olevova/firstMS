const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateMaterials = require('../../src/classes/materials/createMaterials');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');


describe('Materials @S48382f8a', async () => {
  
  let driverChrome = null;
  const firstEditEl = config.randomDate;
  const secondEditEl = config.randomDate

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  // it('Add materials with all required fields @T8fbddcce', async () => {
  //   await lambdaParameters('Add materials with all required fields @T8fbddcce', driverChrome);
  //   // time and site or lochalhost there tests are going
  //   console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

  //   const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  //   const createMaterials = new CreateMaterials(driverChrome);

  //   await logginPageTest.userLogIn(
  //     config.emailCA,
  //     config.passwordCA,
  //     config.mainCompanyPage
  //   );

  //   try {
  //     await createMaterials.goToView(config.projectNameForSU,'ca');
  //     await createMaterials.goToSelectTab(config.materials);
  //     await createMaterials.openMaterialsAddMaterialsForm();
  //     await createMaterials.fillOrUpdateMaterialsFields({
  //       save:true,
  //       tag:config.tagMT,
  //       unit:config.unit.SF,
  //       supplier:config.supplier,
  //       area:config.areaMT,
  //       submittalStatus:config.SubmittalStatus.Submitted,
  //       orderStatus:config.OrderStatus.POSubmitted,
  //   });
  //     await lambdaParameters('passed', driverChrome);
  //   } catch (error) {
  //     await makeScreenshot(driverChrome, 'materials_create');
  //     await lambdaParameters('failed', driverChrome);
  //     throw error;
  //   }
  // });

  // it('Add material with all fields @Tdce99f75', async () => {
  //   await lambdaParameters('Add material with all fields @Tdce99f75', driverChrome);
  //   // time and site or lochalhost there tests are going
  //   console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

  //   const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  //   const createMaterials = new CreateMaterials(driverChrome);

  //   await logginPageTest.userLogIn(
  //     config.emailCA,
  //     config.passwordCA,
  //     config.mainCompanyPage
  //   );
  //   try {
  //     await createMaterials.goToView(config.projectNameForSU,'ca');
  //     await createMaterials.goToSelectTab(config.materials);
  //     await createMaterials.openMaterialsAddMaterialsForm();
  //     await createMaterials.fillOrUpdateMaterialsFields({
  //       save:true,
  //       tag:config.tagMTFull,
  //       description:config.taskDescription,
  //       unit:config.unit.SF,
  //       supplier:config.supplier,
  //       area:config.areaMT,
  //       submittalStatus:config.SubmittalStatus.Submitted,
  //       file:config.attachmentFilePhoto,
  //       orderStatus:config.OrderStatus.POSubmitted,
  //       eta:config.taskDate,
  //       grossQty:1,
  //       orderQty:1,
  //       orderDate:config.taskDate,
  //       paymentStatus:config.materialPaymentStatus,
  //       receivedQty:1,
  //       location:config.materialsLocation,
  //       materialNotes:config.materialsNot,
  //       fileSecondInput:config.attachmentFilePhoto,}
  //     );
  //     await lambdaParameters('passed', driverChrome);
  //   } catch (error) {
  //     await makeScreenshot(driverChrome, 'materials_create_all_fields');
  //     await lambdaParameters('failed', driverChrome);
  //     throw error;
  //   }
  // });

  // it('Verify that the Submittal Status can be changed directly from the table @Te0c57a0b', async () => {
  //   await lambdaParameters('Verify that the Submittal Status can be changed directly from the table @Te0c57a0b', driverChrome);
  //   // time and site or lochalhost there tests are going
  //   console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

  //   const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  //   const createMaterials = new CreateMaterials(driverChrome);

  //   await logginPageTest.userLogIn(
  //     config.emailCA,
  //     config.passwordCA,
  //     config.mainCompanyPage
  //   );

  //   try {
  //     await createMaterials.goToView(config.projectNameForSU,'ca');
  //     await createMaterials.goToSelectTab(config.materials);
  //     await createMaterials.changeMaterialsStatusInTable({materials:config.tagMT,submittalStatus:config.SubmittalStatus.Submitted})
  //     const status = await createMaterials.checkMaterialsStatusInTable(config.tagMT);
  //     console.log(status, 'status');
  //     if(status.Submittal === config.SubmittalStatus.Submitted){
  //       console.log("Test passed");
        
  //     }
  //     else{
  //       throw new Error('Test failed')
  //     }
  //     await lambdaParameters('passed', driverChrome);
  //   } catch (error) {
  //     await makeScreenshot(driverChrome, 'materials_change_submittal_in_table');
  //     await lambdaParameters('failed', driverChrome);
  //     throw error;
  //   }
  // });

  // it('Verify that the Order Status can be changed directly from the table @Tbf4f64c8', async () => {
  //   await lambdaParameters('Verify that the Order Status can be changed directly from the table @Tbf4f64c8', driverChrome);
  //   // time and site or lochalhost there tests are going
  //   console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

  //   const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  //   const createMaterials = new CreateMaterials(driverChrome);

  //   await logginPageTest.userLogIn(
  //     config.email,
  //     config.password,
  //     config.urlhomePageForCheck
  //   );

  //   try {
  //     await createMaterials.goToView(config.projectNameForSU,'sa');
  //     await createMaterials.goToSelectTab(config.materials);
  //     await createMaterials.changeMaterialsStatusInTable({materials:config.tagMT,orderStatus:config.OrderStatus.Ordered})
  //     const status = await createMaterials.checkMaterialsStatusInTable(config.tagMT);
  //     console.log(status, 'status');
      
  //     if(status.Order === config.OrderStatus.Ordered){
  //       console.log("Test passed");
        
  //     }
  //     else{
  //       throw new Error('Test failed')
  //     }
  //     await lambdaParameters('passed', driverChrome);
  //   } catch (error) {
  //     await makeScreenshot(driverChrome, 'materials_change_order_in_table');
  //     await lambdaParameters('failed', driverChrome);
  //     throw error;
  //   }
  // });


  it('Verify that the “…” menu is not visible for SU role @T0f836fec', async () => {
    await lambdaParameters('Verify that the “…” menu is not visible for SU role @T0f836fec', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createMaterials = new CreateMaterials(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await createMaterials.goToView(config.projectNameForSU,'su');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.waitListDate(config.locatorMaterialsName, 2);
      const materialsMenuBtn = await createMaterials.checkMissingElement(config.locatorDotsMenuId);
      if(materialsMenuBtn){
        console.log(" “…” menu is not visible for SU");   
      }
      else{
        throw new Error(" “…” menu is visible for SU")
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_menu_not_visible_for_su');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


  it('Verify that the "Add material" button cannot be accessed for SU @T55841d23', async () => {
    await lambdaParameters('Verify that the "Add material" button cannot be accessed for SU @T55841d23', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createMaterials = new CreateMaterials(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await createMaterials.goToView(config.projectNameForSU,'su');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.waitListDate(config.locatorMaterialsName, 2);
      const materialsMenuBtn = await createMaterials.checkMissingElement(config.locatorCreatePouUpBtnCss);
      if(materialsMenuBtn){
        console.log("'Add material' button is not visible for SU");   
      }
      else{
        throw new Error(" 'Add material' button is visible for SU")
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_addmaterials_not_visible_for_su');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


  it("Materials can't be opened by ID or Name for SU @T00d7aa1f", async () => {
    await lambdaParameters("Materials can'nt be opened by ID or Name for SU @T00d7aa1f", driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createMaterials = new CreateMaterials(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await createMaterials.goToView(config.projectNameForSU,'su');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.waitListDate(config.locatorMaterialsName, 2);
      await createMaterials.clickElement(config.locatorMaterialIdCss);
      const materialsFormEdit = await createMaterials.checkMissingElement(config.locatorInviteUserWindowCss,2000);
      console.log(materialsFormEdit, 'materialsFormEdit');
      if(!materialsFormEdit){
        throw new Error("Materials can be opened by ID for SU")
      }
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_can_not_opened_by_id_for_su');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


  it("Materials can be opened by ID for CA @Tea42cff5", async () => {
    await lambdaParameters("Materials can be opened by ID for SA, CA, PM. @Tea42cff5", driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createMaterials = new CreateMaterials(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await createMaterials.goToView(config.projectNameForSU,'ca');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.waitListDate(config.locatorMaterialsName, 2);
      await createMaterials.clickElement(config.locatorMaterialIdCss);
      const materialsFormEdit = await createMaterials.checkMissingElement(config.locatorInviteUserWindowCss,2000);
      console.log(materialsFormEdit, 'materialsFormEdit');
      if(materialsFormEdit){
        throw new Error("Materials can't be opened by ID for CA")
      }
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_can_opened_by_id_for_CA');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Update the materials @T6a810369', async () => {
    await lambdaParameters('Update the materials @T6a810369', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createMaterials = new CreateMaterials(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await createMaterials.goToView(config.projectNameForSU,'ca');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.waitListDate(config.locatorMaterialsName, 1);
      await createMaterials.findItemAndOpenThreeDotsMenu(config.tagMTFull, config.locatorMaterialsName );
      await createMaterials.clickElement(config.loccatorEditBtn);
      // await createMaterials.addCustomStatusInMaterials('New');
      await createMaterials.fillOrUpdateMaterialsFields({
        save:true,
        tag:firstEditEl,
        isUpdate:true
    });
      await createMaterials.findAndClickOnLinInTheList( config.tagMT, config.locatorMaterialsName);
      // await createMaterials.clickElement('#editItem');
      await createMaterials.fillOrUpdateMaterialsFields(
        {
          save:true,
          description:firstEditEl,
          isUpdate:true
      }
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_update');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Multiple orders can be deleted by clicking Delete button from... menu @T8afaff29', async () => {
    await lambdaParameters('Multiple orders can be deleted by clicking Delete button from... menu @T8afaff29', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);
    const checkArray = [config.tagMT, secondEditEl]
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createMaterials = new CreateMaterials(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await createMaterials.goToView(config.projectNameForSU,'ca');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.waitListDate(config.locatorMaterialsName, 2);
      await createMaterials.checkElFromArrayInList(checkArray,config.locatorMaterialsNameClass);
      await createMaterials.clickElement(config.locatorSelectDeleteBtnCss);
      await driverChrome.sleep(500);
      await createMaterials.clickElement(config.locatorSelectDeleteBtnTask);
      await createMaterials.notificationCheck();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_multiply_delete');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
