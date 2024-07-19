const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const CreateRoom = require('../src/classes/view/room/createRoom');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const should = require('chai').should();
const { nanoid } = require('nanoid');
const config = require('../src/utils/config');

describe('Check suggested template name when creating the room and check suggested room name when creating the room based on Template, and check Validation of Room name in the chrom browser, test-cases in the PM: 182, 183, 54 in negative test-cases', async () => {
  // here add parameters for creation
  let driverChrome = null;
  const projectName = 'pmTest';
  const newRoomName = 'test' + nanoid(5);
  const templateName = 'testSuggestName';
  const roomForValidationCheck = 'loung';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('suggested template name when creating the room', async () => {
    await lambdaParameters('suggested template name when creating the room', driverChrome)
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createRoom = new CreateRoom(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailPM);
    await logginPageTest.fillPasswordInput(config.passwordPM);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      await createRoom.goToView(projectName, 'pm');
      await createRoom.checkSuggestedTemplateName('_', newRoomName);
      await lambdaParameters('passed',driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'template_name_suggest');
      await lambdaParameters('failed',driverChrome);
      throw error;
    }
  });

  it('suggested room name when creating the room based on the template', async () => {
    await lambdaParameters('suggested room name when creating the room based on the template', driverChrome)
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createRoom = new CreateRoom(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailPM);
    await logginPageTest.fillPasswordInput(config.passwordPM);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);
    
    try {
      await createRoom.goToView(projectName, 'pm');
      await createRoom.checkSuggestedRoomName('_', templateName);
      await lambdaParameters('passed',driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'create_room_via_template');
      await lambdaParameters('failed',driverChrome);
      throw error;
    }
  });

  it('validating the room name field when creating a unique room with a room name that exists', async () => {
    await lambdaParameters('validating the room name field when creating a unique room with a room name that exists', driverChrome)
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createRoom = new CreateRoom(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailPM);
    await logginPageTest.fillPasswordInput(config.passwordPM);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      await createRoom.goToView(projectName, 'pm');
      await createRoom.createRoom('_', roomForValidationCheck);
      await createRoom.checkValidationOfRoomName();
      await lambdaParameters('passed',driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'unique_roomname_validation');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
