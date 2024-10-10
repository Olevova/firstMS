const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateProject = require('../../src/classes/project/createProject');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');
const { nanoid } = require('nanoid');

describe('Project management tests @Sbae16311', async () => {
  let driverChrome = null;

  const newProjectName = 'FTP' + nanoid(2);
  const newProjectkey = null;
  const newProjectNumber = '71';
  const newProjectStreet = 'Test2 new';
  const newProjectApp = '22';
  const newProjectZip = '02200';
  const newCompanyProjectBelong = config.companyName;
  const newProjectClientName = 'Auto Test';
  const newProjectState = 'New York';
  const newCompanProjectCity = 'New York';
  const startDate = '12.12.23';
  const eneDate = '12.12.25';
  const newEditName = 'testProjectEdit';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Create a project without required fields', async () => {
    await lambdaParameters(
      'Create a project without required fields',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createProjectTest = new CreateProject(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createProjectTest.goToCreateProjectForm();
      await createProjectTest.fillOptionalCreateProjectFields(
        config.newProjectApp,
        config.startDate,
        config.eneDate,
        true
      );
      const errorMsgArray = await createProjectTest.formErrorMsgArray('.small-error-text-field');
      
      if(await errorMsgArray.length === 9){

        for(let er of errorMsgArray){
            if(er !== 'This field is required'){
                throw new Error('Test failed')         
            }
        }
      } 
    else{
        throw new Error('Test failed')
    }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_create_without_required_field');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });


  it('Cancel project creation', async () => {
    await lambdaParameters(
      'Cancel project creation',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createProjectTest = new CreateProject(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createProjectTest.goToCreateProjectForm();
      await createProjectTest.fillCreateProjectFields(
        'sa',
        newProjectName,
        newProjectkey,
        newProjectNumber,
        newCompanyProjectBelong,
        newProjectStreet,
        newProjectApp,
        newProjectState,
        newCompanProjectCity,
        newProjectZip,
        newProjectClientName,
        startDate,
        eneDate,
        false
      );
      await createProjectTest.clickElement(config.locatorProjectCancelFormCss);
      await createProjectTest.checkDeleteItem('.list-name-wrapper',newProjectName)
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_create_cancel');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

});
