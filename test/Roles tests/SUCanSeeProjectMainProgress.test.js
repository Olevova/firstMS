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

  it('SU can see project of the area and main progress @T666d08e3', async () => {
    await lambdaParameters(
      'SU can see project of the area and main progress @T666d08e3',
      driverChrome
    );
    
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const addComment = new CreateArea(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await addComment.goToView(config.projectNameForSU, 'su');
      const projectProgress = await addComment.checkStartProgressProjectPercent();
      if(projectProgress>=0 && projectProgress<=100){
        console.log('Test SU can see project of the area and main progress passed');
        
      }
      else{
        throw new Error('Test SU can see project of the area and main progress failed')
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'see_project_main_progress_by_SU');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

});
