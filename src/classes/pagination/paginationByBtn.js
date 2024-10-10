const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class PaginationByButton extends Base {
  static async waitNewListDate(driver, name, selector) {
    let element = name;
    let count = 0;

    while (name === element && count < 10) {
      const list = await driver.findElements(By.css(selector));
      const firstElement = await list[0];
      element = await firstElement?.getText();
      if (element === name || element === undefined) {
        await driver.sleep(1000);
        count += 1;
      }
    }
  }

  async waitListAndCheckPagination(firstElName) {
    let waitTime = 0;
    let companiesList = [];

    do {
      await this.waitListDate('.project-name__wrapper', 20);
      companiesList = await this.driver.findElements(By.className('project-name__wrapper'));

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
    const projectsBtn = await this.driver.findElement(By.id('linkProjects'));
    await projectsBtn.click();

    this.startEntiteNumber = await this.numberOfItems(this.driver);
    console.log(this.startEntiteNumber);

    if (this.startEntiteNumber <= 10) {
      throw new Error('Lack of Entities for Pagination');
    }
  }

  async executionOfPagination() {
    await this.driver.wait(
      until.elementLocated(By.className('company-name')),
      10000
    );
    const startElNumber = await this.driver.findElements(
      By.className('company-name')
    );
    const firstElName = await startElNumber[0].getText();
    console.log(firstElName, 'first');

    const paginationDropDown = await this.driver.findElements(
      By.css('.pagination-list__item:not(.hidden)')
    );
    await this.driver
      .actions()
      .scroll(0, 0, 0, 0, paginationDropDown[0])
      .perform();
    await paginationDropDown[1].click();
    await this.waitListAndCheckPagination(firstElName);
   
  }
}

module.exports = PaginationByButton;
