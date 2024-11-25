const { By, until, error } = require('selenium-webdriver');
const Base = require('../base');
const { companiesPage } = require('../../utils/config');
const locators = require('../../utils/locators/locatorDashboard');


class DashboardPage extends Base {
    constructor(driver) {
        super(driver);
        this.driver = driver;
    };

    async isGreetingsShown() {
        const waitGreetings = await this.driver.findElement(locators.dashGreetingsDateText).isDisplayed().catch(error => error.message);
        console.log(waitGreetings);

        console.log(await this.driver.findElement(locators.dashGreetingsDateText).isDisplayed(), 'el');

        if (await this.driver.findElement(locators.dashGreetingsDateText).isDisplayed() && this.driver.findElement(locators.dashGreetingsText).isDisplayed()) {
            return true;
        }
        else { throw new Error("Greeting is not shown") };

    };

    async isCompanyTotalNumberShown() {
        const companyNumber = await this.driver.findElement(locators.dashCompanyNumberLabel);

        await this.driver.wait(until.elementTextMatches(companyNumber, /^(?:\d+|[a-zA-Z\s]+)$/), 10000)
        console.log(await companyNumber.getText(), 'company number');
        console.log(await companyNumber.isDisplayed(), 'displayed');
        if (await companyNumber.getText() !== '')
            return true;
        throw new Error("Company number element got no text")
    };

