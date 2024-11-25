const { until, By } = require('selenium-webdriver');
const Base = require('../base');
const { nanoid } = require('nanoid');
const locatorsCompany = require('../../utils/locators/locatorsCompany'); 
const locatorsCommon = require('../../utils/locators/locatorsCommon'); 

class CreateCompany extends Base {

  static async findCompanyInList(allCompanies, company) {
    for (const el of allCompanies) {
      const text = await el.getText();
      if (text.trim() === company) {
        await el.click();
        return;
      }
    }
    throw new Error('Company not found');
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.companyName = '';
    this.endCompanyNumber = 0;
    this.startCompanyNumber = 0;
  }

  async goToCompanyList() {
    const companyBtn = await this.driver.findElement(locatorsCompany.linkCompanies);
    await companyBtn.click();
    
    await this.driver.executeScript('return document.readyState');

    const noPagination = await this.driver.wait(
      until.elementLocated(locatorsCommon.baseAmountItems),
      3000
    ).catch(() => null);
    
    if (noPagination !== null) {
      await this.driver.wait(
        until.elementLocated(locatorsCommon.baseAmountItems),
        10000
      );

      const paginationDropDown = await this.driver.findElement(locatorsCommon.baseAmountItems);
      await this.driver.actions().scroll(0, 0, 0, 0, paginationDropDown).perform();

      const totalEl = await this.driver.findElement(locatorsCommon.baseSelectPaginationText).getText();
      const numberEl = totalEl.split(' ');
      const numberOfCompanies = Number(numberEl[numberEl.length - 1]);

      if (numberOfCompanies > 20) {
        await paginationDropDown.click();
        const paginationList = await this.driver.findElements(locatorsCommon.baseDropdownOption);
        await this.findDateInDropDown(paginationList, '100');
        await this.waitListDate('.company-name', 11);
      }
    }
  }


  async goToCreateCompanyForm() {
    const companyBtn = await this.driver.findElement(locatorsCompany.linkCompanies);
    await companyBtn.click();

    this.startCompanyNumber = await this.numberOfItems(this.driver);

    const createCompanyBtn = await this.driver.findElement(locatorsCommon.baseBtnCreate);
    await createCompanyBtn.click();
  }


  async fillCompanyForm(
    name,
    street,
    app,
    state,
    city,
    zipcode,
    phone,
    email,
    plan,
    type,
    subdomain = 'test' + nanoid(2)
  ) {
    const createForm = await this.driver.findElement(locatorsCommon.baseModal);
    await this.driver.wait(until.elementIsEnabled(createForm), 10000);

    const companyName = await this.driver.findElement(locatorsCompany.companyNameMobile);
    await companyName.sendKeys(name);
    await this.driver.sleep(500);

    const addressStreet = await this.driver.findElement(locatorsCompany.companyAddressMobile);
    await addressStreet.sendKeys(street);

    if (app) {
      const addressApart = await this.driver.findElement(locatorsCompany.companyAddressSecond);
      await this.driver.sleep(500);
      await addressApart.sendKeys(app);
    }

    const stateDropdown = await this.driver.findElement(locatorsCompany.companyState);
    await stateDropdown.click();
    const stateList = await this.driver.findElements(locatorsCommon.baseDropdownOption);
    await this.findDateInDropDown(stateList, state);

    const cityInput = await this.driver.findElement(locatorsCompany.companyCity);
    await cityInput.sendKeys(city);

    const companyZip = await this.driver.findElement(locatorsCompany.companyZipCode);
    await companyZip.sendKeys(zipcode);

    const companyPhone = await this.driver.findElement(locatorsCompany.companyPhone);
    await companyPhone.sendKeys(phone);

    const companyEmail = await this.driver.findElement(locatorsCompany.companyEmail);
    await companyEmail.sendKeys(email);

    const companyPlan = await this.driver.findElement(locatorsCompany.companyPlan);
    await companyPlan.click();
    await this.driver.sleep(1000);

    const subdomainName = await this.driver.findElement(locatorsCompany.subdomainName);
    await subdomainName.sendKeys(subdomain);

    const planList = await this.driver.findElements(locatorsCommon.baseDropdownOption);
    await this.findDateInDropDown(planList, plan);

    const typeDropDown = await this.driver.findElement(locatorsCompany.companyType);
    await typeDropDown.click();
    await this.driver.sleep(1000);
    const typeList = await this.driver.findElements(locatorsCommon.baseDropdownOption);
    await this.findDateInDropDown(typeList, type);
  }

