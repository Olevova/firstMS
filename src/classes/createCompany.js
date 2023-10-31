const {By, until} = require('selenium-webdriver');

class CreateCompany{

  // The method for selecting a value from a dropdown list
  static async findDateInDropDown(array, text) {
    for (const option of array) {
        const date = (await option.getText()).trim().toLowerCase();
        if (date === text.trim().toLowerCase()) {
          await option.click();
          return;
        }
      };
      
      throw Error(`No ${text} in options list`);
  }

  constructor(driver){
        this.driver = driver;
        this.companyName =''

    };

  async goToCreateCompanyForm(){
   
        const companyBtn = await this.driver.findElement(By.id('linkCompanies'));
        await companyBtn.click();
        const createCompanyBtn = await this.driver.findElement(By.id('btnCreate'))
        await createCompanyBtn.click();

    };
  // A method that can be used to change the window size.
  async makeWindowsFormLower(size){
      await this.driver.executeScript(`document.body.style.zoom='${size}%'`);
    }

  async fillCreateCompany(name, street, app, state, city, zipcode, phone, email, type){

        const createForm = this.driver.findElement(By.className("modal"));
        await this.driver.wait(until.elementIsVisible(createForm),10000);
       
        const companyName = await this.driver.findElement(By.id("companyName"));
        await companyName.sendKeys(name);
     
        const addressStreet = await this.driver.findElement(By.id("companyAddress"));
        await addressStreet.sendKeys(street);

        const addressApart = await this.driver.findElement(By.id("companyAddressSecond"));
        await addressApart.sendKeys(app)

        const stateDropdown = await this.driver.findElement(By.id("companyState"));
        await stateDropdown.click();
        const stateList = await this.driver.findElements(By.className("ng-option"));
        await CreateCompany.findDateInDropDown(stateList, state);
       
        const cityDropDown = await this.driver.findElement(By.id("companyCity")) ;
        await cityDropDown.click();
        const cityList = await this.driver.findElements(By.className("ng-option"));
        await CreateCompany.findDateInDropDown(cityList, city);
       
        const companyZip = await this.driver.findElement(By.id("companyZipCode"));
        await companyZip.sendKeys(zipcode);

        const companyPhone = await this.driver.findElement(By.id("companyPhone"));
        await companyPhone.sendKeys(phone);

        const companyEmail = await this.driver.findElement(By.id("companyEmail"));
        await companyEmail.sendKeys(email);

        const typeDropDown = await this.driver.findElement(By.id("companyType"))
        await typeDropDown.click();

        const typeList = await this.driver.findElements(By.className("ng-option"));
        await CreateCompany.findDateInDropDown(typeList, type);
        const createBtn = await this.driver.findElement(By.id("btnSubmit"));
        
        createBtn.click()
      
    }

    async checkCreationOfNewCompany(name){

        
        // await this.driver.sleep(1000)
      
        // await this.driver.wait(until.elementsLocated(By.id('mainErrorText')),1000); 
        const formError = await this.driver.wait(until.elementLocated(By.id('mainErrorText')), 1000).catch(() => null);
        console.log(formError);
          if (formError)
            {
            console.log('Error element exists:', formError);
            throw new Error('You have error, check screenshot')
          
            };

        await this.driver.wait(until.elementsLocated(By.className('notification')),10000);    
        const windowHandles = await this.driver.findElement(By.className('notification'));
        
        // await this.driver.wait(until.elementIsVisible(By.className('notification')),3000);
        const windowHandlesText = await windowHandles.getText();
        
        if(windowHandlesText==='Error. Failed to save data')
          {
            throw new Error('Such company is created')

          };

        

        try {
          
          let companyName='';
          await this.driver.wait(until.elementsLocated(By.className('company-name')),10000)
          const companiesNameList = await this.driver.findElements(By.className('company-name'))
          
          if(companiesNameList){
            for(let i = 0; i < companiesNameList.length; i +=1){
              companyName = await companiesNameList[i].getText();
    
            if(companyName===name)
              {
                return companyName;
              }
            }
          }

          }
        catch (error) {
         throw new Error(error.message);
        }
    }

};

module.exports = CreateCompany;