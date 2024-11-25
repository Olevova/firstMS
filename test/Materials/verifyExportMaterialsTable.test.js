const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateMaterials = require('../../src/classes/materials/createMaterials');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');


describe('Materials @S48382f8a', async () => {
  
  let driverChrome = null;
  const materialTag = config.randomDateFunc();
  const secondMaterials = config.randomDateFunc();

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome(false);
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Add materials with all required fields @T8fbddcce', async () => {
    await lambdaParameters('Add materials with all required fields @T8fbddcce', driverChrome);
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
       tag:materialTag,
       unit:config.unit.SF,
       supplier: config.supplier,
       area: config.areaMT,
       submittalStatus: config.SubmittalStatus.Submitted,
       orderStatus: config.OrderStatus.POSubmitted,
      }
      );
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
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Verify export for Materials table by Submittal Status, Order Status, Payment Status, and combined filters @T5c1b8464', async () => {
    await lambdaParameters('Verify export for Materials table by Submittal Status, Order Status, Payment Status, and combined filters @T5c1b8464', driverChrome);
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
      await createMaterials.goToView(config.projectNameMain,'ca');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.filterMaterials(false, config.OrderStatus.POSubmitted);
      const itemIdAfterFiltering = await createMaterials.returnArrayOfItems('.material-id');
      console.log(itemIdAfterFiltering, 'filter');
      const itemIdArrayExport = await createMaterials.exportFile('materials');
      console.log(itemIdArrayExport, 'export');
      if (JSON.stringify(itemIdAfterFiltering) === JSON.stringify(itemIdArrayExport)){
        console.log('Test passed');
      }
      else{ throw new Error("test failed")}
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'verify_export_after_filtering');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Verify export after sorting Materials table by ID @T7b8ebd96', async () => {
    await lambdaParameters('Verify export after sorting Materials table by ID @T7b8ebd96', driverChrome);
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
      await createMaterials.goToView(config.projectNameMain,'ca');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.waitListDate(config.locatorTasksElementsCss,2);
      await createMaterials.sortMaterialsById(true);
      const itemIdAfterFiltering = await createMaterials.returnArrayOfItems('.material-id');
      console.log(itemIdAfterFiltering, 'filter 2');
      const itemIdArrayExport = await createMaterials.exportFile('materials');
      console.log(itemIdArrayExport, 'export 2');
      if (JSON.stringify(itemIdAfterFiltering) === JSON.stringify(itemIdArrayExport)){
        console.log('Test passed');
      }
      else{ throw new Error("test failed")}
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'verify_export_after_sorting');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


  it('Verify export for Materials table after Search by ID @Tb4a14310', async () => {
    await lambdaParameters('Verify export for Materials table after Search by ID @Tb4a14310', driverChrome);
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
      await createMaterials.goToView(config.projectNameMain,'ca');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.enterTextInSearchInput(materialTag);
      await createMaterials.waitListDate(config.locatorMaterialsName,1);
      const itemIdAfterFiltering = await createMaterials.returnArrayOfItems('.material-id');
      console.log(itemIdAfterFiltering, 'filter 2');
      const itemIdArrayExport = await createMaterials.exportFile('materials');
      console.log(itemIdArrayExport, 'export 2');
      if (JSON.stringify(itemIdAfterFiltering) === JSON.stringify(itemIdArrayExport)){
        console.log('Test passed');
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'verify_export_after_searching');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Delete materials @T4a4efcdc', async () => {
    await lambdaParameters('Delete materials @T4a4efcdc', driverChrome);
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
      await createMaterials.goToView(config.projectNameMain,'ca');
      await createMaterials.goToSelectTab(config.materials);
      await createMaterials.deleteMaterials(materialTag);
      await driverChrome.sleep(1000);
      await createMaterials.deleteMaterials(secondMaterials);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_delete');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});