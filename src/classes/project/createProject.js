const { By, until } = require('selenium-webdriver');
const Base = require('../base');
const locatorsCommon = require('../../utils/locators/locatorsCommon');
const locatorProject = require('../../utils/locators/locatorsProject');

class CreateProject extends Base {

  static async findProjectInList(array, projectName) {
    let projectSearchName = '';

    for (let i = 0; i < array.length; i += 1) {
      projectSearchName = await array[i].getText();

      if (projectSearchName === projectName) {
        await array[i].click();
        return;
      }
    }

    throw new Error('No such project in the list of project');
  }

  async enableBrowserConsoleLogs() {
    await this.driver.manage().logs().get(logging.Type.BROWSER);
  }

  async getAndProcessBrowserConsoleLogs() {
    const logs = await this.driver.manage().logs().get(logging.Type.BROWSER);
    logs.forEach(entry => {
      console.log(`[${entry.level.value}] ${entry.message}`);
    });
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.startProjectsNumber = 0;
    this.endProjectsNumber = 0;
  }

  async goToCreateProjectForm(user = 'sa') {
    if (user === 'sa') {
      const projectBtnSa = await this.driver.findElement(locatorsCommon.baselinkProjects);
      await projectBtnSa.click();
      this.startProjectsNumber = await this.numberOfItems(this.driver);
    }

    if (user !== 'sa') {
      await this.driver.wait(
        until.elementLocated(locatorsCommon.baseProjectButtonAdminOrEmployee),
        10000
      );
      const projects = await this.driver.findElement(
        locatorsCommon.baseProjectButtonAdminOrEmployee
      );
      await this.driver.wait(until.elementIsEnabled(projects), 10000);
      await projects.click();
      await this.driver.sleep(1000);
    }
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBtnCreate), 10000);
    const creatProject = await this.driver.findElement(locatorsCommon.baseBtnCreate);
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
      until.elementLocated(locatorProject.projectFormBackdrop),
      10000
    );
    const projectName = await this.driver.findElement(
      locatorProject.projectNameMobileId
    );
    await projectName.click();
    await projectName.sendKeys(name);
    await this.driver.sleep(1000);

    if (key !== null) {
      const projectKey = await this.driver.findElement(locatorProject.projectCodeId);
      await projectKey.sendKeys(key);
      await this.driver.sleep(1000);
    }

    await this.driver.wait(
      until.elementLocated(locatorProject.projectNumberMobileId),
      10000
    );

    let projectNumber = await this.driver.findElement(
      locatorProject.projectNumberMobileId
    );

    await projectNumber.sendKeys(number);
    if (user === 'sa') {
      const companyProjectBelong = await this.driver.findElement(
        locatorProject.projectSelectCompanyMobileId
      );
      await companyProjectBelong.click();

      await this.driver.executeScript('return document.readyState');

      await this.waitListDate('.ng-option', 2);
      const companyList = await this.driver.findElements(
        locatorsCommon.baseDropdownOption
      );

      await this.findDateInDropDown(companyList, company);
    }
    const addressStreet = await this.driver.findElement(
      locatorProject.projectAddressMobileId
    );

    await addressStreet.click();
    await addressStreet.sendKeys(street);

    const addressApart = await this.driver.findElement(
      locatorProject.projectAddressSecondId
    );
    if(app){
      await addressApart.click();
      await addressApart.sendKeys(app);
    }
    
    const stateDropDown = await this.driver.findElement(
      locatorProject.projectSelectStateMobileId
    );
    await stateDropDown.click();
    const stateList = await this.driver.findElements(locatorsCommon.baseDropdownOption);

    await this.findDateInDropDown(stateList, state);

    const cityInput = await this.driver.findElement(
      locatorProject.projectCityId
    );
    await cityInput.sendKeys(city)

    const projectZip = await this.driver.findElement(
      locatorProject.projectZipCodeId
    );
    await projectZip.click();
    await projectZip.sendKeys(zipcode);

    const projectClientName = await this.driver.findElement(
      locatorProject.projectClientNameMobileId
    );
    await projectClientName.click();
    await projectClientName.sendKeys(client);

    if(startdate){
     const startdateEl = await this.driver.findElement(locatorProject.projectStartDateId);
     await startdateEl.sendKeys(startdate);
    };

    if(enddate){
      const enddateEl = await this.driver.findElement(locatorProject.projectEndDateId);
      await enddateEl.sendKeys(startdate);
     };

    await projectNumber.clear();
    await projectNumber.sendKeys(number);
    await this.driver.sleep(1000);
    if(save){
    const createBtn = await this.driver.findElement(locatorProject.projectSubmitButtonMobileId);

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
      until.elementLocated(locatorsCommon.baseBackdropAndModalCss),
      10000
    );
    const projectName = await this.driver.findElement(locatorProject.projectNameId);
    await projectName.sendKeys(name);
    await this.driver.sleep(1000);
    const projectKey = await this.driver.findElement(locatorProject.projectCodeId);
    await projectKey.sendKeys(projectCode);
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementLocated(
        locatorProject.projectNumber
      ),
      10000
    );
    let projectNumber = await this.driver.findElement(
      locatorProject.projectNumber
    );
    await projectNumber.sendKeys(number);
    const addressStreet = await this.driver.findElement(
      locatorProject.projectAddressId
    );

    await addressStreet.click();
    await addressStreet.sendKeys(street);
    await this.driver.sleep(1000);
    const addressApart = await this.driver.findElement(
      locatorProject.projectAddressSecondId
    );
    await addressApart.click();
    await addressApart.sendKeys(app);

    const stateDropDown = await this.driver.findElement(
      locatorProject.projectSelectStateId
    );
    await stateDropDown.click();
    const stateList = await this.driver.findElements(locatorsCommon.baseDropdownOption);

    await this.findDateInDropDown(stateList, state);

    const cityDropDown = await this.driver.findElement(
      locatorProject.projectSelectCityId
    );
    await cityDropDown.click();
    const cityList = await this.driver.findElements(locatorsCommon.baseDropdownOption);
    await this.findDateInDropDown(cityList, city);

    const projectZip = await this.driver.findElement(locatorProject.projectZipCodeId);
    await projectZip.click();
    await projectZip.sendKeys(zipcode);

    const projectClientName = await this.driver.findElement(locatorProject.projectClientNameMobileId )   
    await projectClientName.click();
    await projectClientName.sendKeys(client);
    const createBtn = await this.driver.findElement(locatorProject.projectSubmitButtonId);

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
      until.elementLocated(locatorProject.projectFormBackdrop),
      10000
    );
    if(app)
      {
        await this.driver.wait(until.elementLocated(locatorProject.projectAddressSecondId),10000);
        const addressApart = await this.driver.findElement(
          locatorProject.projectAddressSecondId
        );
        await addressApart.click();
        await addressApart.sendKeys(app);
      };
    
    if(startdate){
      await this.driver.sleep(500);
      const startdateEl = await this.driver.findElement(locatorProject.projectStartDateId);
      await startdateEl.sendKeys(startdate);
    };

    if(enddate){
      const enddateEl = await this.driver.findElement(locatorProject.projectEndDateId);
      await enddateEl.sendKeys(startdate);
     };

    if(save){
      const createBtn = await this.driver.findElement(locatorProject.projectSubmitButtonMobileId);
      await this.driver.sleep(1000);
      createBtn.click();
    }
    
  }

  async checkProjectsStatus(el){
    const statusEl = await el.findElement(locatorProject.projectStatusWrapper);
    const status = await statusEl.getAttribute('status');
    return Number(status)
 }

 async checkProjectsListHaveDoneProjects(){
     await this.driver.wait(until.elementsLocated(By.css('.table-projects__row')),10000);
     const listOfProject = await this.driver.findElements(By.css('.table-projects__row'));
     for (let proj of listOfProject){
        const status = await this.checkProjectsStatus(proj);
        if (status === 100 || status >100){
         const projectName = await proj.findElement(By.css('.project-name__wrapper .list-name-wrapper')).getAttribute('title')
         console.log(`List have project with Done status ${projectName}`);
         return true
        }
     }
     return false
 }

 async filterProject(user='sa', client, company=false){
     const filterFormBtn = await this.driver.findElement(
         locatorsCommon.baseFilterBtn
       );
   
       await this.driver.wait(until.elementIsEnabled(filterFormBtn), 10000);
       await filterFormBtn.click();
       await this.driver.wait(until.elementLocated(locatorsCommon.baseFilterForm),10000);
       const clientInput = await this.driver.findElement(locatorProject.projectFilterClientInput)
       await this.driver.wait(until.elementIsEnabled(clientInput));

       if(user==='sa'){
         if(company){
             const companyInput = await this.driver.findElement(locatorProject.projectFilterCompanyInput)
             await this.driver.wait(until.elementIsEnabled(companyInput));
             await companyInput.click();
             await this.driver.wait(
                 until.elementsLocated(locatorsCommon.baseDropdownOption),
                 10000
               );
               const companiesEl = await this.driver.findElements(
                 locatorsCommon.baseDropdownOption
               );
               await this.findDateInDropDown(companiesEl, company)
         }
     }
     await clientInput.click();
     await this.driver.wait(
         until.elementsLocated(locatorsCommon.baseDropdownOption),
         10000
       );
       const clientsEl = await this.driver.findElements(
         locatorsCommon.baseDropdownOption
       );
       await this.findDateInDropDown(clientsEl, client);
       await filterFormBtn.click();
 }

 async editProject (newProjectName){
  await this.driver.executeScript('return document.readyState');
  await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
  await this.driver.wait(until.elementLocated(locatorsCommon.baseSettingsWrapperBtnEdit),10000);
  const editBtn = await this.driver.findElement(locatorsCommon.baseSettingsWrapperBtnEdit);
  await this.driver.wait(until.elementIsEnabled(editBtn),10000);
  await editBtn.click();
  await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop),10000);
  const nameInput = await this.driver.findElement(locatorProject.projectNameMobileId);
  await nameInput.click();
  await this.driver.sleep(1000);
  await nameInput.clear();
  await this.driver.sleep(1000);
  await nameInput.sendKeys(newProjectName);
  const submitBtn = await this.driver.findElement(locatorProject.projectSubmitButtonMobileId);
  await submitBtn.click();
  await this.notificationCheck();
  console.log(`New Project name ${newProjectName}`);
  
}

