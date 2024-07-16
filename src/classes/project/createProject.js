const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class CreateProject extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.startProjectsNumber = 0;
    this.endProjectsNumber = 0;
  }

  async goToCreateProjectForm(user='sa') {
    if(user === 'sa'){
      const projectBtnSa = await this.driver.findElement(By.id('linkProjects'));
      await projectBtnSa.click();
      this.startProjectsNumber = await this.numberOfItems(this.driver);
    }
      
    if(user !== 'sa'){
      await this.driver.sleep(1000);
    }
    const creatProject = await this.driver.findElement(By.id('btnCreate'));
    await creatProject.click();
    
  }

  async fillCreateProjectFields(
    name,
    key=null,
    number,
    company,
    street,
    app,
    state,
    city,
    zipcode,
    client,
    startdate,
    enddate,
  ) {
    await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"]')),10000);
    const projectName = await this.driver.findElement(By.id('projectName'));
    await projectName.click();
    await projectName.sendKeys(name);
    await this.driver.sleep(1000)
    
    // await projectKey.clear();
    // await projectKey.click();
    if(key !== null){
      const projectKey = await this.driver.findElement(By.id('projectCode'));
      await projectKey.sendKeys(key);
      await this.driver.sleep(1000)
    }
    
    await this.driver.wait(until.elementLocated(By.id('projectNumber')),10000);
    
    let projectNumber = await this.driver.findElement(By.id('projectNumber'));
   
    await projectNumber.sendKeys(number);
   
    const companyProjectBelong = await this.driver.findElement(
      By.id('projectSelectCompany')
    );
    await companyProjectBelong.click();

    await this.driver.executeScript('return document.readyState');

    await this.waitListDate('.ng-option', 2);
    const companyList = await this.driver.findElements(
      By.className('ng-option')
    );

    await this.findDateInDropDown(companyList, company);
    const addressStreet = await this.driver.findElement(
      By.id('projectAddress')
    );
  
    await addressStreet.click();
    await addressStreet.sendKeys(street);

    const addressApart = await this.driver.findElement(
      By.id('projectAddressSecond')
    );
    await addressApart.click();
    await addressApart.sendKeys(app);

    const stateDropDown = await this.driver.findElement(
      By.id('projectSelectState')
    );
    await stateDropDown.click();
    const stateList = await this.driver.findElements(By.className('ng-option'));

    await this.findDateInDropDown(stateList, state);

    const cityDropDown = await this.driver.findElement(
      By.id('projectSelectCity')
    );
    await cityDropDown.click();
    const cityList = await this.driver.findElements(By.className('ng-option'));
    await this.findDateInDropDown(cityList, city);

    const projectZip = await this.driver.findElement(By.id('projectZipCode'));
    await projectZip.click();
    await projectZip.sendKeys(zipcode);

    const projectClientName = await this.driver.findElement(
      By.id('projectClientName')
    );
    await projectClientName.click();
    await projectClientName.sendKeys(client);

    await projectNumber.clear();
    await projectNumber.sendKeys(number);
    await this.driver.sleep(1000)
    const createBtn = await this.driver.findElement(By.id('btnSubmit'));

   
    await this.driver.sleep(1000)
    createBtn.click();
   
    // await projectNumber.clear();
    // await projectNumber.sendKeys(number);
    // await this.driver.sleep(1000)
    // createBtn.click();
    await this.notificationCheck('id','mainErrorText');
    // console.log("all ok sa 2");
    await this.checkCreateItem('.list-name-wrapper', name)
  }

  async fillCreateProjectFieldsByCompanyAdmin(
    name,
    projectCode,
    number,
    street,
    app,
    state,
    city,
    zipcode,
    client,
    startdate,
    enddate,
  ) {
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"] .modal')),10000);
    const projectName = await this.driver.findElement(By.id('projectName'));
    await projectName.sendKeys(name);
    await this.driver.sleep(1000);
    const projectKey = await this.driver.findElement(By.id('projectCode'));
    // await projectKey.clear();
    // await projectKey.click();
    await projectKey.sendKeys(projectCode);
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementLocated(By.css('.field-wrapper #projectNumber[forminput="PROJECT_NUMBER"]')),10000);
    let projectNumber = await this.driver.findElement(By.css('#projectNumber[forminput="PROJECT_NUMBER"]'));
    await projectNumber.sendKeys(number);
    const addressStreet = await this.driver.findElement(
      By.id('projectAddress')
    );
  
    await addressStreet.click();
    await addressStreet.sendKeys(street);
    await this.driver.sleep(1000);
    const addressApart = await this.driver.findElement(
      By.id('projectAddressSecond')
    );
    await addressApart.click();
    await addressApart.sendKeys(app);

    const stateDropDown = await this.driver.findElement(
      By.id('projectSelectState')
    );
    await stateDropDown.click();
    const stateList = await this.driver.findElements(By.className('ng-option'));

    await this.findDateInDropDown(stateList, state);

    const cityDropDown = await this.driver.findElement(
      By.id('projectSelectCity')
    );
    await cityDropDown.click();
    const cityList = await this.driver.findElements(By.className('ng-option'));
    await this.findDateInDropDown(cityList, city);

    const projectZip = await this.driver.findElement(By.id('projectZipCode'));
    await projectZip.click();
    await projectZip.sendKeys(zipcode);

    const projectClientName = await this.driver.findElement(
      By.id('projectClientName')
    );
    await projectClientName.click();
    await projectClientName.sendKeys(client);
    const createBtn = await this.driver.findElement(By.id('btnSubmit'));

   
    await this.driver.sleep(1000)
    createBtn.click();
    // await this.driver.sleep(15000)
    // await projectNumber.clear();
    // await projectNumber.sendKeys(number);
    // await this.driver.sleep(1000)
    // createBtn.click();
   
    // console.log("all ok here");
    await this.notificationCheck('id','mainErrorText');
    // console.log("all ok here 2");
    await this.checkCreateItem('.list-name-wrapper', name)
  }

  // async chekCreationOfNewProject() {
  //   await this.notificationCheck('id','mainErrorText');
  //   this.endProjectsNumber = await this.numberOfItems(this.driver);

  //   // console.log(this.startProjectsNumber, this.endProjectsNumber);

  //   try {
  //     if (this.startProjectsNumber >= this.endProjectsNumber) {
  //       throw new Error('project didnt create');
  //     }

  //     return;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }
}

module.exports = CreateProject;
