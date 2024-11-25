const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateCompany = require('../../src/classes/company/createCompany');
const CreateProject = require('../../src/classes/project/createProject');
const CreateTask = require('../../src/classes/task/createTask');
const InviteUser = require('../../src/classes/user/inviteUser');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Company tests @Sca85247d', async () => {
  let driverChrome = null;
  let startCompanyNumber;
  let endCompanyNumber;
  let companyName;

  const newConpanyName = 'Fortest';
  const newConpanyName2 = 'Fortest2';
  const newProjectName = 'Fortestedit';
  const userStatus = 'sa';
  const newProjectkey = 'AABB';
  const newProjectNumber = '71';
  const companiesArray = ['Fortest', 'Fortest2'];
  const taskName = config.randomDate;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Create Team company and verify number of invites', async () => {
    await lambdaParameters('create new company', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createCompany = new CreateCompany(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createCompany.goToCreateCompanyForm();
      await createCompany.fillCreateCompany(
        newConpanyName2,
        config.newCompanyStreet,
        config.newCompanyApp,
        config.newCompanyState,
        config.newCompanyCity,
        config.newCompanyZip,
        config.newCompanyPhone,
        config.newCompanyEmail,
        config.newCompanyTeamPlan,
        config.newCompanyType
      );
      await createCompany.checkCreationOfNewCompany();
      await createCompany.goToCompanyList();
      await createCompany.findCompany(newConpanyName2, config.companiesPage);
      await createCompany.checkCompanyPlane('Team', 20);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_create');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Change company type @T92e9baee', async () => {
    await lambdaParameters('Change company type @T92e9baee', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editCompany = new CreateCompany(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await editCompany.goToCompanyList();
      await editCompany.findCompany(newConpanyName2, config.companiesPage);
      await editCompany.editCompany(
        false,
        false,
        config.newCompanyTypeFlooring
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_edit_type');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Change email registered for company @Tc16024bb', async () => {
    await lambdaParameters(
      'Change email registered for company @Tc16024bb',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editCompany = new CreateCompany(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await editCompany.goToCompanyList();
      await editCompany.findCompany(newConpanyName2, config.companiesPage);
      await editCompany.editCompany(false, config.newCompanyEmailTest, false);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_edit_type');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('create new company, create project and invite user, and assigned task to them ', async () => {
    await lambdaParameters(
      'create new company, create project and invite user, and assigned task to them ',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createCompany = new CreateCompany(driverChrome);
    const createProjectTest = new CreateProject(driverChrome);
    const inviteUser = new InviteUser(driverChrome);
    // const removeUserTest = new RemoveUser(driverChrome);
    // const updateUser = new UpdateUser(driverChrome);
    const createTask = new CreateTask(driverChrome);

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
      await inviteUser.fillInviteForm(config.emailUseForTestCA, newConpanyName);
      await inviteUser.checkNewUser(
        config.emailUseForTestCA,
        config.mainCompanyPage
      );
      await inviteUser.findUser(config.emailUseForTestCA, config.usersPage);
      await inviteUser.updateAndCheck(
        config.inviteUserName,
        true,
        config.inviteUserPhone,
        false,
        true
      );
      await createTask.goToCreateTasksForm(newProjectName);
      await createTask.fillCreateTask(
        taskName,
        config.taskDescription,
        config.taskDate
      );
      await createTask.checkTaskCreation(taskName)
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(
        driverChrome,
        'company_create_invite_user_project_task'
      );
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Search the company @Tabd69413', async () => {
    await lambdaParameters('Search the company @Tabd69413', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const searchCompany = new CreateCompany(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await searchCompany.clickElement(config.locatorCompaniesLinkCss);
      await searchCompany.waitListDate(config.locatorCompanyListCss, 2);
      startCompanyNumber = await searchCompany.numberOfItemsInTheList(
        config.locatorCompanyListCss
      );
      await searchCompany.enterTextInSearchInput(newConpanyName);
      await searchCompany.waitListDate(config.locatorCompanyListCss, 1);
      endCompanyNumber = await searchCompany.numberOfItemsInTheList(
        config.locatorCompanyListCss
      );
      companyName = await searchCompany.getElementText(
        config.locatorCompaniesNameCss
      );
      if (
        startCompanyNumber > endCompanyNumber &&
        companyName === newConpanyName
      ) {
        console.log(`Test passed, you search project is ${companyName}`);
      } else {
        throw new Error('Test search through the projects failed');
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'search_through_the_projects_by_SU');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Select a few companies from list and delete them @T6f134c79', async () => {
    await lambdaParameters(
      'Select a few companies from list and delete them @T6f134c79',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const createCompany = new CreateCompany(driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createCompany.clickElement(config.locatorCompaniesLinkCss);
      await createCompany.waitListDate(config.locatorCompanyListCss, 2);
      await createCompany.checkElFromArrayInList(
        companiesArray,
        config.locatorUserNames
      );
      await createCompany.clickElement(config.locatorSelectDeleteBtnCss);
      await driverChrome.sleep(500);
      await createCompany.clickElement(config.locatorDeletePoUpBtnCss);
      await createCompany.notificationCheck();
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'del_two_company');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
