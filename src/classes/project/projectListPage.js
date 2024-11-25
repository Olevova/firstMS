const { By, until } = require('selenium-webdriver');
const Base = require('../base');
const locator  = require('../../utils/locators/locatorsProject');

class ProjectListPage extends Base{
  constructor(driver) {
  super(driver);
  this.driver = driver;
  const addFloorButton = driver.findElement(By.id("addFloor"));
  }
    
  static async findProjectInList(array, projectName) {
    let projectSearchName = '';

    for (let i = 0; i < array.length; i += 1) {
      projectSearchName = await array[i].getText();

      if (projectSearchName === projectName) {
        // const parentElement = await array[i].findElement(By.xpath('..'));
        // const linkElement = await parentElement.findElement(
        //   By.css('a.view-link')
        // );
        await array[i].click();
        return;
      }
    }

    throw new Error('No such project found in projects list');
  }

    async isProjectListPageOpen(){
      await this.driver.wait(until.elementLocated(locator.projectPageHeader,1000));
     const projectHeaderElement =  await this.driver.findElement(locator.projectPageHeader);
      await this.driver.wait(until.elementIsVisible(projectHeaderElement, 1000));
     
      let pattern = /https?:\/\/.*system\/projects/;

  
      let url = await this.driver.getCurrentUrl();
      if ((pattern.test(url))){
        return true;
      }
      else {
        throw new Error ("Page details page was not open");
      }

    }

    async isProjectDetailsPageOpen(){
      await this.driver.wait(until.elementLocated(locator.projectPageHeader,1000));
      const projectHeaderElement =  await this.driver.findElement(locator.projectPageHeader);

      let pattern = /https?:\/\/.*system\/company\/\d+\/projects\/\d+\/view/;
     
      let url = await this.driver.getCurrentUrl();
      if ((pattern.test(url))){
        return true;
      }
      else {
        throw new Error ("Page details page was not open");
      }
      
     
    //  await this.driver.wait(until.elementTextMatches(companyNumber, /^(?:\d+|[a-zA-Z\s]+)$/), 10000)
    };
};
module.exports = ProjectListPage;