const { By, until } = require('selenium-webdriver');
const Base = require('../base');
const { nanoid } = require('nanoid');

class CreateCompany extends Base {
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
    const createForm = this.driver.findElement(By.className('modal'));
    await this.driver.wait(until.elementIsEnabled(createForm), 10000);

    const companyName = await this.driver.findElement(
      By.id('companyNameMobile')
    );
    await companyName.sendKeys(name);
    await this.driver.sleep(500);

    const addressStreet = await this.driver.findElement(
      By.id('companyAddressMobile')
    );
    await addressStreet.sendKeys(street);

    if (app) {
      const addressApart = await this.driver.findElement(
        By.id('companyAddressSecond')
      );
      await this.driver.sleep(500);
      await addressApart.sendKeys(app);
    }

    const stateDropdown = await this.driver.findElement(By.id('companyState'));
    await stateDropdown.click();
    const stateList = await this.driver.findElements(By.className('ng-option'));
    await this.findDateInDropDown(stateList, state);

    const cityInput = await this.driver.findElement(By.id('companyCity'));
    await cityInput.sendKeys(city);

    const companyZip = await this.driver.findElement(By.id('companyZipCode'));
    await companyZip.sendKeys(zipcode);

    const companyPhone = await this.driver.findElement(By.id('companyPhone'));
    await companyPhone.sendKeys(phone);

    const companyEmail = await this.driver.findElement(By.id('companyEmail'));
    await companyEmail.sendKeys(email);

    const companyPlan = await this.driver.findElement(By.id('companyPlan'));
    await companyPlan.click();
    await this.driver.sleep(1000);

    const subdomainName = await this.driver.findElement(By.id('subdomainName'));
    await subdomainName.sendKeys(subdomain);

    const planList = await this.driver.findElements(By.className('ng-option'));
    await this.findDateInDropDown(planList, plan);

    const typeDropDown = await this.driver.findElement(By.id('companyType'));
    await typeDropDown.click();
    await this.driver.sleep(1000);
    const typeList = await this.driver.findElements(By.className('ng-option'));
    await this.findDateInDropDown(typeList, type);
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.companyName = '';
    this.endCompanyNumber = 0;
    this.startCompanyNumber = 0;
  }

  async goToCreateCompanyForm() {
    const companyBtn = await this.driver.findElement(By.id('linkCompanies'));
    await companyBtn.click();

    // this.startCompanyNumber = await CreateCompany.numberOfCompanies(this.driver);
    this.startCompanyNumber = await this.numberOfItems(this.driver);

    const createCompanyBtn = await this.driver.findElement(By.id('btnCreate'));
    await createCompanyBtn.click();
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
    const createBtn = await this.driver.findElement(By.id('btnSubmit'));
    createBtn.click();
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
    const userNumberInput = await this.driver.findElement(
      By.id('companyPlanMaxNumberUsers')
    );
    await userNumberInput.clear();
    await this.driver.sleep(500);
    if (usersNumber >= 0) {
      console.log('number');
      await userNumberInput.sendKeys(usersNumber);
      const createBtn = await this.driver.findElement(By.id('btnSubmit'));
      if (save) {
        createBtn.click();
      }
    } else {
      console.log('null');
      await userNumberInput.sendKeys('A');
      const createBtn = await this.driver.findElement(By.id('btnSubmit'));
      if (save) {
        createBtn.click();
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
        throw new Error('company didnt create');
      }

      return;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async filterCompany(type = true, state = false) {
    const filterFormBtn = await this.driver.findElement(
      By.className('filters-btn')
    );

    await this.driver.wait(until.elementIsEnabled(filterFormBtn), 10000);
    await filterFormBtn.click();
    await this.driver.wait(
      until.elementLocated(By.className('filters-form')),
      10000
    );
    if (type) {
      const typeInput = await this.driver.findElement(
        By.css(".filter-field-wrapper [placeholder='Add Type']")
      );
      await this.driver.wait(until.elementIsEnabled(typeInput));
      await typeInput.click();
      await this.driver.wait(
        until.elementsLocated(By.className('ng-option')),
        10000
      );
      const typeEl = await this.driver.findElements(
        By.className('ng-option')
      );
      await this.findDateInDropDown(typeEl, type);
    }
    if (state) {
      const stateInput = await this.driver.findElement(
        By.css(".filter-field-wrapper [placeholder='Add State']")
      );
      await this.driver.wait(until.elementIsEnabled(stateInput));
      await stateInput.click();
      await this.driver.wait(
        until.elementsLocated(By.className('ng-option')),
        10000
      );
      const stateEl = await this.driver.findElements(
        By.className('ng-option')
      );
      await this.findDateInDropDown(stateEl, state);
    }
    await filterFormBtn.click();
  }
}

module.exports = CreateCompany;
