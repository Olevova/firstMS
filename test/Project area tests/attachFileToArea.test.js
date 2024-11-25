const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateArea = require('../../src/classes/view/area/createArea');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');
const {
  inDocker,
  withoutLambda,
} = require('../../src/utils/webdriver');
const path = require('path');

describe('Project area tests @S2687e915', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });


  it('Add attachment to the area comment field @Td1c6313c', async () => {
    await lambdaParameters(
      'add attachment to the area verify it',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addFile = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await addFile.goToView(config.projectNameMain);
      await addFile.goToSelectTab(config.view);
      await addFile.addFileToComment('photo');
      if(!await addFile.checkAttachmentInComments(config.attachmentFilePhoto)){
        throw new Error('Test failed')
      }
      console.log("Test passed");
      
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'attach_photo_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


  it('Verify Multimedia File Uploads in Comments and Separate Sections @Ta9c33c11', async () => {
    await lambdaParameters(
      'Verify Multimedia File Uploads in Comments and Separate Sections @Ta9c33c11',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addFile = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await addFile.goToView(config.projectNameMain);
      await addFile.goToSelectTab(config.view);
      await addFile.addFileToComment('media', config.attachmentFileVideo);
      if(!await addFile.checkAttachmentInComments(config.attachmentFileVideo)){
        throw new Error('Test failed')
      }
      
      await addFile.addFile(config.attachmentFileVideo);
      await addFile.checkAttachment(config.attachmentFileVideo)
      console.log("Test passed");
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'attach_video_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Behavior for .zip/.rar and .exe File Uploads in Comments and Separate Sections @T8b0b94b2', async () => {
    await lambdaParameters(
      'Behavior for .zip/.rar and .exe File Uploads in Comments and Separate Sections @T8b0b94b2',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addFile = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await addFile.goToView(config.projectNameMain);
      await addFile.goToSelectTab(config.view);
      await addFile.addFileToComment('zip', config.attachmentFileZip );
      if(!await addFile.checkAttachmentInComments(config.attachmentFileZip)){
        throw new Error('Test failed')
      }
      await addFile.addFile(config.attachmentFileZip);
      await addFile.checkAttachment(config.attachmentFileZip)
      console.log("Test passed");
      
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'attach_zip_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Behavior for Document File Uploads in Comments and Separate Sections @Td84c1c49', async () => {
    await lambdaParameters(
      'Behavior for Document File Uploads in Comments and Separate Sections @Td84c1c49',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addFile = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await addFile.goToView(config.projectNameMain);
      await addFile.goToSelectTab(config.view);
      await addFile.addFileToComment('document', config.attachmentFileDoc );
      if(!await addFile.checkAttachmentInComments(config.attachmentFileDoc)){
        throw new Error('Test failed')
      }
      await addFile.addFile(config.attachmentFileDoc);
      await addFile.checkAttachment(config.attachmentFileDoc)
      
      console.log("Test passed");
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'attach_document_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Delete attachment from the area @T630f4341', async () => {
    await lambdaParameters('delete attachment', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addFile = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await addFile.goToView(config.projectNameMain);
      await addFile.goToSelectTab(config.view);
      await addFile.openAreasWithComment();
      await addFile.deleteComment('document');
      if(await addFile.checkAttachmentInComments(config.attachmentFileDoc)){
        throw new Error('Test failed')
      }
      await addFile.deleteComment('zip');
      if(await addFile.checkAttachmentInComments(config.attachmentFileZip)){
        throw new Error('Test failed')
      }
      await addFile.deleteComment('media');
      if(await addFile.checkAttachmentInComments(config.attachmentFileVideo)){
        throw new Error('Test failed')
      }
      console.log("Test passed");
      await addFile.deleteComment('photo');
      if(await addFile.checkAttachmentInComments(config.attachmentFilePhoto)){
        throw new Error('Test failed')
      }
      console.log("herer");
      
      await addFile.findAndClickOnLinInTheList('Files', config.locatorAreaTabsCss);
      await addFile.deleteFile(config.attachmentFileDoc);
      await addFile.deleteFile(config.attachmentFileZip);
      await addFile.deleteFile(config.attachmentFileVideo);
      await addFile.checkFileAreaTabEmpty();
      console.log("Test passed");
      

      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'comment_add_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
