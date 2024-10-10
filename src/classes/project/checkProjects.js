const EditProject = require("./editProject");
const { By, until } = require('selenium-webdriver');


class CheckProjects extends EditProject {
    constructor(driver){
        super(driver)
        this.driver = driver
    }


    async checkProjectsStatus(el){
       const statusEl = await el.findElement(By.css('.project-status-wrapper .status-bar-colored'));
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
            By.className('filters-btn')
          );
      
          await this.driver.wait(until.elementIsEnabled(filterFormBtn), 10000);
          await filterFormBtn.click();
          await this.driver.wait(until.elementLocated(By.className('filters-form')),10000);
          const clientInput = await this.driver.findElement(By.css(".filter-field-wrapper [placeholder='Add Client']"))
          await this.driver.wait(until.elementIsEnabled(clientInput));

          if(user==='sa'){
            if(company){
                const companyInput = await this.driver.findElement(By.css(".filter-field-wrapper [placeholder='Add Company Name']"))
                await this.driver.wait(until.elementIsEnabled(companyInput));
                await companyInput.click();
                await this.driver.wait(
                    until.elementsLocated(By.className('ng-option')),
                    10000
                  );
                  const companiesEl = await this.driver.findElements(
                    By.className('ng-option')
                  );
                  await this.findDateInDropDown(companiesEl, company)
            }
        }
        await clientInput.click();
        await this.driver.wait(
            until.elementsLocated(By.className('ng-option')),
            10000
          );
          const clientsEl = await this.driver.findElements(
            By.className('ng-option')
          );
          await this.findDateInDropDown(clientsEl, client);
          await filterFormBtn.click();
    }
}

module.exports = CheckProjects