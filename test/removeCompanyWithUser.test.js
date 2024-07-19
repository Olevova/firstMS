const { createWebdriverChrom } = require('../src/utils/webdriver');
const lambdaParameters = require('../src/utils/lambdaAddParameters');
const LoginPage = require('../src/classes/auth/login');
const CreateCompany = require('../src/classes/company/createCompany');
const RemoveCompany = require('../src/classes/company/removeCompany');
const InviteUser = require('../src/classes/user/inviteUser');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Remove company with the user in the chrom browser, test-cases #11.2', async () => {
  // here add parameters for creation
  let driverChrome = null;

  const newConpanyName = 'CompanyUser';
  const newCompanyStreet = 'test2';
  const newCompanyApp = '15';
  const newCompanyZip = '00000';
  const newCompanyPhone = '+1111112111';
  const newCompanyEmail = 'fortest@test.com';
  const newCompanyPlan = 'Enterprise';
  const newCompanyType = 'tiling';
  const newCompanyState = 'New York';
  const newCompanyCity = 'New York';

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create new company, and invite new user to the company, test-case #11.2', async () => {
    await lambdaParameters('create new company, and invite new user to the company, test-case #11.2',driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createCompany = new CreateCompany(driverChrome);
    const inviteUser = new InviteUser(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);
    try {
      await createCompany.goToCreateCompanyForm();
      await createCompany.fillCreateCompany(
        newConpanyName,
        newCompanyStreet,
        newCompanyApp,
        newCompanyState,
        newCompanyCity,
        newCompanyZip,
        newCompanyPhone,
        newCompanyEmail,
        newCompanyPlan,
        newCompanyType
      );
      await createCompany.checkCreationOfNewCompany();
      await inviteUser.goToInviteUsersForm('sa');
      await inviteUser.fillInviteForm(
        config.emailUseForTest,
        newConpanyName,
        config.standartUser
      );
      await inviteUser.checkNewUser(config.emailUseForTest, config.usersPage);
      await lambdaParameters('passed',driverChrome);
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_create_invite_user');
      await lambdaParameters('failed',driverChrome);
      throw error;
    }
  });

  it('remove company with the user', async () => {
    await lambdaParameters('remove company with the user',driverChrome);
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeCompany = new RemoveCompany(driverChrome);
    try {
      await logginPageTest.openLoginForm();
      await logginPageTest.fillEmailInput(config.email);
      await logginPageTest.fillPasswordInput(config.password);
      await logginPageTest.checkSaveForFuture();
      await logginPageTest.login(config.urlhomePageForCheck);

      await removeCompany.goToCompanyList();
      await removeCompany.removeCompanyViaThreeDotsMenu(newConpanyName);
      await lambdaParameters('passed',driverChrome);
      //   await driverChrome.sleep(1000)
    } catch (error) {
      await makeScreenshot(driverChrome, 'company_remove');
      await lambdaParameters('failed',driverChrome);
      throw error;
    }
  });
});
