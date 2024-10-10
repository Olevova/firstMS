const { createWebdriverChrome } = require('../../webdriver');
const lambdaParameters = require('../../lambdaAddParameters');
const LoginPage = require('../../../classes/auth/login');
const CreateMaterials = require('../../../classes/materials/createMaterials');
const RemoveCompany = require('../../../classes/company/removeCompany');
const EditCompany = require('../../../classes/company/editCompany');
const makeScreenshot = require('../../makeScreenShot');
const { describe } = require('mocha');
const config = require('../../config');


describe('Materials @Sa016984e', async () => {
  let driverChrome = null;

    const tag = 'test tag';
    const description=false;
    const unit='SF';
    const supplier='CA';
    const area='room';
    const submittalStatus='Rejected';
    const file= 'Logo.png';
    const orderStatus= 'PO Submitted';
    const eta=false;
    const grossQty=false;
    const orderQty=false;
    const orderDate=false;
    const paymentStatus=false;
    const receivedQty = false;
    const location = false;
    const storedLocation= false;
    const materialNotes=false


  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Verify that materials can be added successfully by SA, CA, or PM roles @Tb803d78a', async () => {
    await lambdaParameters('Verify that materials can be added successfully by SA, CA, or PM roles @Tb803d78a', driverChrome);
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
      await createMaterials.openMaterialsAddMaterialsForm();
      await createMaterials.fillAddMaterialsFields(
        true,
        'sa',
        tag,
        false,
        unit,
        supplier,
        area,
        submittalStatus,
        file,
        orderStatus,
      
      );
    //   await createCompany.checkCreationOfNewCompany();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  
});
