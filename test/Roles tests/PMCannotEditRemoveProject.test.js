const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const EditProject = require('../../src/classes/project/editProject');
const LoginPage = require('../../src/classes/auth/login');
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');

describe('Project management role @Sfbe51cff', async () => {
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
    return;
  });

  it("PM cannot edit project @Ta1eb2ce8", async () => {
    await lambdaParameters(
      "PM cannot edit project",
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");
    const editProject = new EditProject(driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );
    try {
      await editProject.goToView(config.projectNameForPM, 'pm');
      await editProject.goToSelectTab(config.settings);
      const editBtn = await editProject.checkMissingElement('.settings-wrapper__btn-edit', 1000);
      console.log(editBtn);

      if(editBtn){
        console.log('Test passed PM cannot edit Project');

      }
      if(!editBtn){
        throw new Error('PM can edit Project, test failed')
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'edit_project_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it("PM cannot delete project @Tf76e80f0", async () => {
    await lambdaParameters(
      "PM cannot delete project",
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");
    const editProject = new EditProject(driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );
    try {
      await editProject.goToView(config.projectNameForPM, 'pm');
      await editProject.goToSelectTab(config.settings);
      const deleteBtn = await editProject.checkMissingElement(config.locatorDeleteProjectCss, 1000);
      console.log(deleteBtn);

      if(deleteBtn){
        console.log('Test passed PM cannot delete Project');

      }
      if(!deleteBtn){
        throw new Error('PM can delete Project, test failed')
      }
      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'delete_project_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it("Project setting tab shows project details @T243a9425", async () => {
    await lambdaParameters(
      "Project setting tab shows project details",
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");
    const editProject = new EditProject(driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );
    try {
      await editProject.goToView(config.projectNameForPM, 'pm');
      await editProject.goToSelectTab(config.settings);
      await editProject.waitListDate('app-project-settings .table-details-info-row',12);
      const projectEl = await editProject.getElementText('.table-details__info',true);
      if(config.projectIDForPM === projectEl){
        console.log('Test passed, Project settings tab show right ID');

      }else{
        throw new error(`test failed, project ID is ${projectEl}`);
      }

      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'Project_setting_tab_shows_ID_by_PM');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Navigation works on project list page @T39047183', async () => {
    await lambdaParameters(
      'Navigation works on project list page',
      driverChrome
    );
    // await driverChrome.executeScript("document.body.style.zoom='50%'");
    const editProject = new EditProject(driverChrome);
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);

    await logginPageTest.userLogIn(
      config.emailPM,
      config.passwordPM,
      config.mainCompanyPage
    );
    try {
      await editProject.goToView(config.projectNameForPM, 'pm');
      await editProject.waitListDate('app-project-view .floor-item', 1);
      const viewEl = await editProject.getElementText(
        '.floor-item',
        false,
        'title'
      );
      
      if ('Floor 1' === viewEl || 'Floor 2' === viewEl) {
        console.log(viewEl, 'viewEl');

        console.log('Test passed, Project view tab show');
      } else {
        throw new error(`test failed, Project view tab not show`);
      }
      await editProject.goToSelectTab(config.projectProgress);
      await editProject.waitListDate('app-project-progress #filter-floors', 1);
      const projProgressEl = await editProject.getElementText(
        '#filter-floors',
        true
      );
      if ('Floors' === projProgressEl.trim()) {
        console.log(projProgressEl, 'projProgressEl');
        console.log('Test passed, Project Progress tab show');
      } else {
        throw new error(`test failed, Project Progress tab not show`);
      }
      await editProject.goToSelectTab(config.tasks);
      await editProject.waitListDate('app-tasks #btnCreate', 1);
      const tasksEl = await editProject.getElementText('#btnCreate', true);
      if ('Create Task' === tasksEl.trim()) {
        console.log(tasksEl, 'tasksEl');
        console.log('Test passed, Tasks tab show');
      } else {
        throw new error(`test failed, Tasks tab not show`);
      }
      await editProject.goToSelectTab(config.users);
      await editProject.waitListDate('app-users #btnAddUsersToProject', 1);
      const usersEl = await editProject.getElementText(
        '#btnAddUsersToProject',
        true
      );
      if ('Add Existing User' === usersEl.trim()) {
        console.log(usersEl, 'usersEl');
        console.log('Test passed, Users tab show');
      } else {
        throw new error(`test failed, Users tab not show`);
      }
      await editProject.goToSelectTab(config.activity);
      await editProject.waitListDate(
        'app-activity-project-table .activity-item',
        5
      );
      await editProject.goToSelectTab(config.settings);
      await editProject.waitListDate(
        'app-project-settings .table-details-info-row',
        12
      );
      const projectEl = await editProject.getElementText(
        '.table-details__info',
        true
      );
      if (config.projectIDForPM === projectEl) {
        console.log('Test passed, Project settings tab show right ID');
      } else {
        throw new error(`test failed, project ID is ${projectEl}`);
      }

      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(
        driverChrome,
        'navigation_works_on_project_list_page_by_PM'
      );
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
