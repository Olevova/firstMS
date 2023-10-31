const {By, until} = require('selenium-webdriver');

class removeCompany{

    static async findCompanyInList(array, companyName){
        let companyForSearch = "";
        let companyFound = false;
        for (let i = 0; i < array.length; i +=1)
        {
            companyForSearch = await array[i].getText();
            
            if(companyForSearch === companyName){
                const parentElement = await array[i].findElement(By.xpath('..'));
                const linkElement = await parentElement.findElement(By.css('a.view-link')); 
                companyFound = true;
                await linkElement.click();
                break
            }
        };
        if(!companyFound){
            console.log("Not such company");
            throw new Error ('No such company in the list of company')
        }

    }

    constructor(driver){

        this.driver = driver;

    };

    async goToCompanyList(){
    
        const companyBtn = await this.driver.findElement(By.id('linkCompanies'));
        await companyBtn.click();

    };

    async findCompany(company, page){

        await this.driver.wait(until.urlIs(page),10000);
        await this.driver.wait(until.elementsLocated(By.className('company-name')),10000);
        const allCompanies = await this.driver.findElements(By.className('company-name'));
        
        
        if(allCompanies){
            
            await removeCompany.findCompanyInList(allCompanies, company);
            
        }

    }

    async removefindCompany(companyName){
        
        // await this.driver.sleep(2000)
        await this.driver.wait(until.elementLocated(By.id('linkCompanySettings')),10000);
        const companyBtn = await this.driver.findElement(By.id('linkCompanySettings'));
    
        await companyBtn.click();
        await this.driver.wait(until.elementLocated(By.id("btnDeleteCompanyOpenModal")));
        const delBtn = await this.driver.findElements(By.id('btnDeleteCompanyOpenModal'));
    
        await delBtn[0].click();

        const modal = this.driver.findElement(By.className('modal'));
        await this.driver.wait(until.elementIsEnabled(modal),10000);

        const delBtnModal = await this.driver.findElement(By.id('btnDelete'));
        await delBtnModal.click();
        // await this.driver.sleep(1000);
        await this.driver.wait(until.elementsLocated(By.className('notification')),10000);  
        const windowHandles = await this.driver.findElement(By.className('notification'));
        const windowHandlesText = await windowHandles.getText();
    
        if (
            windowHandlesText === 'Error. Failed to save data'
            )
          {
            
            throw new Error('You have error, check screenshot');
        
          }
  
          try {
    
            await this.driver.wait(until.elementsLocated(By.className('company-name')), 3000);
            const allCompaniesAfterDel = await this.driver.findElements(By.className('company-name'));
    
            const isCompanyRemoved = allCompaniesAfterDel.every(async (i) => await i.getText() !== companyName);
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

module.exports = removeCompany;