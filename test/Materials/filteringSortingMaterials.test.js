const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateMaterials = require('../../src/classes/materials/createMaterials');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');


describe('Materials @S48382f8a', async () => {
  
  let driverChrome = null;
  const fistMaterials = config.randomDateFunc();
  const secondMaterials = config.randomDateFunc();
  const thirdMaterials = config.randomDateFunc();
  const arrayMaterials = [fistMaterials, secondMaterials, thirdMaterials]

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Verify that materials can be added successfully by SA, CA, or PM roles @Ta1b9539d', async () => {
    await lambdaParameters('Verify that materials can be added successfully by SA, CA, or PM roles @Ta1b9539d', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createMaterials = new CreateMaterials(driverChrome);

    await logginPageTest.userLogIn(
        config.emailPM,
        config.passwordPM,
        config.mainCompanyPage
    );

    try {
      await createMaterials.goToView(config.projectNameForPM, 'pm');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.openMaterialsAddMaterialsForm();
      await createMaterials.fillOrUpdateMaterialsFields({
        save:true,
        tag:fistMaterials,
        unit:config.unit.SF,
        supplier:config.supplierPM,
        area:config.areaMT,
        submittalStatus:config.SubmittalStatus.Submitted,
        orderStatus:config.OrderStatus.POSubmitted,
    });
    await createMaterials.openMaterialsAddMaterialsForm();
      await createMaterials.fillOrUpdateMaterialsFields({
        save:true,
        tag:secondMaterials,
        unit:config.unit.SF,
        supplier:config.supplier,
        area:config.areaMT,
        submittalStatus:config.SubmittalStatus.ApprovedAsNoted,
        orderStatus:config.OrderStatus.PartiallyOrdered,
        paymentStatus: config.materialPaymentStatusPaid
    });
    await createMaterials.openMaterialsAddMaterialsForm();
      await createMaterials.fillOrUpdateMaterialsFields({
        save:true,
        tag:thirdMaterials,
        unit:config.unit.SF,
        supplier:config.supplier,
        area:config.areaMT,
        submittalStatus:config.SubmittalStatus.Rejected,
        orderStatus:config.OrderStatus.Ordered,
        paymentStatus: config.materialPaymentStatusPaid
    });
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_create_pm');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Verify that filtering is performed by Submittal status @Te5bfc492', async () => {
    await lambdaParameters('Verify that filtering is performed by Submittal status @Te5bfc492', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createMaterials = new CreateMaterials(driverChrome);

    await logginPageTest.userLogIn(
        config.emailPM,
        config.passwordPM,
        config.mainCompanyPage
    );

    try {
      await createMaterials.goToView(config.projectNameForPM, 'pm');
      await createMaterials.goToSelectTab(config.materials);
      const startCompanyNumber = await createMaterials.numberOfItemsInTheList(
        config.locatorMaterialsName
      );
      await createMaterials.filterMaterials(config.SubmittalStatus.Submitted);
      const endCompanyNumber = await createMaterials.numberOfItemsInTheList(
        config.locatorMaterialsName
      ).catch(erorr => null)
      if(startCompanyNumber>endCompanyNumber){
        console.log("Test passed");
        
      }
      else if(endCompanyNumber === null){
        console.log("List empty, test passed");
      }
      else {
        throw new Error ('Test failed')
      }
      await driverChrome.sleep(1000);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_filter_submittal');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
  
  it('Verify that filtering is performed by Order status @Ta8acc167', async () => {
    await lambdaParameters('Verify that filtering is performed by Order status @Ta8acc167', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createMaterials = new CreateMaterials(driverChrome);

    await logginPageTest.userLogIn(
        config.emailPM,
        config.passwordPM,
        config.mainCompanyPage
    );

    try {
      await createMaterials.goToView(config.projectNameForPM, 'pm');
      await createMaterials.goToSelectTab(config.materials);
      const startCompanyNumber = await createMaterials.numberOfItemsInTheList(
        config.locatorMaterialsName
      );
      await createMaterials.filterMaterials(false, config.OrderStatus.POSubmitted);
      const endCompanyNumber = await createMaterials.numberOfItemsInTheList(
        config.locatorMaterialsName
      ).catch(erorr => null)
      if(startCompanyNumber>endCompanyNumber){
        console.log("Test passed");
        
      }
      else if(endCompanyNumber === null){
        console.log("List empty, test passed");
      }
      else {
        throw new Error ('Test failed')
      }
      await driverChrome.sleep(1000);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_filter_order');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Verify that filtering is performed by Payment status @T0fe6ccfc', async () => {
    await lambdaParameters('Verify that filtering is performed by Payment status @T0fe6ccfc', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createMaterials = new CreateMaterials(driverChrome);

    await logginPageTest.userLogIn(
        config.emailPM,
        config.passwordPM,
        config.mainCompanyPage
    );

    try {
      await createMaterials.goToView(config.projectNameForPM, 'pm');
      await createMaterials.goToSelectTab(config.materials);
      const startCompanyNumber = await createMaterials.numberOfItemsInTheList(
        config.locatorMaterialsName
      );
      await createMaterials.filterMaterials(false, false, config.materialPaymentStatusPaid);
      const endCompanyNumber = await createMaterials.numberOfItemsInTheList(
        config.locatorMaterialsName
      ).catch(erorr => null)
      if(startCompanyNumber>endCompanyNumber){
        console.log("Test passed");
      }
      else if(endCompanyNumber === null){
        console.log("List empty, test passed");
      }
      else {
        throw new Error ('Test failed')
      }
      await driverChrome.sleep(1000);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_filter_payment');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Verify that multiple filters can be applied simultaneously @T940abe0c, @Tea572264', async () => {
    await lambdaParameters('Verify that multiple filters can be applied simultaneously @T940abe0c, @Tea572264', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createMaterials = new CreateMaterials(driverChrome);

    await logginPageTest.userLogIn(
        config.emailPM,
        config.passwordPM,
        config.mainCompanyPage
    );

    try {
      await createMaterials.goToView(config.projectNameForPM, 'pm');
      await createMaterials.goToSelectTab(config.materials);
      const startCompanyNumber = await createMaterials.numberOfItemsInTheList(
        config.locatorMaterialsName
      );
      await createMaterials.filterMaterials(config.SubmittalStatus.ApprovedAsNoted, config.OrderStatus.PartiallyOrdered, config.materialPaymentStatusPaid);
      const endCompanyNumber = await createMaterials.numberOfItemsInTheList(
        config.locatorMaterialsName
      ).catch(erorr => null)
      if(startCompanyNumber > endCompanyNumber){
        console.log("Test passed");
      }
      else if(endCompanyNumber === null){
        console.log("List empty, test passed");
      }
      else {
        throw new Error ('Test failed')
      }
      await createMaterials.clickElement(config.locatorFilterIcon);
      const endCompanyNumberAfterClearFilter = await createMaterials.numberOfItemsInTheList(
        config.locatorMaterialsName
      )
      if(startCompanyNumber === endCompanyNumberAfterClearFilter){
        console.log("Filter cleaning works correctly");
        
      }else{
        throw new Error('Filter cleaning not work')
      }
      await driverChrome.sleep(1000);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_filter_payment');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Search the material by ID, Tag, Supplier @Tadf8a156', async () => {
    await lambdaParameters('Search the material by ID, Tag, Supplier @Tadf8a156', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createMaterials = new CreateMaterials(driverChrome);

    await logginPageTest.userLogIn(
        config.emailPM,
        config.passwordPM,
        config.mainCompanyPage
    );

    try {      
      await createMaterials.goToView(config.projectNameForPM, 'pm');
      await createMaterials.goToSelectTab(config.materials);
      const materialsId = await createMaterials.getElementText(
        '.item-code-way'
      );
      console.log('item-code-way', materialsId);
      const startCompanyNumber = await createMaterials.numberOfItemsInTheList(
        config.locatorMaterialsName
      );
      await createMaterials.enterTextInSearchInput(fistMaterials);
      await createMaterials.waitListDate(config.locatorMaterialsName,1);
      let endCompanyNumber = await createMaterials.numberOfItemsInTheList(
        config.locatorMaterialsName);
      let materialsName = await createMaterials.getElementText(
        config.locatorMaterialsName
      );
      console.log(materialsName === config.locatorMaterialsName, materialsName, config.locatorMaterialsName);
      
      if(startCompanyNumber > endCompanyNumber && materialsName === fistMaterials ){
        console.log("Test passed", materialsName);
      }
      else {
        throw new Error ('Test failed')
      }
      await createMaterials.clickElement(config.locatorCleraSearching);
      await createMaterials.waitListDate(config.locatorMaterialsName, startCompanyNumber);

      await driverChrome.sleep(1000);
      await createMaterials.enterTextInSearchInput(Number(materialsId));
      await driverChrome.sleep(1000);
      await createMaterials.clickElement('.search-input');
      await driverChrome.sleep(2000);
      await createMaterials.waitListDate(config.locatorMaterialsName, 1);
      endCompanyNumber = await createMaterials.numberOfItemsInTheList(
        config.locatorMaterialsName);
      materialsName = await createMaterials.getElementText(
        config.locatorMaterialsName
      );
      if(startCompanyNumber > endCompanyNumber && materialsId === materialsName ){
        console.log("Test passed", materialsId);
      }
      else {
        throw new Error ('Test failed')
      }
      await createMaterials.clickElement(config.locatorCleraSearching);
      await createMaterials.waitListDate(config.locatorMaterialsName, startCompanyNumber);
      await createMaterials.enterTextInSearchInput(config.supplierPM);
      await driverChrome.sleep(1000);
      await createMaterials.waitListDate(config.locatorMaterialsName, 1);
      endCompanyNumber = await createMaterials.numberOfItemsInTheList(
        config.locatorMaterialsName);
      materialsName = await createMaterials.getElementText(
        config.locatorMaterialsSupplier
      );
      if(startCompanyNumber > endCompanyNumber && materialsName === config.supplierPM ){
        console.log("Test passed", materialsName);
      }
      else {
        throw new Error ('Test failed')
      }
      await driverChrome.sleep(1000);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_filter_payment');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Sort the material by id fields @T62f52841', async () => {
    await lambdaParameters('Sort the material by id fields @T62f52841', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createMaterials = new CreateMaterials(driverChrome);

    await logginPageTest.userLogIn(
        config.emailPM,
        config.passwordPM,
        config.mainCompanyPage
    );

    try {      
      await createMaterials.goToView(config.projectNameForPM, 'pm');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.waitListDate(config.locatorTasksElementsCss,2);
      const res = await createMaterials.sortMaterialsById(false);
      if(res){
        console.log('Sorting from larger to smaller working');
      }
      else{
        throw new Error('Test failed')
      }
      await createMaterials.waitListDate(config.locatorTasksElementsCss,2);
      const res2 = await createMaterials.sortMaterialsById(true);
      if(res){
        console.log('Sorting from smaller to larger working'); 
      }
      else{
        throw new Error('Test failed')
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_sorting_by_id');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Multiple orders can be deleted by clicking Delete button from... menu @T8afaff29', async () => {
    await lambdaParameters('Multiple orders can be deleted by clicking Delete button from... menu @T8afaff29', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createMaterials = new CreateMaterials(driverChrome);

    await logginPageTest.userLogIn(
        config.emailPM,
        config.passwordPM,
        config.mainCompanyPage
    );

    try {
      await createMaterials.goToView(config.projectNameForPM, 'pm');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.waitListDate(config.locatorMaterialsName, 2);
      await createMaterials.checkElFromArrayInList(arrayMaterials, config.locatorMaterialsNameClass);
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
