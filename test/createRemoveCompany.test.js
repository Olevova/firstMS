const {createWebdriverChrom} = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/login');
const CreateCompany = require("../src/classes/createCompany");
const RemoveCompany = require("../src/classes/removeCompany");
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require("mocha");
const should = require("chai").should();


describe("create and remove company in the chrom browser", async () => {

    let driverChrome = null;
    // const URL = 'http://localhost:4200/login';
    // const urlForCheck = "http://localhost:4200/system/dashboard";
    // const companiesPage = 'http://localhost:4200/system/companies';
    const companiesPage = 'https://dev-frontend.colorjob.terenbro.com/system/companies';
    const URL = 'https://dev-frontend.colorjob.terenbro.com/login';
    const urlForCheck = "https://dev-frontend.colorjob.terenbro.com/system/dashboard"
    const email = "superadmin@gmail.com";
    const password ="colorjob" ;

    const newConpanyName = 'Test13';
    // const newConpanyName = '';
    const newCompanyStreet = "Test";
    const newCompanyApp = 'Test';
    const newCompanyZip = "00000";
    const newCompanyPhone = "+1111111111";
    const newCompanyEmail = "test1@test.com";
    const newCompanyType = "tiling";
    const newCompanyState = "New York"
    const newCompanyCity = "New York"
    
    beforeEach(async()=>{

        driverChrome = await createWebdriverChrom()

    });

    afterEach(async()=>{

        if (driverChrome){
            await driverChrome.quit();
        }
    });

    it("create new company", async ()=>{

        const logginPageTest = new LoginPage(driverChrome, URL);
        const createCompany = new CreateCompany(driverChrome);
       
        await logginPageTest.openLoginForm();
        await logginPageTest.fillEmailInput(email);
        await logginPageTest.fillPasswordInput(password);
        await logginPageTest.checkSaveForFuture();
        await logginPageTest.login(urlForCheck);
        
        
       
        try {
            await createCompany.goToCreateCompanyForm();
            await createCompany.fillCreateCompany(
            newConpanyName ,
            newCompanyStreet,
            newCompanyApp,
            newCompanyState,
            newCompanyCity,
            newCompanyZip,
            newCompanyPhone,
            newCompanyEmail ,
            newCompanyType 
            );
            await createCompany.checkCreationOfNewCompany(newConpanyName)
        
        } catch (error) {

            await makeScreenshot(driverChrome, 'company_create')
            throw error

        }
       
    });

    it('remove company', async()=>{
        
        const logginPageTest = new LoginPage(driverChrome, URL);
        const removeCompany = new RemoveCompany(driverChrome);

        try {

            await logginPageTest.openLoginForm();
            await logginPageTest.fillEmailInput(email);
            await logginPageTest.fillPasswordInput(password);
            await logginPageTest.checkSaveForFuture();
            await logginPageTest.login(urlForCheck);
    
            await removeCompany.goToCompanyList();
            await removeCompany.findCompany(newConpanyName, companiesPage);
            await removeCompany.removefindCompany(newConpanyName);
          
        } catch (error) {
            
            await makeScreenshot(driverChrome, 'company_remove');
            throw error
        }
       
        
    })


})