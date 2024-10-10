const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class DashBoardPart extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async clickOnFirstElInTableViaId(table = 'pj', id = true, link = false) {
    let compTable;
    let firstTableElId;
    let firstTableLink;
    let item;
    if (table === 'cm') {
      await this.driver.wait(
        until.elementLocated(By.css('app-dashboard-companies-table')),
        10000
      );
      compTable = await this.driver.wait(
        until.elementLocated(
          By.css('app-dashboard-companies-table .table-companies__row')
        ),
        10000
      );

      firstTableElId = await compTable.findElement(
        By.css('.table-companies__row .company-id')
      );
      firstTableLink = await compTable.findElement(
        By.css('.table-companies__row .company-name')
      );
      item = await firstTableLink.findElement(By.css('span')).getText();
    } else if (table === 'pj') {
      await this.driver.wait(
        until.elementLocated(By.css('app-dashboard-projects-table')),
        10000
      );
      compTable = await this.driver.wait(
        until.elementLocated(
          By.css('app-dashboard-projects-table .table-projects__row')
        ),
        10000
      );
      firstTableElId = await compTable.findElement(
        By.css('.table-projects__row .company-id')
      );
      firstTableLink = await compTable.findElement(
        By.css('.table-projects__row .company-name')
      );
      item = await firstTableLink.findElement(By.css('span')).getText();
    } else {
      await this.driver.wait(
        until.elementLocated(By.css('app-dashboard-tasks-table')),
        10000
      );
      compTable = await this.driver.wait(
        until.elementLocated(
          By.css('app-dashboard-tasks-table .table-tasks__row')
        ),
        10000
      );
      firstTableElId = await compTable.findElement(
        By.css('.table-tasks__row .task-id')
      );
      firstTableLink = await compTable.findElement(
        By.css('.table-tasks__row .task-name')
      );
      item = await firstTableLink.findElement(By.css('span')).getText();
    }
    if (id) {
      await firstTableElId.click();
    } else {
      await firstTableLink.click();
    }
    return item;
  }

  async endlessScrollDBTables(locator, number, table = 'cm') {
    await this.scrollTableToEnd(locator);
    let tableElements;
    switch (table) {
      case 'cm':
        await this.driver.wait(
          until.elementLocated(By.css('.table-companies__row')),
          10000
        );
        tableElements = await this.driver.findElements(
          By.css('.table-companies__row')
        );
        console.log(await tableElements.length, 'len');
        break;
      case 'pj':
        await this.driver.wait(
          until.elementLocated(By.css('.table-projects__row')),
          10000
        );
        tableElements = await this.driver.findElements(
          By.css('.table-projects__row')
        );
        console.log(await tableElements.length, 'len');
        break;
      case 'ts':
        await this.driver.wait(
          until.elementLocated(By.css('.table-tasks__row')),
          10000
        );
        tableElements = await this.driver.findElements(
          By.css('.table-tasks__row')
        );
        console.log(await tableElements.length, 'len');
        break;
      default:
        throw new Error('check screenshot here');
    }

    if ((await tableElements.length) === number ) {
      console.log(
        `test passed, infinite scrolling works in your table number of entities ${number}`
      );
    } else {
      throw new Error('test failed, check screenshot');
    }
  }

  async numberOfElementsOnDashboardTable(el = 'pj') {
    let elementForSearch;
    let number;
    switch (el) {
      case 'cm':
        elementForSearch = 'Companies';
        await this.waitListDate('.table-companies__row', 2);
        break;
      case 'pj':
        elementForSearch = 'Projects';
        await this.waitListDate('.table-projects__row', 2);
        break;
      case 'ts':
        elementForSearch = 'Tasks';
        await this.waitListDate('.table-tasks__row', 2);
        break;
      default:
        throw new Error('Not such table');
    }
    const tables = await this.driver.wait(
      until.elementsLocated(By.css('.total-statistic')),
      10000
    );
    for (let el of tables) {
      const tableTitle = await el.getText();
      if (tableTitle.includes(elementForSearch)) {
        const numberEl = await el.findElement(
          By.css('.total-statistic-amount')
        );
        number = await numberEl.getText();

        return Number(number);
      }
    }
    throw new Error('Not such table');
  }

  async checkRedirectByClickOnCompanyPageViaLinkOrId(id = false, table = 'pj') {
    let itemName;
    const oldUrl = await this.driver.getCurrentUrl();

    if (table === 'cm') {
      id
        ? (itemName = await this.clickOnFirstElInTableViaId(table, true, false))
        : (itemName = await this.clickOnFirstElInTableViaId(
            table,
            false,
            true
          ));
      await this.driver.wait(async () => {
        const newUrl = await this.driver.getCurrentUrl();
        console.log(newUrl, oldUrl);
        return newUrl !== oldUrl;
      }, 10000);
      await this.driver.wait(
        until.elementLocated(By.css('app-companies')),
        10000
      );
      const companyEl = await this.driver.wait(
        until.elementLocated(By.css('.company-name.company-name-sidebar')),
        10000
      );
      await this.driver.sleep(500);
      const companyTitle = await companyEl.getText();

      if (companyTitle.trim() === itemName.trim()) {
        console.log('test passed successful');
        return;
      }
    }
    if (table === 'pj') {
      id
        ? (itemName = await this.clickOnFirstElInTableViaId('pj', true, false))
        : (itemName = await this.clickOnFirstElInTableViaId('pj', false, true));
      await this.driver.wait(async () => {
        const newUrl = await this.driver.getCurrentUrl();
        return newUrl !== oldUrl;
      }, 10000);
      await this.driver.wait(
        until.elementLocated(By.css('app-project-details')),
        10000
      );

      const projectEl = await this.driver.wait(
        until.elementLocated(
          By.css('.project-list-link.nav-list__link--active')
        ),
        10000
      );
      const projectTitle = await projectEl.getText();
      if (projectTitle.trim() === itemName.trim()) {
        console.log('test passed successful');
        return;
      }
    }
    if (table === 'ts') {
      id
        ? (itemName = await this.clickOnFirstElInTableViaId('ts', true, false))
        : (itemName = await this.clickOnFirstElInTableViaId('ts', false, true));
      await this.driver.wait(async () => {
        const newUrl = await this.driver.getCurrentUrl();
        return newUrl !== oldUrl;
      }, 10000);
      await this.driver.wait(until.elementLocated(By.css('app-tasks')), 10000);
      const taskEl = await this.driver.wait(
        until.elementLocated(By.css('.backdrop .modalViewTask .task-title')),
        10000
      );
      const textWait = itemName.trim();
      if (await this.driver.wait(until.elementTextIs(taskEl, textWait),10000)) {
        console.log('test passed successful');
        return;
      }
    }
    throw new Error('test failed, not such table, check screenshot');
  }

  async clickOnSeeAllLink(link = 'pj', url) {
    await this.driver.wait(
      until.elementsLocated(By.css('.settings-wrapper__header')),
      10000
    );
    let elementForClick;
    let numberOfEl;
    let locator;
    if (link === 'cm') {
      elementForClick = 'see all companies';
      await this.waitListDate('.table-companies__row', 1);
      numberOfEl = await this.numberOfElementsOnDashboardTable(link);
      locator = '.table-companies__row';
    } else if (link === 'pj') {
      elementForClick = 'see all projects';
      await this.waitListDate('.table-projects__row', 1);
      numberOfEl = await this.numberOfElementsOnDashboardTable(link);
      locator = '.table-projects__row';
    }
    await this.findAndClickOnLinInTheList(
      elementForClick,
      '.settings-wrapper__header .table-link'
    );
    await this.driver.wait(until.urlIs(url), 10000);
    await this.waitListDate(locator, 2);
    const number = await this.driver.findElements(By.css(locator));
    if ((await number.length) >= numberOfEl) {
      console.log('test passed');
      return;
    } else throw new Error('test failed');
  }
}

module.exports = DashBoardPart;
