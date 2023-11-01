const {createWebdriverChrom} = require('../webdriver');
const LoginPage = require('../../classes/login');
const CreateProject = require("../../classes/createProject");
const RemoveProject = require("../../classes/removeProject")
const makeScreenshot = require('../makeScreenShot');
const { describe } = require("mocha");
const should = require("chai").should();


describe("create and remove project in the chrom browser", async () => {

    let driverChrome = null;
    // const URL = 'http://localhost:4400/login';
    // const urlForCheck = "http://localhost:4400/system/dashboard";
    // const projectsPage =  'http://localhost:4400/system/projects';
    const projectsPage = 'https://dev-frontend.colorjob.terenbro.com/system/projects';
    const URL = 'https://dev-frontend.colorjob.terenbro.com/login';
    const urlForCheck = "https://dev-frontend.colorjob.terenbro.com/system/dashboard"
    const email = "superadmin@gmail.com";
    const password ="colorjob" ;
    const successMessage = 'No such company in the list of company'

    const newProjectName = 'Test13';
    const newProjectNumber = '1312'
    const newProjectStreet = "Test";
    const newProjectApp = 'Test';
    const newProjectZip = "00000";
    const newCompanyProjectBelong = "terenbro";
    const newProjectClientName = "test13";
    const newProjectState = "New York";
    const newCompanProjectCity = "New York";
    const startDate = '12.12.23';
    const eneDate= '12.12.24';
    
    beforeEach(async()=>{

        driverChrome = await createWebdriverChrom()

    });

    afterEach(async()=>{

        if (driverChrome){
            await driverChrome.quit();
        }
    });

    it("create new project", async ()=>{
        console.log(Date().toLocaleLowerCase(), 'date', URL);
        const logginPageTest = new LoginPage(driverChrome, URL);
        const CreateProjectTest = new CreateProject(driverChrome);
       
        await logginPageTest.openLoginForm();
        await logginPageTest.fillEmailInput(email);
        await logginPageTest.fillPasswordInput(password);
        await logginPageTest.checkSaveForFuture();
        await logginPageTest.login(urlForCheck);
        
        
       
        try {
            await CreateProjectTest.goToCreateProjectForm();
            await CreateProjectTest.fillCreateProjectFields(
                newProjectName ,
                newProjectNumber,
                newCompanyProjectBelong,
                newProjectStreet,
                newProjectApp,
                newProjectState ,
                newCompanProjectCity ,
                newProjectZip,
                newProjectClientName ,
                startDate,
                eneDate,
            );
            await CreateProjectTest.chekCreationOfNewProject(newProjectName);
            
        } catch (error) {

            await makeScreenshot(driverChrome, 'project_create')
            throw error

        }
       
    });

    it('remove project', async()=>{
        const logginPageTest = new LoginPage(driverChrome, URL);
        const removeProject = new RemoveProject(driverChrome);

        try {

            await logginPageTest.openLoginForm();
            await logginPageTest.fillEmailInput(email);
            await logginPageTest.fillPasswordInput(password);
            await logginPageTest.checkSaveForFuture();
            await logginPageTest.login(urlForCheck);
    
            await removeProject.goToProjectList();
            await removeProject.findProject(newProjectName, projectsPage);
            await removeProject.removefindProject(newProjectName)

        } catch (error) {
            
            await makeScreenshot(driverChrome, 'project_remove')
            throw error
        }
       
        
    })

})