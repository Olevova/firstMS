const { createWebdriverChrome } = require('../../src/utils/webdriver');
const lambdaParameters = require('../../src/utils/lambdaAddParameters');
const LoginPage = require('../../src/classes/auth/login');
const DashboardPage = require('../../src/classes/dashboard/dashboardPage.js')
const CompanyListPage = require("../../src/classes/company/companyListPage.js")
const ProjectListPage = require("../../src/classes/project/projectListPage.js")
const makeScreenshot = require('../../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../../src/utils/config');
const EditTaskPage = require('../../src/classes/task/editTasksPage.js');


describe('Dashboard tests @Sbfdc74b0', async () => {
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
  
  it('Dashboard contains greeting @Tdc1576d0', async () => {
      await lambdaParameters(
        'Dashboard contains greeting @Tdc1576d0',
        driverChrome
      );

      const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
      const dashboardPage = new DashboardPage(driverChrome);

      await logginPageTest.userLogIn(
        config.email,
        config.password,
        config.urlhomePageForCheck
      );

    try{
      await dashboardPage.isCompanyTotalNumberShown();
      await dashboardPage.isProjectTotalNumberShown();
      await dashboardPage.isGreetingsShown();
      await lambdaParameters('passed', driverChrome);
    }
    catch(error){
      await makeScreenshot(driverChrome, 'Greetings_dashabord');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });

  it('Total companies number is correct @T57da2395', async () => {
    await lambdaParameters(
      'Total companies number is correct @T57da2395',
      driverChrome
    );

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const dashboardPage = new DashboardPage(driverChrome);

  await logginPageTest.userLogIn(
    config.email,
    config.password,
    config.urlhomePageForCheck
  );

  try {
    await dashboardPage.isCompanyTotalNumberShown();
    await lambdaParameters('passed', driverChrome);
    //TODO check company number from API
  }
  catch(error){
    await makeScreenshot(driverChrome, 'task_change_status');
    await lambdaParameters('failed', driverChrome);
    throw error;
  }
});

it('Companies list is shown @T362c70cc', async () => {
  await lambdaParameters(
    'Companies list is shown @T362c70cc',
    driverChrome
  );

  const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  const dashboardPage = new DashboardPage(driverChrome);

await logginPageTest.userLogIn(
  config.email,
  config.password,
  config.urlhomePageForCheck
);

try {
  await dashboardPage.isCompanyListShown();
  await lambdaParameters('passed', driverChrome);

}
catch(error){
  await makeScreenshot(driverChrome, 'task_change_status');
  await lambdaParameters('failed', driverChrome);
  throw error;
}
});

it('Click See All companies button @T38118c13', async () => {
  await lambdaParameters(
    'See All companies button @T38118c13',
    driverChrome
  );

  const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  const dashboardPage = new DashboardPage(driverChrome);
  const companyListPage = new CompanyListPage(driverChrome);

await logginPageTest.userLogIn(
  config.email,
  config.password,
  config.urlhomePageForCheck
);

try {
  await dashboardPage.clickSeeAllCompaniesLink();
  await companyListPage.isCompanyPageOpen();
  await lambdaParameters('passed', driverChrome);
}
catch(error){
  await makeScreenshot(driverChrome, 'task_change_status');
  await lambdaParameters('failed', driverChrome);
  throw error;
}
});

it('Total project number is correct @Ta59c9329', async () => {
  await lambdaParameters(
    'Total project number is correct @Ta59c9329',
    driverChrome
  );

  const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  const dashboardPage = new DashboardPage(driverChrome);

await logginPageTest.userLogIn(
  config.email,
  config.password,
  config.urlhomePageForCheck
);

try {
  await dashboardPage.isProjectTotalNumberShown();
  await lambdaParameters('passed', driverChrome);
  //TODO verify project number via API
}
catch(error){
  await makeScreenshot(driverChrome, 'task_change_status');
  await lambdaParameters('failed', driverChrome);
  throw error;
}
});

it('Project list is shown @T854fe8bc', async () => {
  await lambdaParameters(
    'Project list is shown @T854fe8bc',
    driverChrome
  );

  const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  const dashboardPage = new DashboardPage(driverChrome);

  await logginPageTest.userLogIn(
    config.email,
    config.password,
    config.urlhomePageForCheck
  );

try {

await dashboardPage.isProjectListShown();
  await dashboardPage.clickSeeAllProjectsLink();
  //TODO verify project data via API
  await lambdaParameters('passed', driverChrome);
}
catch(error){
  await makeScreenshot(driverChrome, 'task_change_status');
  await lambdaParameters('failed', driverChrome);
  throw error;
}
});

it('Click See All projects button @T38118c13', async () => {
  await lambdaParameters(
    'See All projects button @T38118c13',
    driverChrome
  );

  const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  const dashboardPage = new DashboardPage(driverChrome);
  const projectListPage = new ProjectListPage(driverChrome);

  await logginPageTest.userLogIn(
    config.email,
    config.password,
    config.urlhomePageForCheck
  );

try {
  await dashboardPage.clickSeeAllProjectsLink();
  await projectListPage.isProjectListPageOpen();
  await lambdaParameters('passed', driverChrome);
}
catch(error){
  await makeScreenshot(driverChrome, 'task_change_status');
  await lambdaParameters('failed', driverChrome);
  throw error;
}
});

it('Open project by ID @Tcf4f0954', async () => {
  await lambdaParameters(
    'pen project by ID @Tcf4f0954',
    driverChrome
  );

  const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  const dashboardPage = new DashboardPage(driverChrome);
  const projectListPage  = new ProjectListPage(driverChrome);

  await logginPageTest.userLogIn(
    config.email,
    config.password,
    config.urlhomePageForCheck
  );

try {
  await dashboardPage.openFirstProjectByID();
  await projectListPage.isProjectDetailsPageOpen();
  await lambdaParameters('passed', driverChrome);
  //TODO change to new data after API
}

catch(error){
  await makeScreenshot(driverChrome, 'task_change_status');
  await lambdaParameters('failed', driverChrome);
  throw error;
}
});

it('Open project by name @Te29628d8', async () => {
  await lambdaParameters(
    'Open project by name @Te29628d8',
    driverChrome
  );

  const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  const dashboardPage = new DashboardPage(driverChrome);
  const projectListPage  = new ProjectListPage(driverChrome);

  await logginPageTest.userLogIn(
    config.email,
    config.password,
    config.urlhomePageForCheck
  );

try {
  await dashboardPage.openFirstProjectByID();
  await projectListPage.isProjectDetailsPageOpen();
  await lambdaParameters('passed', driverChrome);
  //TODO change to new data after API
}

catch(error){
  await makeScreenshot(driverChrome, 'task_change_status');
  await lambdaParameters('failed', driverChrome);
  throw error;
}
});
it('Open company by ID @T2e93efbd', async () => {
  await lambdaParameters(
    'Open company by ID',
    driverChrome
  );

  const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  const dashboardPage = new DashboardPage(driverChrome);
  const companyListPage = new CompanyListPage(driverChrome);

  await logginPageTest.userLogIn(
    config.email,
    config.password,
    config.urlhomePageForCheck
  );

try {
  await dashboardPage.openFirstCompanyByID();
  await companyListPage.isCompanyPageOpen();
  await lambdaParameters('passed', driverChrome);
}

catch(error){
  await makeScreenshot(driverChrome, 'task_change_status');
  await lambdaParameters('failed', driverChrome);
  throw error;
}
});

it('Open company by name @T0d10f435', async () => {
  await lambdaParameters(
    'Open company by name',
    driverChrome
  );

  const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  const dashboardPage = new DashboardPage(driverChrome);
  const companyListPage = new CompanyListPage(driverChrome);

  await logginPageTest.userLogIn(
    config.email,
    config.password,
    config.urlhomePageForCheck
  );

try {
  await dashboardPage.openFirstCompanyByName();
  await companyListPage.isCompanyPageOpen();
  await lambdaParameters('passed', driverChrome);

}

catch(error){
  await makeScreenshot(driverChrome, 'task_change_status');
  await lambdaParameters('failed', driverChrome);
  throw error;
}
});

it('Open task by ID @Tdaf5301f', async () => {
  await lambdaParameters(
    'Open task by ID @Tdaf5301f',
    driverChrome
  );

  const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  const dashboardPage = new DashboardPage(driverChrome);
  const editTaskPage = new EditTaskPage(driverChrome);

  await logginPageTest.userLogIn(
    config.emailCA,
    config.passwordCA,
    config.mainCompanyPage
  );

try {
  await dashboardPage.openFirstTaskById();
  await editTaskPage.isEditPageOpen();
  await lambdaParameters('passed', driverChrome);

}

catch(error){
  await makeScreenshot(driverChrome, 'task_change_status');
  await lambdaParameters('failed', driverChrome);
  throw error;
}
});

it('Open task by name ', async () => {
  await lambdaParameters(
    'Open task by name',
    driverChrome
  );

  const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  const dashboardPage = new DashboardPage(driverChrome);
  const editTaskPage = new EditTaskPage(driverChrome);

  await logginPageTest.userLogIn(
    config.emailCA,
    config.passwordCA,
    config.mainCompanyPage
  );

try {
  await dashboardPage.openFirstTaskByName();
  await editTaskPage.isEditPageOpen();
  await lambdaParameters('passed', driverChrome);

}

catch(error){
  await makeScreenshot(driverChrome, 'task_change_status');
  await lambdaParameters('failed', driverChrome);
  throw error;
}
});

it('Company admin uses dashboard', async () => {
  await lambdaParameters(
    'Company admin uses dashboard',
    driverChrome
  );

  const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  const dashboardPage = new DashboardPage(driverChrome);
  const editTaskPage = new EditTaskPage(driverChrome);

  await logginPageTest.userLogIn(
    config.emailCA,
    config.passwordCA,
    config.mainCompanyPage
  );

try {
  await dashboardPage.isCompanySectionHidden();
  await lambdaParameters('passed', driverChrome);

}

catch(error){
  await makeScreenshot(driverChrome, 'task_change_status');
  await lambdaParameters('failed', driverChrome);
  throw error;
}
});
it('Project manager uses dashboard', async () => {
  await lambdaParameters(
    'Project manager uses dashboard',
    driverChrome
  );

  const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  const dashboardPage = new DashboardPage(driverChrome);
  const editTaskPage = new EditTaskPage(driverChrome);

  await logginPageTest.userLogIn(
    config.emailPM,
    config.passwordPM,
    config.mainCompanyPage
  );

try {
  await dashboardPage.isCompanySectionHidden();
  await lambdaParameters('passed', driverChrome);

}

catch(error){
  await makeScreenshot(driverChrome, 'task_change_status');
  await lambdaParameters('failed', driverChrome);
  throw error;
}
});
it('Standard user uses dashboard', async () => {
  await lambdaParameters(
    'Open task by name',
    driverChrome
  );

  const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  const dashboardPage = new DashboardPage(driverChrome);
  const editTaskPage = new EditTaskPage(driverChrome);

  await logginPageTest.userLogIn(
    config.emailSU,
    config.passwordSU,
    config.mainCompanyPage
  );

try {
  await dashboardPage.isCompanySectionHidden();
  await dashboardPage.isProjectSectionHidden();
  await dashboardPage.isMyTasksTotalNumberShown();
  await lambdaParameters('passed', driverChrome);

}

catch(error){
  await makeScreenshot(driverChrome, 'task_change_status');
  await lambdaParameters('failed', driverChrome);
  throw error;
}
});



});