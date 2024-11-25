const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateArea = require('../../src/classes/view/area/createArea');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Area on project view tests @S686d997f', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });
  it('Add comments to area @Te48e75b5', async () => {
    await lambdaParameters(
      'add, edit, delete comment to the area',
      driverChrome
    );
   
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addComment = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await addComment.goToView(config.projectNameEdit);
      await addComment.goToSelectTab(config.view);
      await addComment.addComment('Hi its test comment');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'comment_add_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Edit comment in area @T89c8c945', async () => {
    await lambdaParameters('edit comment to the area', driverChrome);

    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addComment = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await addComment.goToView(config.projectNameEdit);
      await addComment.goToSelectTab(config.view);
      await addComment.openAreasWithComment();
      await addComment.editComment('Hi its test comment', 'edit comment');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'comment_add_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Check hover mouse over area with black triangle @Tdbe7faab', async () => {
    await lambdaParameters(
      'Check hover mouse over area with black triangle',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatusInProgress = new CreateArea(
      driverChrome
    );

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await changeAreaStatusInProgress.goToView(config.projectNameEdit);
      await changeAreaStatusInProgress.goToSelectTab(config.projectProgress);
      // await changeAreaStatusInProgress.hoverAreaAndCheckCommentsAndAttachments(
      //  2,1
      // );
      await changeAreaStatusInProgress.hoverAreaAndCheckCommentsAndAttachmentsNew()
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'check_hover_mouse_over_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Delete comment in area @T6a9b6305', async () => {
    await lambdaParameters('delete comment from the area', driverChrome);

    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addComment = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await addComment.goToView(config.projectNameEdit);
      await addComment.goToSelectTab(config.view);
      await addComment.openAreasWithComment();
      await addComment.deleteComment('edit comment');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'comment_add_to_area');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