    async isElementVisible(locator) {
        try {
            const element = await this.driver.findElement(locator);
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }


    async isCompanySectionHidden() {
        if (await this.isElementVisible(locators.dashCompanyNumberLabel) && !(await this.isElementVisible(locators.dashCompanyTable))) 
            { throw new Error("Company section is not hidden, but visible"); }
        else {
            return true;
        }

    }

    async isProjectSectionHidden() {
        await this.driver.wait(until.elementLocated(locators.dashProjectId, 1000));
        let projectIdElement = await this.driver.findElement(locators.dashProjectId);
        await this.driver.wait(until.elementIsVisible(projectIdElement, 1000));
       
        if (await this.isElementVisible(projectIdElement))
            throw new Error("Project section is not hidden");
        else {
            return true;
        }

    }

    async isProjectTotalNumberShown() {
        const projectNumber = await this.driver.findElement(locators.dashProjectNumberLabel);
        if (projectNumber.getText() !== '') {
            return true;
        }
        else {
            throw new Error("Project  total number not shown");
        }
    };

    async isMyTasksTotalNumberShown() {
        const projectTasks = await this.driver.findElement(locators.dashProjectTasksLabel);

        if (projectTasks.getText() !== '') {
            return true;
        }
        else {
            throw new Error("My tasks total number not shown");
        }
    };

    async clickSeeAllProjectsLink() {
        console.log("See All Projects link is shown")
      //  await this.driver.wait(until.elementLocated(locators.dashSeeAllProjectsLink, 1000));
      //  let projectLinkElement = await this.driver.findElement(locators.dashSeeAllProjectsLink);   
     //   await this.driver.wait(until.elementIsVisible(projectLinkElement, 1000));
     let seeAllProjectsElement = await this.driver.findElement(locators.dashSeeAllProjectsLink);
      
        if (await seeAllProjectsElement.isDisplayed()){
            seeAllProjectsElement.click();
         }  
     else {throw new Error ("See all project link is not shown")};

    };

    async clickSeeAllCompaniesLink() {
        console.log("See All Companies link is shown")
        let seeAllCompaniesLinkElement = await this.driver.findElement(locators.dashSeeAllCompaniesLink);
        if (await seeAllCompaniesLinkElement.isDisplayed()) {
            console.log("click");
            
           seeAllCompaniesLinkElement.click()
        }
        else {
            throw new Error("Sea all companies link is not shown");
        }
    };

    async isCompanyListShown() {
        console.log("Company list is shown")
        let companyTableRowElement = await this.driver.findElement(locators.dashCompaniesTableRow).catch(e=>null);
        console.log(companyTableRowElement, 'companyTableRowElement');
        
        if (companyTableRowElement.isDisplayed()) {
            return true;
        }
        else {
            throw new Error("Companies list is not shown");
        }

    };

    async isProjectListShown() {
        console.log("Project list is shown")
       let projectTableElement =  await this.driver.findElement(locators.dashProjectsTableRow);
       await this.driver.wait(until.elementIsVisible(projectTableElement, 1000));

        if (await projectTableElement.isDisplayed()) {
            return true;
        }
        else {
            throw new Error("See all companies link is not shown")
        }

    };

    async openFirstProjectByID() {
        let elements = await this.driver.findElements(By.xpath("//li[contains(@class, 'company-id')]"));
        if (elements.length > 0) {
            await elements[0].click();
            console.log("First project ID clicked.");
        } else {
            console.log("No projects on the page");
            throw new Error("No projects on the page");

        }
    };

    async openFirstProjectByID() {
        await this.driver.wait(until.elementLocated(locators.dashProjectId, 1000));
        let projectIdElement = await this.driver.findElement(locators.dashProjectId);
        await this.driver.wait(until.elementIsVisible(projectIdElement, 1000));

        const element = await projectIdElement.click().catch(error=>error.message);
        console.log(element);


    };

    async openFirstProjectByName() {
        await this.driver.wait(until.elementLocated(locators.dashProjectName, 1000));
        let dashProjectName = await this.driver.findElement(locators.dashProjectName);
        await this.driver.wait(until.elementIsVisible(dashProjectName, 1000));


        if (await dashProjectName.isDisplayed()) {
            await dashProjectName.click();
            console.log("First project Name clicked.");
        } else {
            console.log("No project found.");
            throw new Error("No project found.");
        }
    };

    async openFirstCompanyByID() {
        await this.driver.wait(until.elementLocated(locators.dashCompanyId, 1000));
        let companyIdElement = await this.driver.findElement(locators.dashCompanyId);
        await this.driver.wait(until.elementIsVisible(companyIdElement, 1000));

        if (await companyIdElement.isDisplayed()) {
            await companyIdElement.click();
            console.log("First company's ID clicked.");
        } else {
            console.log("No Company found.");
            throw new Error("No Company found.");
        }
    };

    async openFirstCompanyByName() {
        await this.driver.wait(until.elementLocated(locators.dashCompanyName, 1000));
        let companyNameElement = await this.driver.findElement(locators.dashCompanyName);
        await this.driver.wait(until.elementIsVisible(companyNameElement, 1000));

        if (await companyNameElement.isDisplayed()) {
            companyNameElement.click();
            console.log("First company's name clicked.");
        } else {
            console.log("No Company found.");
            throw new Error("No company found.");
        }
    };

    async openFirstTaskById() {
        await this.driver.wait(until.elementLocated(locators.dashTaskTable, 1000));
        let taskTableElement = await this.driver.findElement(locators.dashTaskTable);
        await this.driver.wait(until.elementIsVisible(taskTableElement, 1000));

        if (!(await taskTableElement.isDisplayed())){
            throw new Error ("Task table not shown")
      
        }

        await this.driver.wait(until.elementLocated(locators.dashTaskId, 1000));
        let taskIdElement = await this.driver.findElement(locators.dashTaskId);
        await this.driver.wait(until.elementIsVisible(taskIdElement, 1000));

        if (await taskIdElement.isDisplayed()){
             taskIdElement.click();
        }
           else { throw new Error ("Task ID not shown")};
      
        };
      //  await this.driver.sleep(900);

     //   let elements = await this.driver.findElements(By.xpath("//li[@class='task-id fixed-left-column']/span/span"));

     //   if (elements.length > 0) {
     //       await this.driver.executeScript("arguments[0].click();", elements[0]);
     //       console.log("First task's ID clicked.");
    //    } else {
     //       console.log("No specified task found.");
     //       throw new Error("No task found.");
      //  }
      

    async openFirstTaskByName() {
        await this.driver.sleep(900);

        let elements = await this.driver.findElements(By.xpath("//div[@class='task-name__wrapper']/div"));
        if (elements.length > 0) {
            await this.driver.executeScript("arguments[0].click();", elements[0]);
            console.log("First task's ID clicked.");
        } else {
            console.log("No specified task found.");
            throw new Error("No task found.");
        }
    };


}

module.exports = DashboardPage;
