const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateCompany = require('../../src/classes/company/createCompany');
const CreateProject = require('../../src/classes/project/createProject');
const InviteUser = require('../../src/classes/user/inviteUser');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { nanoid } = require('nanoid');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Company management tests @Sca85247d', async () => {
  let driverChrome = null;

  const newConpanyName = 'CompanyProjectUser';

  const userStatus = 'sa';
  const newProjectName = 'ComUs' + nanoid(2);
  const newProjectkey = 'AABB';
  const newProjectNumber = '71';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Create new company, create project and invite user to the company', async () => {
    await lambdaParameters(
      'create new company, create project and invite user to the company',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createCompany = new CreateCompany(driverChrome);
    const createProjectTest = new CreateProject(driverChrome);
    const inviteUser = new InviteUser(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createCompany.goToCreateCompanyForm();
      await createCompany.fillCreateCompany(
        newConpanyName,
        config.newCompanyStreet,
        config.newCompanyApp,
        config.newCompanyState,
        config.newCompanyCity,
        config.newCompanyZip,
        config.newCompanyPhone,
        config.newCompanyEmail,
        config.newCompanyPlan,
        config.newCompanyType
      );
      await createCompany.checkCreationOfNewCompany();
      await createProjectTest.goToCreateProjectForm();
      await createProjectTest.fillCreateProjectFields(
        userStatus,
        newProjectName,
        newProjectkey,
        newProjectNumber,
        newConpanyName,
        config.newProjectStreet,
        config.newProjectApp,
        config.newProjectState,
        config.newCompanProjectCity,
        config.newProjectZip,
        config.newProjectClientName,
        config.startDate,
        config.eneDate
      );
      await inviteUser.goToInviteUsersForm('sa');
      await inviteUser.fillInviteForm(
        config.emailForTest,
        newConpanyName,
        config.projManager
      );
      await inviteUser.checkNewUser(
        config.emailForTest,
        config.mainCompanyPage
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_create_invite_user_project');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Delete company with the project and User', async () => {
    await lambdaParameters(
      'remove company with the project and User',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeCompany = new CreateCompany(driverChrome);
    const createProjectTest = new CreateProject(driverChrome);

    try {
      await logginPageTest.userLogIn(
        config.email,
        config.password,
        config.urlhomePageForCheck
      );

      await removeCompany.goToCompanyList();
      await removeCompany.removeCompanyViaThreeDotsMenu(newConpanyName);
      await createProjectTest.goToDashboardTab(config.projects);
      await createProjectTest.checkDeleteItem(
        '.list-name-wrapper',
        newProjectName
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_remove_invite_user_project');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
