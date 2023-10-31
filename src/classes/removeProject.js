const {By, until} = require('selenium-webdriver');
const logging = require('selenium-webdriver/lib/logging');

class removeProject{

    static async findProjectInList(array, projectName){
        
        let projectSearchName = "";

        for (let i = 0; i < array.length; i +=1){

            projectSearchName = await array[i].getText();
            // console.log(projectSearchName);
            if(projectSearchName === projectName){
                console.log('have');
                const parentElement = await array[i].findElement(By.xpath('..'));
                const linkElement = await parentElement.findElement(By.css('a.view-link')); 
                await linkElement.click();
                return
            
            }
        };
        
            throw new Error ('No such project in the list of project');
        
    }

    constructor(driver){

        this.driver = driver;

    };

    async enableBrowserConsoleLogs() {
        await this.driver.manage().logs().get(logging.Type.BROWSER);
      }
    
      async getAndProcessBrowserConsoleLogs() {
        const logs = await this.driver.manage().logs().get(logging.Type.BROWSER);
        logs.forEach((entry) => {
          console.log(`[${entry.level.value}] ${entry.message}`);
        });
      }

    async goToProjectList(){
    
        const companyBtn = await this.driver.findElement(By.id('linkProjects'));
        await companyBtn.click();

    };

    async findProject(project, page){

        await this.driver.wait(until.urlIs(page),10000);
        await this.driver.wait(until.elementsLocated(By.className('company-name')),10000);
        const allProjects = await this.driver.findElements(By.className('company-name'));
    
        
        if(allProjects){
            
            await removeProject.findProjectInList(allProjects, project);
            
        }

    }

    async removefindProject(projectName){
        const documentReadyState1 = await this.driver.executeScript('return document.readyState');
        console.log('Document Ready State:', documentReadyState1, '57row');
        await this.driver.wait(until.elementLocated(By.id("btnDeleteProjectOpenModal"),10000));
        const delBtnProject = await this.driver.findElements(By.id('btnDeleteProjectOpenModal'));
        // console.log('hereee');
        await delBtnProject[0].click();
        const modal = this.driver.findElement(By.className('modal'));
        await this.driver.wait(until.elementIsEnabled(modal),10000);
        console.log(await this.driver.findElement(By.className('backdrop manual')).getAttribute('show'), 'row64');
        
        const delBtnModalProject = await this.driver.findElement(By.id('btnDeleteProject'));
        // await this.driver.wait(until.elementIsVisible(delBtnModal),3000);
        const element = await this.driver.wait(until.elementLocated(By.css('html')), 10000);
        const documentReadyState2 = await this.driver.executeScript('return document.readyState');
        console.log('Document Ready State:', documentReadyState2);
        console.log(await delBtnModalProject.getRect())
        await delBtnModalProject.click();
        // await this.driver.sleep(2000);


        const logs = await this.driver.manage().logs().get(logging.Type.BROWSER);
        logs.forEach((entry) => {
            console.log(`[${entry.level.value}] ${entry.message}`);
        });


        await this.driver.wait(until.elementLocated(By.className('notification')),10000)
        const windowHandles = await this.driver.findElement(By.className('notification'));
        const windowHandlesText = await windowHandles.getText();
        console.log(windowHandlesText, 'windowHandlesText');
        
        if (
            windowHandlesText === 'Error. Failed to save data'
            )
          {
            
            throw new Error('You have error, check screenshot');
        
          }
  
          try {
    
            await this.driver.wait(until.elementsLocated(By.className('company-name')), 3000);
            const allProjectsAfterDel = await this.driver.findElements(By.className('company-name'));
    
            const isCompanyRemoved = allProjectsAfterDel.every(async (i) => await i.getText() !== projectName);
            console.log(isCompanyRemoved);
    
            if (isCompanyRemoved) {
                
                return; 
                
            } else {
                throw new Error("Company did not remove");
            }
        } catch (error) {
            throw new Error(error.message);
        }

}

};

module.exports = removeProject;