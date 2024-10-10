const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateFloor = require('../../src/classes/view/floor/createFloor');
const SequenceFloorChange = require('../../src/classes/view/floor/sequenceFloorChange');
const SequenceUnitChange = require('../../src/classes/view/unit/sequenceUnitChange');
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

  it('SU can rearrange floors @T54fe631b', async () => {
    await lambdaParameters('CA can rearrange floors', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeFloor = new SequenceFloorChange(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await changeFloor.goToView(config.projectNameForSU, 'su');
      await changeFloor.sequenceChange();
      await changeFloor.checkSequence();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_change_sequence_by_SU');
      throw error;
    }
  });

  it('SU can rearrange units @Tf34b3610', async () => {
    await lambdaParameters('PM can rearrange unit @T83f41c41', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeUnits = new SequenceUnitChange(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await changeUnits.goToView(config.projectNameForSU, 'pm');
      await changeUnits.sequenceChange();
      await changeUnits.checkSequence();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'units_change_sequence_by_SU');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


  it('SU cannot add/duplicate floors @T96c3a746', async () => {
    await lambdaParameters('SU cannot add/duplicate floors @T96c3a746', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createFloor = new CreateFloor(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await createFloor.goToView(config.projectNameForSU, 'SU');
      const addFloorBtnMissed = await createFloor.checkMissingElement(config.locatorAddFloorBtnCss,2000);
      if(addFloorBtnMissed){
        console.log('Test passed, button for add/duplicate floor is missed');
        
      }
      else{
        throw new Error('Test failed, button is exist')
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'cannot_floor_create_by_SU');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('SU cannot add/duplicate units @Ta68b8c14', async () => {
    await lambdaParameters('SU cannot add/duplicate units @Ta68b8c14', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createFloor = new CreateFloor(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await createFloor.goToView(config.projectNameForSU, 'SU');
      const addUnitBtn= await createFloor.checkMissingElement(config.locatorAddUnitBtnCss,2000);
      if(addUnitBtn){
        console.log('Test passed, button for add/duplicate units is missed');
       
      }
      else{
        throw new Error('Test failed, button is exist')
      }
  
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'cannot_unit_create_by_SU');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('SU cannot add rooms @T7bb3ad8d', async () => {
    await lambdaParameters('SU cannot add rooms @T7bb3ad8d', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createFloor = new CreateFloor(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await createFloor.goToView(config.projectNameForSU, 'SU');
      const addRoomBtn= await createFloor.checkMissingElement(config.locatorAddRoomBtnCss,2000);
      if(addRoomBtn){
        console.log('Test passed, button for add rooms is missed');
       
      }
      else{
        await createFloor.clickElement(config.locatorAddRoomBtnCss);
        throw new Error('Test failed, button is exist');
        
      }
  
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'cannot_room_create_by_SU');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('SU cannot edit areas @Tf3029649', async () => {
    await lambdaParameters('SU cannot edit areas @Tf3029649', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createFloor = new CreateFloor(driverChrome);

    await logginPageTest.userLogIn(
      config.emailSU,
      config.passwordSU,
      config.mainCompanyPage
    );

    try {
      await createFloor.goToView(config.projectNameForSU, 'SU');
      const threeDotsRoomMenu= await createFloor.checkMissingElement(config.locatorThreeDotsRoomMenuCss,2000);
      if(threeDotsRoomMenu){
        console.log('Test passed, button for add rooms is missed');
       
      }
      else{
        await createFloor.clickElement(config.locatorThreeDotsRoomMenuCss);
        throw new Error('Test failed, button is exist')
      }
  
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'cannot_area_create_by_SU');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

});