  async fillCreateCompany(
    name,
    street,
    app,
    state,
    city,
    zipcode,
    phone,
    email,
    plan,
    type
  ) {
    await this.fillCompanyForm(
      name,
      street,
      app,
      state,
      city,
      zipcode,
      phone,
      email,
      plan,
      type
    );
    const createBtn = await this.driver.findElement(locatorsCommon.baseSubmitBtnCss);
    await createBtn.click();
  }


  async fillCreateCompanyWithCustomUserNumber(
    name,
    street,
    app,
    state,
    city,
    zipcode,
    phone,
    email,
    plan,
    type,
    usersNumber = 1,
    save = true
  ) {
    await this.fillCompanyForm(
      name,
      street,
      app,
      state,
      city,
      zipcode,
      phone,
      email,
      plan,
      type
    );
    
    const userNumberInput = await this.driver.findElement(locatorsCompany.companyPlanMaxNumberUsers);
    await userNumberInput.clear();
    await this.driver.sleep(500);
    
    if (usersNumber >= 0) {
      console.log('number');
      await userNumberInput.sendKeys(usersNumber);
      const createBtn = await this.driver.findElement(locatorsCommon.baseSubmitBtnCss);
      if (save) {
        await createBtn.click();
      }
    } else {
      console.log('null');
      await userNumberInput.sendKeys('A');
      const createBtn = await this.driver.findElement(locatorsCommon.baseSubmitBtnCss);
      if (save) {
        await createBtn.click();
        await userNumberInput.clear();
        await this.driver.sleep(1000);
      }
    }
  }

 
  async checkCreationOfNewCompany() {
    await this.notificationCheck();

    this.endCompanyNumber = await this.numberOfItems(this.driver);
    try {
      console.log(
        'number of companies before',
        this.startCompanyNumber,
        'after',
        this.endCompanyNumber,
        'company created successfully'
      );

      if (this.startCompanyNumber >= this.endCompanyNumber) {
        throw new Error('Company did not create');
      }

      return;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async checkCompanyPlane(plane, users = 100) {
    await this.driver.executeScript('return document.readyState');

    await this.driver.wait(
      until.elementLocated(locatorsCompany.linkCompanySettings),
      10000
    );
    const companyBtn = await this.driver.findElement(
      locatorsCompany.linkCompanySettings
    );
    await companyBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseTableDetailsWrapper),
      10000
    );
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseTableDetailsTitle),
      10000
    );
    const tableDetaile = await this.driver.findElement(
      locatorsCommon.baseTableDetailsWrapper
    );
    const tableDate = await tableDetaile.findElements(
      locatorsCommon.baseTableDetailsTitle
    );
    let planeOfCompany;
    let peopleInPlane;
    for (let cell of tableDate) {
      let cellName = await cell.getText();
      if (cellName === 'Plan') {
        let parentElement = await cell.findElement(By.xpath('..'));
        let nextCell = await parentElement.findElement(
          locatorsCommon.baseTableDetailsInfo
        );
        console.log(await nextCell.getText());
        planeOfCompany = await nextCell.getText();
      }
      if (cellName === 'Users') {
        let parentElement = await cell.findElement(By.xpath('..'));
        let nextCell = await parentElement.findElement(
          locatorsCommon.baseTableDetailsInfo
        );
        console.log(await nextCell.getText());
        const usersNumber = await nextCell.getText();
        const usersNumberArray = await usersNumber.split('/');
        peopleInPlane = await usersNumberArray[usersNumberArray.length - 1];
      }
    }
    if (plane === planeOfCompany && users === Number(peopleInPlane)) {
      console.log(
        `test passed, company plane is ${planeOfCompany} with ${peopleInPlane} users`
      );
    } else {
      throw new Error(
        `Check screenshot, here your plane: ${planeOfCompany} and number of users ${peopleInPlane}`
      );
    }
  }


  async filterCompany(type = true, state = false) {
    const filterFormBtn = await this.driver.findElement(locatorsCommon.baseFilterBtn);

    await this.driver.wait(until.elementIsEnabled(filterFormBtn), 10000);
    await filterFormBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseFilterForm),
      10000
    );
    
    if (type) {
      const typeInput = await this.driver.findElement(
        locatorsCompany.companyFilterTypeElement
      );
      await this.driver.wait(until.elementIsEnabled(typeInput));
      await typeInput.click();
      await this.driver.wait(
        until.elementsLocated(locatorsCommon.baseDropdownOption),
        10000
      );
      const typeEl = await this.driver.findElements(locatorsCommon.baseDropdownOption);
      await this.findDateInDropDown(typeEl, type);
    }
    
    if (state) {
      const stateInput = await this.driver.findElement(
       locatorsCompany.companyFilterStateElevent
      );
      await this.driver.wait(until.elementIsEnabled(stateInput));
      await stateInput.click();
      await this.driver.wait(
        until.elementsLocated(locatorsCommon.baseDropdownOption),
        10000
      );
      const stateEl = await this.driver.findElements(locatorsCommon.baseDropdownOption);
      await this.findDateInDropDown(stateEl, state);
    }
    
    await filterFormBtn.click();
  }

 
  async findCompany(company, page) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.urlIs(page), 10000);

    const allCompanies = await this.driver.findElements(locatorsCommon.baseCompanyItem);
    await this.driver.wait(
      until.elementsLocated(locatorsCommon.baseCompanyItem),
      10000
    );

    if (allCompanies) {
      await CreateCompany.findCompanyInList(allCompanies, company);
    }
  }

  async removefindCompany(companyName) {
    await this.driver.executeScript('return document.readyState');

    await this.driver.wait(
      until.elementLocated(locatorsCompany.linkCompanySettings),
      10000
    );
    const companyBtn = await this.driver.findElement(
      locatorsCompany.linkCompanySettings
    );

    await companyBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorsCompany.companyDeleteBtn)
    );
    const delBtn = await this.driver.findElements(
      locatorsCompany.companyDeleteBtn
    );

    await delBtn[0].click();

    const modal = this.driver.findElement(locatorsCommon.baseModalNarrow);
    await this.driver.wait(until.elementIsEnabled(modal), 10000);
    await this.driver.sleep(500);

    const delBtnModal = await this.driver.findElement(locatorsCommon.baseBtnDelete);
    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.wait(until.elementIsEnabled(delBtnModal), 10000);
    await delBtnModal.click();

    await this.notificationCheck()

    try {
      await this.driver.wait(
        until.elementsLocated(locatorsCommon.baseCompanyItem),
        3000
      );
      const allCompaniesAfterDel = await this.driver.findElements(
        locatorsCommon.baseCompanyItem
      );

      const isCompanyRemoved = allCompaniesAfterDel.every(
        async i => (await i.getText()) !== companyName
      );

      if (isCompanyRemoved) {
        return;
      } else {
        throw new Error('Company did not remove');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }


  async removeCompanyViaThreeDotsMenu(companyName) {
    await this.driver.wait(until.elementsLocated(locatorsCommon.baseTitleTableText),10000);
    await this.driver.sleep(1000);
    await this.findItemAndOpenThreeDotsMenu(companyName,'.company-name .ellipsis-text');
    await this.driver.wait(until.elementLocated(locatorsCommon.baseDotMenuOpen),10000);
    const deleteBtn = await this.driver.findElement(locatorsCommon.baseDotMenuDeleteBtn)
    await this.driver.wait(until.elementIsVisible(deleteBtn), 10000);
    await this.driver.wait(until.elementIsEnabled(deleteBtn), 10000);
    await deleteBtn.click();
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop),10000);
    await this.driver.wait(until.elementLocated(locatorsCommon.baseModalNarrow),10000);
    const modal = this.driver.findElement(locatorsCommon.baseModalNarrow);
    await this.driver.wait(until.elementIsEnabled(modal), 10000);
    const delCompanyBtn = await this.driver.findElement(locatorsCommon.baseBtnDelete);
    await this.driver.wait(until.elementIsEnabled(delCompanyBtn), 10000);
    await delCompanyBtn.click();
    await this.notificationCheck();
    await this.checkDeleteItem('.company-name', companyName);
  }

 
  async editCompany(newName = true, email = false, type = false) {
    await this.driver.executeScript('return document.readyState');

    await this.driver.wait(
      until.elementLocated(locatorsCompany.linkCompanySettings),
      10000
    );
    const companyBtn = await this.driver.findElement(
      locatorsCompany.linkCompanySettings
    );
    await companyBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseSettingsWrapperBtnEdit),
      10000
    );
    const editBtn = this.driver.findElement(
      locatorsCommon.baseSettingsWrapperBtnEdit
    );
    await this.driver.wait(until.elementIsEnabled(editBtn), 10000);
    await editBtn.click();
    await this.driver.wait(
      until.elementLocated(By.css('app-company-form .backdrop')),
      10000
    );
    if (newName) {
      const nameInput = await this.driver.findElement(
        locatorsCompany.companyNameMobile
      );
      await nameInput.clear();
      await nameInput.sendKeys(newName);
    }
    if (email) {
      const emailInput = await this.driver.findElement(locatorsCompany.companyEmail);
      await emailInput.clear();
      await this.driver.sleep(500);
      await emailInput.sendKeys(email);
    }
    if (type) {
      const typeDropDown = await this.driver.findElement(locatorsCompany.companyType);
      await typeDropDown.click();
      await this.driver.sleep(1000);
      const typeList = await this.driver.findElements(
        locatorsCommon.baseDropdownOption
      );
      await this.findDateInDropDown(typeList, type);
    }

    const submitBtn = await this.driver.findElement(locatorsCommon.baseSubmitBtnCss);
    await submitBtn.click();
    await this.notificationCheck();
    console.log(`New Company name ${newName}`);
  }
 
  async editCompanyPlan(planeName, customs = 100) {
    await this.driver.executeScript('return document.readyState');

    await this.driver.wait(
      until.elementLocated(locatorsCompany.linkCompanySettings),
      10000
    );
    const companyBtn = await this.driver.findElement(
      locatorsCompany.linkCompanySettings
    );
    await companyBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseSettingsWrapperBtnEdit),
      10000
    );
    const editBtn = this.driver.findElement(
      locatorsCommon.baseSettingsWrapperBtnEdit
    );
    await this.driver.wait(until.elementIsEnabled(editBtn), 10000);
    await editBtn.click();
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);
    const companyPlan = await this.driver.findElement(locatorsCompany.companyPlan);
    await companyPlan.click();
    await this.driver.wait(
      until.elementLocated(By.css('.ng-dropdown-panel-items')),
      10000
    );
    const planList = await this.driver.findElements(locatorsCommon.baseDropdownOption);

    if (planeName === 'Custom') {
      await this.findDateInDropDown(planList, planeName);
      await this.driver.wait(
        until.elementLocated(locatorsCompany.companyPlanMaxNumberUsers)
      );
      const numberOfUser = await this.driver.findElement(
        locatorsCompany.companyPlanMaxNumberUsers
      );
      await numberOfUser.clear();
      await numberOfUser.sendKeys(customs);
    } else {
      await this.findDateInDropDown(planList, planeName);
    }
    const submitBtn = await this.driver.findElement(locatorsCommon.baseSubmitBtnCss);
    await submitBtn.click();
    await this.notificationCheck();
  }

}

module.exports = CreateCompany;
