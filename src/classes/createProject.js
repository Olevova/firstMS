const {By, until} = require('selenium-webdriver');

class CreateProject{

  // The method for selecting a value from a dropdown list
  static async findDateInDropDown(array, text) {
   
    for (const option of array) {

        const dateProject = (await option.getText()).trim().toLowerCase();
        console.log(dateProject, 'dateProject');
        if (dateProject === text.trim().toLowerCase()) {
          await option.click();
          return;
        }
      };
      
      throw Error(`No ${text} in options list`);
  }

    constructor(driver){
        this.driver = driver;

    };

    async goToCreateProjectForm(){
        
        const projectBtn = await this.driver.findElement(By.id('linkProjects'));
        await projectBtn.click();

        const creatProject = await this.driver.findElement(By.id('btnCreate'));
        await creatProject.click();

    }

    async fillCreateProjectFields(name, number, company, street, app, state, city, zipcode, client, startdate, enddate){

        const createForm = this.driver.findElement(By.className("modal"));
        await this.driver.wait(until.elementIsVisible(createForm),3000);

        const projectName = await this.driver.findElement(By.id("projectName"));
        await projectName.sendKeys(name);

        const projectNumber = await this.driver.findElement(By.id("projectNumber"));
        await projectNumber.sendKeys(number);

        const companyProjectBelong =  await this.driver.findElement(By.id('projectSelectCompany'));
        await companyProjectBelong.click();
        
        const companyList = await this.driver.findElements(By.className('ng-option'));
        await this.driver.wait(until.elementsLocated(By.className('ng-option')),10000);
        for (const company of companyList){
          console.log(await company.getText());
        }
        await CreateProject.findDateInDropDown(companyList, company);
     
        const addressStreet = await this.driver.findElement(By.id("projectAddress"));
        await addressStreet.sendKeys(street);

        const addressApart = await this.driver.findElement(By.id("projectAddressSecond"));
        await addressApart.sendKeys(app)

        const stateDropDown = await this.driver.findElement(By.id("projectSelectState"));
        await stateDropDown.click();
        const stateList  = await this.driver.findElements(By.className("ng-option"));
      
        await CreateProject.findDateInDropDown(stateList, state);
       

        const cityDropDown = await this.driver.findElement(By.id("projectSelectCity")) ;
        await cityDropDown.click();
        const cityList = await this.driver.findElements(By.className("ng-option"));
        await CreateProject.findDateInDropDown(cityList, city);
       
        const projectZip = await this.driver.findElement(By.id("projectZipCode"));
        await projectZip.sendKeys(zipcode);

        const projectClientName = await this.driver.findElement(By.id("projectClientName"));
        await projectClientName.sendKeys(client);

        const projectStartData = await this.driver.findElement(By.id("projectStartDate"));
        await projectStartData.sendKeys(startdate);

        const projectEndtData = await this.driver.findElement(By.id('projectEndDate'));
        await projectEndtData.sendKeys(enddate);
        
        const createBtn = await this.driver.findElement(By.id('btnSubmit'));
        createBtn.click()
        
    }

    async chekCreationOfNewProject(company){
      
        // await this.driver.wait(until.elementsLocated(By.id('mainErrorText')),1000); 
        const formError = await this.driver.wait(until.elementLocated(By.id('mainErrorText')), 1000).catch(() => null);
        console.log(formError);
          if (formError)
            {
            console.log('Error element exists:', formError);
            throw new Error('You have error, check screenshot')
          
            };

        await this.driver.wait(until.elementsLocated(By.className('notification')),10000);    
        const windowHandles = await this.driver.findElement(By.className('notification'));
        
        const windowHandlesText = await windowHandles.getText();
        console.log(windowHandlesText);
        
        if(windowHandlesText==='Error. Failed to save data')
          {
            throw new Error('Such company is created')

          };

        try {
          
          let projectName='';
          await this.driver.wait(until.elementsLocated(By.className('company-name')),10000)
          const projectNameList = await this.driver.findElements(By.className('company-name'))
          
          if(projectNameList){
            for(let i = 0; i < projectNameList.length; i += 1){
              projectName = await projectNameList[i].getText();
    
            if(projectName===company)
              {
                return projectName;
              }
            }
          }

          }
        catch (error) {
         throw new Error(error.message);
        }
    }

};

module.exports = CreateProject;