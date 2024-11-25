const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateMaterials = require('../../src/classes/materials/createMaterials');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');


describe('Materials @S48382f8a', async () => {
  
  let driverChrome = null;
  const materialTag = config.randomDate;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
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
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Add more than 4 fiels to Submital section and Purchasing sections @T75529537', async () => {
    await lambdaParameters('Add more than 4 fiels to Submital section and Purchasing sections @T75529537', driverChrome);
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
      await driverChrome.sleep(2000);
      await createMaterials.findItemAndOpenThreeDotsMenu(materialTag, config.locatorMaterialsName );
      await createMaterials.clickElement(config.loccatorEditBtn);
      await createMaterials.fillOrUpdateMaterialsFields({notification:false,file:config.attachmentFilePhoto,fileSecondInput:config.attachmentFilePhoto, isUpdate:true});
      await createMaterials.fillOrUpdateMaterialsFields({notification:false,file:config.attachmentFileDoc,fileSecondInput:config.attachmentFileDoc, isUpdate:true});
      await createMaterials.fillOrUpdateMaterialsFields({notification:false,file:config.attachmentFileZip,fileSecondInput:config.attachmentFileZip, isUpdate:true});
      await createMaterials.fillOrUpdateMaterialsFields({notification:false,file:config.attachmentFileVideo,fileSecondInput:config.attachmentFileVideo, isUpdate:true});
      await createMaterials.fillOrUpdateMaterialsFields({save:true, notification:false,file:config.attachmentFilePhoto,fileSecondInput:config.attachmentFilePhoto, isUpdate:true});
      const errorUpload = await createMaterials.formErrorMsgArray(config.locarorUploadFileErrorCss);
        if(errorUpload.includes(config.filesAttachments)){
            console.log('test passed');  
        }
        else{throw new Error('Test failed')}
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_add_more_when_4_file');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Add up to 4 files to Purchasing and Submital sections @T8e77cef2', async () => {
    await lambdaParameters('Add up to 4 files to Purchasing and Submital sections @T8e77cef2', driverChrome);
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
      await driverChrome.sleep(2000);
      await createMaterials.findItemAndOpenThreeDotsMenu(materialTag, config.locatorMaterialsName );
      await createMaterials.clickElement(config.loccatorEditBtn);
      await createMaterials.fillOrUpdateMaterialsFields({notification:false,file:config.attachmentFilePhoto,fileSecondInput:config.attachmentFilePhoto, isUpdate:true});
      await createMaterials.fillOrUpdateMaterialsFields({notification:false,file:config.attachmentFileDoc,fileSecondInput:config.attachmentFileDoc, isUpdate:true});
      await createMaterials.fillOrUpdateMaterialsFields({save:true ,file:config.attachmentFileZip,fileSecondInput:config.attachmentFileZip, isUpdate:true});
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_add_4_up_to_files');
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
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'materials_delete');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});