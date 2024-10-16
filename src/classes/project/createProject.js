const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class CreateProject extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.startProjectsNumber = 0;
    this.endProjectsNumber = 0;
  }

  async goToCreateProjectForm(user = 'sa') {
    if (user === 'sa') {
      const projectBtnSa = await this.driver.findElement(By.id('linkProjects'));
      await projectBtnSa.click();
      this.startProjectsNumber = await this.numberOfItems(this.driver);
    }

    if (user !== 'sa') {
      await this.driver.wait(
        until.elementLocated(By.id('linkProjectsAdminOrEmployee')),
        10000
      );
      const projects = await this.driver.findElement(
        By.id('linkProjectsAdminOrEmployee')
      );
      await this.driver.wait(until.elementIsEnabled(projects), 10000);
      await projects.click();
      await this.driver.sleep(1000);
    }
    await this.driver.wait(until.elementLocated(By.id('btnCreate')), 10000);
    const creatProject = await this.driver.findElement(By.id('btnCreate'));
    await creatProject.click();
  }

  async fillCreateProjectFields(
    user = 'sa',
    name,
    key = null,
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
    save=true
  ) {
    await this.driver.wait(
      until.elementLocated(By.css('app-project-form .backdrop')),
      10000
    );
    const projectName = await this.driver.findElement(
      By.id('projectNameMobile')
    );
    await projectName.click();
    await projectName.sendKeys(name);
    await this.driver.sleep(1000);

    if (key !== null) {
      const projectKey = await this.driver.findElement(By.id('projectCode'));
      await projectKey.sendKeys(key);
      await this.driver.sleep(1000);
    }

    await this.driver.wait(
      until.elementLocated(By.id('projectNumberMobile')),
      10000
    );

    let projectNumber = await this.driver.findElement(
      By.id('projectNumberMobile')
    );

    await projectNumber.sendKeys(number);
    if (user === 'sa') {
      const companyProjectBelong = await this.driver.findElement(
        By.id('projectSelectCompanyMobile')
      );
      await companyProjectBelong.click();

      await this.driver.executeScript('return document.readyState');

      await this.waitListDate('.ng-option', 2);
      const companyList = await this.driver.findElements(
        By.className('ng-option')
      );

      await this.findDateInDropDown(companyList, company);
    }
    const addressStreet = await this.driver.findElement(
      By.id('projectAddressMobile')
    );

    await addressStreet.click();
    await addressStreet.sendKeys(street);

    const addressApart = await this.driver.findElement(
      By.id('projectAddressSecond')
    );
    if(app){
      await addressApart.click();
      await addressApart.sendKeys(app);
    }
    
    const stateDropDown = await this.driver.findElement(
      By.id('projectSelectStateMobile')
    );
    await stateDropDown.click();
    const stateList = await this.driver.findElements(By.className('ng-option'));

    await this.findDateInDropDown(stateList, state);

    const cityInput = await this.driver.findElement(
      By.id('projectCity')
    );
    await cityInput.sendKeys(city)

    const projectZip = await this.driver.findElement(
      By.id('projectZipCode')
    );
    await projectZip.click();
    await projectZip.sendKeys(zipcode);

    const projectClientName = await this.driver.findElement(
      By.id('projectClientNameMobile')
    );
    await projectClientName.click();
    await projectClientName.sendKeys(client);

    if(startdate){
     const startdateEl = await this.driver.findElement(By.id('projectStartDate'));
     await startdateEl.sendKeys(startdate);
    };

    if(enddate){
      const enddateEl = await this.driver.findElement(By.id('projectEndDate'));
      await enddateEl.sendKeys(startdate);
     };

    await projectNumber.clear();
    await projectNumber.sendKeys(number);
    await this.driver.sleep(1000);
    if(save){
    const createBtn = await this.driver.findElement(By.id('btnSubmitMobile'));

    await this.driver.sleep(1000);
    createBtn.click();
    await this.notificationCheck();
    await this.checkCreateItem('.list-name-wrapper', name);
    }
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
    enddate
  ) {
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementLocated(By.css('.backdrop .modal')),
      10000
    );
    const projectName = await this.driver.findElement(By.id('projectName'));
    await projectName.sendKeys(name);
    await this.driver.sleep(1000);
    const projectKey = await this.driver.findElement(By.id('projectCode'));
    await projectKey.sendKeys(projectCode);
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementLocated(
        By.css('.field-wrapper #projectNumber[forminput="PROJECT_NUMBER"]')
      ),
      10000
    );
    let projectNumber = await this.driver.findElement(
      By.css('#projectNumber[forminput="PROJECT_NUMBER"]')
    );
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

    await this.driver.sleep(1000);
    createBtn.click();
    await this.notificationCheck();
    await this.checkCreateItem('.list-name-wrapper', name);
  }


  async fillOptionalCreateProjectFields(
    app,
    startdate,
    enddate,
    save=false
  ) {
    await this.driver.wait(
      until.elementLocated(By.css('app-project-form .backdrop')),
      10000
    );
    if(app)
      {
        await this.driver.wait(until.elementLocated(By.id('projectAddressSecond')),10000);
        const addressApart = await this.driver.findElement(
          By.id('projectAddressSecond')
        );
        await addressApart.click();
        await addressApart.sendKeys(app);
      };
    
    if(startdate){
      await this.driver.sleep(500);
      const startdateEl = await this.driver.findElement(By.id('projectStartDate'));
      await startdateEl.sendKeys(startdate);
    };

    if(enddate){
      const enddateEl = await this.driver.findElement(By.id('projectEndDate'));
      await enddateEl.sendKeys(startdate);
     };

    if(save){
      const createBtn = await this.driver.findElement(By.id('btnSubmitMobile'));
      await this.driver.sleep(1000);
      createBtn.click();
    }
    
  }

}

module.exports = CreateProject;
