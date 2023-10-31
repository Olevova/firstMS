const {Build, By, Select, until } = require('selenium-webdriver');


class InviteUser {

  static async findDateInDropDown(array, text) {

    for (const option of array) {

        const dateUser = (await option.getText()).trim().toLowerCase();
        console.log(dateUser);
        if (dateUser === text.trim().toLowerCase()) {
          await option.click()
          return
        }
      };
      if(array.length>0){
        await array[0].click()
        return
      }
      throw new Error(`Company list is empty, but `)
  }

    constructor(driver){
        this.driver = driver
    };

    async goToUsersList(){

        console.log("here");
        const usersBtn = await this.driver.findElement(By.id('linkUsers'));
        await usersBtn.click();

        const inviteNewUserBtn = await this.driver.findElement(By.id('btnCreate'));
        await inviteNewUserBtn.click()

    };

    async fillInviteForm(email, company, role){
       
        const selectEmail = await this.driver.findElement(By.id('userEmail'));
        await this.driver.wait(until.elementIsVisible(selectEmail), 3000);
        await selectEmail.sendKeys(email);

        const companyDropDown = await this.driver.findElement(By.id('userCompany'));
        await companyDropDown.click();
        // await this.driver.sleep(2000)
        await this.driver.wait(until.elementsLocated(By.className('ng-option')),3000)
        const companyList = await this.driver.findElements(By.className('ng-option'));
        await InviteUser.findDateInDropDown(companyList, company)
  
        if(role.trim().toLowerCase() !== 'company admin')
        
        {
          const roleDropDown = await this.driver.findElement(By.id('userRole'));
          await roleDropDown.click();
          const roleList = await this.driver.findElements(By.css('.ng-option'));
          await InviteUser.findDateInDropDown(roleList, role);
        
        }
       
        
        const sendAnInvite = this.driver.findElement(By.id('btnInvite'));
        await sendAnInvite.click();
        // await this.driver.sleep(500);

        
    }

    async checkNewUser(emailNew, userPage){
      
      const errorCreate = await this.driver.findElements(until.elementLocated(By.id('mainError')), 1000).catch(() => null);
     
      if (errorCreate){
        
        console.log('Error element exists:', errorCreate);
        throw new Error('You have error, check screenshot')
      
        };

        await this.driver.wait(until.elementLocated(By.className('notification')),10000);
        const windowHandles = await this.driver.findElement(By.className('notification'));   
        
        const windowHandlesText = await windowHandles.getText();
    
      if( windowHandlesText === 'Such user already exists'){
        
        console.log('Error element exists:', errorCreate);
        throw new Error('You have error, check screenshot');

      }

        try {

            await this.driver.wait(until.urlIs(userPage),10000);
            await this.driver.wait(until.elementsLocated(By.xpath('//table//td[3]')),10000);
            const allEmails = await this.driver.findElements(By.xpath('//table//td[3]'));
            
            for(const email of allEmails){

              const checkEmail = await email.getText();
            
              if(checkEmail === emailNew){
                
                console.log('yes');
                return

              }
            }

            throw new Error('It did not user created');

          }
          
        catch (error) {

         throw new Error(error.message);
         
        }
    }
    


}

module.exports = InviteUser;