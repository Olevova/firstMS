const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateRoom = require('../../src/classes/view/room/createRoom');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const { nanoid } = require('nanoid');
const config = require('../../src/utils/config');

describe('Rooms tests @Sa2b0fa77', async () => {
  let driverChrome = null;
  const projectName = config.projectNameForPM;
  const newRoomName = 'test' + nanoid(5);
  const templateName = 'Bedroom 2';
  const roomForValidationCheck = 'Bed';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Template name is suggested when creating the room @T1ec11dc7', async () => {
    await lambdaParameters(
      'Template name is suggested when creating the room',
      driverChrome
    );
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
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'template_name_suggest');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Room name suggested when creating the room based on the template @Te009a7ab', async () => {
    await lambdaParameters(
      'Room name suggested when creating the room based on the template ',
      driverChrome
    );
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
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'create_room_via_template');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Room name uniquness validated in create window @Tdd365e80', async () => {
    await lambdaParameters(
      'Room name uniquness validated in create window',
      driverChrome
    );
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
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'unique_roomname_validation');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
