const { By, until } = require('selenium-webdriver');
const Base = require('../base');
const locators = require('../../utils/locators/locatorsCompany');

class CompanyListPage extends Base{
  constructor(driver) {
  super(driver);
  this.driver = driver;
  };
    
  static async findCompanyInList(array, companyName) {
        let companyForSearch = '';
        let companyFound = false;
    
        for (let i = 0; i < array.length; i += 1) {
          companyForSearch = await array[i].getText();
          
          if (companyForSearch === companyName) {
            companyFound = true;
            await array[i].click();
            break;
          }
        }

    if (!companyFound) {
        console.log('Not such company found in list');
        throw new Error('No such company in the companies list');
      }
    };


    async isCompaniesListPageOpen(){
    let currentUrl = await this.driver.getCurrentUrl();
    if (currentUrl.includes("/system/companies") && await this.driver.findElement(locators.createProjectButton).isDisplayed()){
      return true;
    }};

    async isCompanyPageOpen(companyName){
     
      let currentUrl = await this.driver.getCurrentUrl();
      console.log(currentUrl, 'currentUrl');
      
      if (currentUrl.includes("/system/company") && await this.driver.findElement(locators.createProjectButton).isDisplayed()){
        return true;
      }
    }
}
module.exports = CompanyListPage;