async editProjectViaThreeDotsMenu(nameOld, newName){
  await this.driver.wait(until.elementsLocated(By.css('.table-projects__row .item-info-list')),10000);
  await this.findItemAndOpenThreeDotsMenu(nameOld,'.table-projects__row .item-info-list .company-name .list-name-wrapper');
  await this.driver.wait(until.elementLocated(locatorsCommon.baseDotMenuOpen),10000);
  const editBtn = await this.driver.findElement(locatorsCommon.baseDotsMenuEdit)
  await this.driver.wait(until.elementIsVisible(editBtn), 10000);
  await this.driver.wait(until.elementIsEnabled(editBtn), 10000);
  await editBtn.click();
  await this.driver.sleep(1000);
  await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop),10000);
  const nameInput = await this.driver.findElement(locatorProject.projectNameMobileId);
  await nameInput.click();
  await nameInput.clear();
  await this.driver.sleep(1000);
  await nameInput.sendKeys(newName);
  const submitBtn = await this.driver.findElement(locatorProject.projectSubmitButtonMobileId);
  await submitBtn.click();
  await this.notificationCheck();
  console.log(`New Project name ${newName}`);
}

async goToProjectList(user = 'sa') {
  if (user === 'sa') {
    const projectBtnSa = await this.driver.findElement(locatorsCommon.baselinkProjects);
    await projectBtnSa.click();
  } else {
    const projectBtn = await this.driver.findElement(
      locatorsCommon.baseProjectButtonAdminOrEmployee
    );
    await projectBtn.click();
  }

  await this.driver.executeScript('return document.readyState');
  const numberOfProject = this.numberOfItemsInTheList('.item-info-list');
  if (numberOfProject >= 20) {
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseAmountItems),
      10000
    );

    const paginationDropDown = await this.driver.findElement(
      locatorsCommon.baseAmountItems
    );
    await paginationDropDown.click();
    const paginationList = await this.driver.findElements(
      locatorsCommon.baseDropdownOption
    );
    await this.findDateInDropDown(paginationList, '100');
    await this.waitListDate('.company-name', 11);
  }
}

