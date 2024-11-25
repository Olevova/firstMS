const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateArea = require('../../src/classes/view/area/createArea');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Standard User role @S7e09d7c0', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Add an Empty comment to the Area @Td523992d', async () => {
    await lambdaParameters(
      'Add an Empty comment to the Area @Td523992d',
      driverChrome
    );
    
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addComment = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await addComment.goToView(config.projectNameForCA, 'ca');
      await addComment.goToSelectTab(config.view);
      const commentArea = await addComment.addComment('');
      console.log(commentArea, 'commentArea');
      
      if(!commentArea){console.log('Test add empty comment passed')}
      else{throw new Error ('Test add an empty comment to the Area failed') };
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'add_empty_comments');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

});