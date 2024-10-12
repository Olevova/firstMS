const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const CreateCompany = require('../../src/classes/company/createCompany');
const CreateProject = require('../../src/classes/project/createProject');
const EditProject = require('../../src/classes/project/editProject');
const InviteUser = require('../../src/classes/user/inviteUser');
const CreateFloor = require('../../src/classes/view/floor/createFloor');
const CreateUnit = require('../../src/classes/view/unit/createUnit');
const CreateRoom = require('../../src/classes/view/room/createRoom');
const CreateTask = require('../../src/classes/task/createTask');
const UpdateUser = require('../../src/classes/user/updateUser');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Company management tests @Sb36e9099', async () => {
  let driverChrome = null;
  const companyCreate =
    'focus on the first element of the company creation form';
  const projectCreate =
    'focus on the first element of the project creation form';
  const projectEdit = 'focus on the first element of the project creation form';
  const roomCreate = 'focus on the first element of the create Room form';
  const taskCreate = 'focus on the first element of the create Task form';
  const userInvite = 'focus on the first element of the invite user form';
  const userEdit = 'focus on the first element of the edit user form';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Verification about cursor in first field of item creation forms @T36d81540', async () => {
    await lambdaParameters(
      'Verification about cursor in first field of item creation forms',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createCompany = new CreateCompany(driverChrome);
    const createProjectTest = new CreateProject(driverChrome);
    const createFloor = new CreateFloor(driverChrome);
    const createUnit = new CreateUnit(driverChrome);
    const createRoom = new CreateRoom(driverChrome);
    const createTask = new CreateTask(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await createCompany.goToCreateCompanyForm();
      await createCompany.isFirstInputFocused(
        config.locatorCompanyFormCss,
        companyCreate
      );
      await createCompany.clickElement(config.locatorClosePoUpBtnCss);
      await createFloor.goToView(config.projectStatus);
      //   await createFloor.clickElement('#addFloor');
      //   await createFloor.clickElement('#createNewFloor');
      //   await createFloor.isFirstInputFocused('.form-create-item-instead-btn.form-create-floor', 'focus on the first element of the create floor form');
      //   await createFloor.clickElement('#canselBtnCreateFloor');

      //   await createUnit.clickElement('#addUnit');
      //   await createUnit.clickElement('#createNewUnitDesk','_','_', 500);
      //   await createUnit.isFirstInputFocused('.form-create-unit-instead-btn[openedunit="true"]','focus on the first element of the create Unit form' );
      //   await createUnit.clickElement('#canselBtnCreateUnit');

      await createRoom.clickElement(config.locatorAddRoomBtnCss, false, 0);
      await createRoom.clickElement(config.locatorCreateRoomBtnCss);
      await createRoom.isFirstInputFocused('.form-invite', roomCreate);
      await createRoom.clickElement(config.locatorClosePoUpBtnCss);

      await createTask.goToSelectTab(config.tasks);
      await createTask.clickElement(config.locatorCreatePouUpBtnCss);
      await createTask.isFirstInputFocused('app-task-form', taskCreate);

      await driverChrome.sleep(1000);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'cursor_focus');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Focus to first field Invite User Form', async () => {
    await lambdaParameters(
      'Focus to first field Invite User Form',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await inviteUserTest.goToInviteUsersForm('sa');
      await inviteUserTest.isFirstInputFocused(
        config.locatorInviteUserWindowCss,
        userInvite
      );

      await driverChrome.sleep(1000);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'cursor_focus_invite_user_form');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Focus to first field Edit User Form', async () => {
    await lambdaParameters('Focus to first field Edit User Form', driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const updateUser = new UpdateUser(driverChrome);

    await logginPageTest.userLogIn(
      config.emailCA,
      config.passwordCA,
      config.mainCompanyPage
    );

    try {
      await updateUser.openUserForm();
      await updateUser.isFirstInputFocused(
        config.locatorInviteUserWindowCss,
        userEdit
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'cursor_focus_edit_user_form');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Focus to first field Create Project Form', async () => {
    await lambdaParameters(
      'Focus to first field Create Project Form',
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
      await createProjectTest.isFirstInputFocused(
        config.locatorProjectFormCss,
        projectCreate
      );
      await createProjectTest.clickElement(config.locatorProjectCloseFormCss);

      await driverChrome.sleep(500);
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'cursor_focus_create_project_form');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Focus to first field Edit Project Form', async () => {
    await lambdaParameters(
      'Focus to first field Edit Project Form',
      driverChrome
    );
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const editProject = new EditProject(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await editProject.goToProjectList();
      await driverChrome.sleep(1000);
      await editProject.findProject(
        config.projectNameEdit,
        config.projectsPage
      );
      await editProject.clickElement(config.locatorProjectEditBtnCss);
      await editProject.isFirstInputFocused(
        config.locatorProjectFormCss,
        projectEdit
      );
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'cursor_focus_edit_project_form');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
