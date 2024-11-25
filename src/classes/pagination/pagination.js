const { By, until } = require('selenium-webdriver');
const Base = require('../base');
const locatorsCommon = require('../../utils/locators/locatorsCommon');
const locatorPagination = require('../../utils/locators/locatorPagination'); 

class Pagination extends Base {

  async waitListAndCheckPagination(firstElName) {
    let waitTime = 0;
    let companiesList = [];

    do {
      await this.waitListDate('.project-name__wrapper', 2);
      companiesList = await this.driver.findElements(locatorsCommon.baseProjectNameWrapper);

      if ((await companiesList[0].getText()) === firstElName) {
        await this.driver.sleep(1000);
        waitTime += 1;
      } else {
        break;
      }
    } while (waitTime < 5);

    return companiesList;
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.startEntiteNumber = 0;
  }

  async goToProjectsPage() {
    const projectsBtn = await this.driver.findElement(locatorsCommon.baselinkProjects);
    await projectsBtn.click();

    this.startEntiteNumber = await this.numberOfItems(this.driver);
    console.log(this.startEntiteNumber);

    if (this.startEntiteNumber <= 10) {
      throw new Error('Lack of Entities for Pagination');
    }
  }

  async executionOfPagination() {
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseCompanyItem),
      10000
    );
    const startElNumber = await this.driver.findElements(
      locatorsCommon.baseCompanyItem
    );
    const firstElName = await startElNumber[0].getText();
    console.log(firstElName, 'first');

    const paginationDropDown = await this.driver.findElements(
      locatorPagination.paginationListItem
    );
    await this.driver
      .actions()
      .scroll(0, 0, 0, 0, paginationDropDown[0])
      .perform();
    await paginationDropDown[1].click();
    await this.waitListAndCheckPagination(firstElName);
  }

  async executionOfArrowPagination() {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseCompanyItem));
    const startElNumber = await this.driver.findElements(
      locatorsCommon.baseCompanyItem
    );
    const firstElName = await startElNumber[0].getText();

    const paginationArrow = await this.driver.findElement(locatorPagination.paginationBtnNextPageId);
    const paginationDropDown = await this.driver.findElements(
      locatorsCommon.baseCompanyItem
    );
    await this.driver.actions().scroll(0, 0, 0, 0, paginationArrow).perform();
    await paginationArrow.click();
    this.waitListAndCheckPagination(firstElName)
  }

  async executionOfMenuPagination(numberofel) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseCompanyItem));
    const startElNumber = await this.driver.findElements(
      locatorsCommon.baseCompanyItem
    );

    const paginationDropDown = await this.driver.findElement(
      locatorPagination.paginationSelectAmountItemsId
    );
    await this.driver
      .actions()
      .scroll(0, 0, 0, 0, paginationDropDown)
      .perform();
    await paginationDropDown.click();

    const paginationList = await this.driver.findElements(
      locatorsCommon.baseDropdownOption
    );
    await this.findDateInDropDown(paginationList, numberofel);
    await this.waitListDate('.company-name', numberofel);

    const endElNumber = await this.driver.findElements(
      locatorsCommon.baseCompanyItem
    );

    if (
      (await endElNumber.length) > (await startElNumber.length) &&
      (await endElNumber.length) <= numberofel
    ) {
      console.log('pagination by number per page work');
      return;
    } else {
      throw new Error('Pagination not work');
    }
  }
}

module.exports = Pagination;
