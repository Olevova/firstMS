const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateFloor = require('../../src/classes/view/floor/createFloor');
const DeleteFloor = require('../../src/classes/view/floor/deleteFloor');
const DuplicateFloor = require('../../src/classes/view/floor/duplicateFloor');
const DuplicateUnit = require('../../src/classes/view/unit/duplicateUnit');
const SequenceFloorChange = require('../../src/classes/view/floor/sequenceFloorChange');
const SequenceUnitChange = require('../../src/classes/view/unit/sequenceUnitChange');
const CreateUnit = require('../../src/classes/view/unit/createUnit');
const DeleteUnit = require('../../src/classes/view/unit/deleteUnit');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Project management role @Sfbe51cff', async () => {
  let driverChrome = null;
  let duplicateFloorName = '';
  let duplicateUnitName = '';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('PM can add floor @Te7758cad', async () => {
    await lambdaParameters('PM can add floor @Te7758cad', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createFloor = new CreateFloor(driverChrome);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await createFloor.goToView(config.projectNameForPM, 'pm');
      await createFloor.createFloor(config.newFloorName);
      await createFloor.checkFloorCreation(config.newFloorName); 
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_create_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM can duplicate floor @T84fa601e', async () => {
    await lambdaParameters('PM can duplicate floor @T84fa601e', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const duplicateFloorInProject = new DuplicateFloor(driverChrome);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await duplicateFloorInProject.goToView(config.projectNameForPM, 'pm');
      duplicateFloorName = await duplicateFloorInProject.duplicateFloor();  
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_duplicate_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

it('PM can rearrange floors', async () => {
    await lambdaParameters('CA can rearrange floors', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeFloor = new SequenceFloorChange(driverChrome);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await changeFloor.goToView(config.projectNameForPM, 'pm');
      await changeFloor.sequenceChange();
      await changeFloor.checkSequence();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_change_sequence_by_PM');
      throw error;
    }
  });

    it('PM can delete floor @T28cb04cb', async () => {
    await lambdaParameters(
      'PM can delete floor @T28cb04cb',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const deleteFloor = new DeleteFloor(driverChrome);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await deleteFloor.goToView(config.projectNameForPM, 'ca');
      await deleteFloor.deleteFloor(config.newFloorName);
      await deleteFloor.checkDeleteFloor(config.newFloorName);
      await deleteFloor.deleteFloor(duplicateFloorName);
      await deleteFloor.checkDeleteFloor(duplicateFloorName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'floor_delete_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM can create unit @Tddbc18f1', async () => {
    await lambdaParameters('PM can create unit @Tddbc18f1', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createUnit = new CreateUnit(driverChrome);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await createUnit.goToView(config.projectNameForPM, 'pm');
      await createUnit.createUnit(config.newUnitName);
      await createUnit.checkCreateUnit(config.newUnitName);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'unit_create_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM can duplicate unit @Tb16c1d58', async () => {
    await lambdaParameters('PM can duplicate unit @Tb16c1d58', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createUnit = new CreateUnit(driverChrome);
    const duplicateUnit = new DuplicateUnit(driverChrome);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await createUnit.goToView(config.projectNameForPM, 'pm');
      duplicateUnitName = await duplicateUnit.duplicateUnit();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'unit_duplicate_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM can rearrange unit @T83f41c41', async () => {
    await lambdaParameters('PM can rearrange unit @T83f41c41', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeUnits = new SequenceUnitChange(driverChrome);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );

    try {
      await changeUnits.goToView(config.projectNameForPM, 'pm');
      await changeUnits.sequenceChange();
      await changeUnits.checkSequence();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'units_change_sequence');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('PM can delete unit @Tf63897f5', async () => {
    await lambdaParameters('PM can delete unit @Tb16c1d58', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const deleteUnit = new DeleteUnit(driverChrome);

    await logginPageTest.userLogIn(
        config.emailPM,
        config.passwordPM,
        config.mainCompanyPage
      );

    try {
      await deleteUnit.goToView(config.projectNameForPM, 'pm');
      await deleteUnit.deleteUnit(config.newUnitName);
      await deleteUnit.checkDeleteUnit(config.newUnitName);
      await deleteUnit.deleteUnit(duplicateUnitName+' #2');
      await deleteUnit.checkDeleteUnit(duplicateUnitName+' #2');
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'unit_delete_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


});
