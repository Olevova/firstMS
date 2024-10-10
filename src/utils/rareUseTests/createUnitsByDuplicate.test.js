const { createWebdriverChrome } = require('../webdriver');
const LoginPage = require('../../classes/auth/login');
const DuplicateUnit = require('../../classes/view/unit/duplicateUnit');

const makeScreenshot = require('../makeScreenShot');
const { describe } = require('mocha');
const config = require('../config');
// const { nanoid } = require('nanoid');

describe('duplicate 20 units', async () => {
  // here add parameters for creation
  let driverChrome = null;

  // const URL = 'http://frontend-cj:4200/login';
  // const urlForCheck = "http://frontend-cj:4200/system/dashboard";
  // const companiesPage = 'http://frontend-cj:4200/system/companies';

  const companiesPage =
    'https://dev-frontend.colorjob.terenbro.com/system/companies';
  const URL = 'https://dev-frontend.colorjob.terenbro.com/login';
  const urlForCheck =
    'https://dev-frontend.colorjob.terenbro.com/system/dashboard';
  const email = 'superadmin@gmail.com';
  const password = 'colorjob';
  const projectName = '20 units';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrome();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('duplicate unit', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const duplicateUnit = new DuplicateUnit(driverChrome);

    await logginPageTest.userLogIn(
      config.email,
      config.password,
      config.urlhomePageForCheck
    );

    try {
      await duplicateUnit.goToView(projectName);
      for (let i = 0; i < 15; i += 1) {
        await duplicateUnit.duplicateUnit();
      }

      await lambdaParameters('passed', driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, '20unit_duplicate');
      await lambdaParameters('failed', driverChrome);
      throw error;
    }
  });
});