async findProject(project, page) {
  await this.driver.wait(until.urlIs(page), 10000);
  await this.driver.wait(
    until.elementsLocated(locatorsCommon.baseCompanyItem),
    10000
  );
  await this.waitListDate('.company-name',3);
  const allProjects = await this.driver.findElements(
    locatorsCommon.baseCompanyItem
  );

  if (allProjects) {
    await CreateProject.findProjectInList(allProjects, project);
    await this.driver.wait(until.elementLocated(locatorsCommon.baseSettingsTabId), 10000);
    await this.driver.findElement(locatorsCommon.baseSettingsTabId).click();
  }
}

async removefindProject(projectName) {
  await this.driver.executeScript('return document.readyState');
  await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);

  await this.driver.wait(
    until.elementLocated(locatorProject.projectBtnDeleteProjectOpenModalId, 10000)
  );
  const delBtnProject = await this.driver.findElements(
    locatorProject.projectBtnDeleteProjectOpenModalId
  );
  await delBtnProject[0].click();

  const modal = this.driver.findElement(locatorsCommon.baseModalNarrow);
  await this.driver.wait(until.elementIsEnabled(modal), 10000);

  const delBtnModalProject = await this.driver.findElement(
    locatorProject.projectBtnDeleteProjectId
  );
  await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
  await this.driver.executeScript('return document.readyState');
  await this.driver.sleep(1000);

  await this.driver.wait(until.elementIsEnabled(delBtnModalProject), 10000);

  await delBtnModalProject.click();

  await this.driver.wait(
    until.elementLocated(locatorsCommon.baseNotificationClass),
    10000
  );
  const windowHandles = await this.driver.findElement(
    locatorsCommon.baseNotificationClass
  );
  const windowHandlesText = await windowHandles.getText();

  if (windowHandlesText === 'Error. Failed to save data') {
    throw new Error('You have error, check screenshot');
  }

  try {
    await this.driver.wait(
      until.elementsLocated(locatorsCommon.baseCompanyItem),
      3000
    );
    const allProjectsAfterDel = await this.driver.findElements(
      locatorsCommon.baseCompanyItem
    );

    const isCompanyRemoved = allProjectsAfterDel.every(async i => {
      (await i.getText()) !== projectName;
    });
    console.log(isCompanyRemoved);

    if (isCompanyRemoved) {
      return;
    } else {
      throw new Error('Company did not remove');
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

async removeProjectViaThreeDotsMenu(nameOfProject) {
  await this.driver.wait(
    until.elementsLocated(By.css('.table-projects__row .item-info-list')),
    10000
  );
  await this.findItemAndOpenThreeDotsMenu(
    nameOfProject,
    '.table-projects__row .item-info-list .company-name .list-name-wrapper'
  );
  await this.driver.wait(
    until.elementLocated(locatorsCommon.baseDotMenuOpen),
    10000
  );
  const deleteBtn = await this.driver.findElement(
    locatorsCommon.baseDotMenuDeleteBtn
  );
  await this.driver.wait(until.elementIsVisible(deleteBtn), 10000);
  await this.driver.wait(until.elementIsEnabled(deleteBtn), 10000);
  await deleteBtn.click();
  await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);
  await this.driver.wait(until.elementLocated(locatorsCommon.baseModalNarrow), 10000);
  const modal = this.driver.findElement(locatorsCommon.baseModalNarrow);
  await this.driver.wait(until.elementIsEnabled(modal), 10000);
  const delBtnModalProject = await this.driver.findElement(
    locatorProject.projectBtnDeleteProjectId
  );
  await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
  await this.driver.executeScript('return document.readyState');
  // await this.driver.sleep(1000);
  await this.driver.wait(until.elementIsEnabled(delBtnModalProject), 10000);

  await delBtnModalProject.click();
  await this.notificationCheck();
  await this.checkDeleteItem('.company-name', nameOfProject);
}

}

module.exports = CreateProject;
