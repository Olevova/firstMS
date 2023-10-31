const {By, until} = require('selenium-webdriver');

class RemoveUser{

    constructor(driver){
        this.driver = driver;

    };

    async goToUserList(){
    
    const companyBtn = await this.driver.findElement(By.id('linkUsers'));
    await companyBtn.click();

    };

    async findUser(user, usersPage){
        await this.driver.wait(until.urlIs(usersPage),10000);
        let userForSearch = "";

        await this.driver.wait(until.elementsLocated(By.xpath('//table//td[3]')),10000)
        const allUsers = await this.driver.findElements(By.xpath('//table//td[3]'));
        
        if(allUsers){

            for (let i = 0; i < allUsers.length; i +=1){

                userForSearch = await allUsers[i].getText();
                
                if(userForSearch === user){

                    const parentElement = await allUsers[i].findElement(By.xpath('..'));
                    const linkElement = await parentElement.findElement(By.id('viewProfile')); 
                    await linkElement.click();
                    return
                }
               
        };
        
        // await this.driver.sleep(2000);
        throw new Error('No such user');
    }

    }

    async removefindUser(){

        const removeBtn = await this.driver.findElement(By.id('deleteUserOpenModalSuperAdmin'));
        await this.driver.wait(until.elementIsVisible(removeBtn),10000)
        const documentReadyState1 = await this.driver.executeScript('return document.readyState');
        console.log('Document Ready State:', documentReadyState1);
        // console.log(removeBtn);
        
        await removeBtn.click();
        const modal = this.driver.findElement(By.className('backdrop manual'));
        await this.driver.wait(until.elementIsEnabled(modal),10000);
        console.log(await modal.getDomAttribute("show"), await modal.getDomAttribute('show'));
      
        
        // await this.driver.wait(until.elementIsDisabled(By.id("deleteUserOpenModalSuperAdmin")),3000);
        const delUserBtn = await this.driver.findElement(By.id('btnDelete'))




        const element = await this.driver.wait(until.elementLocated(By.css('html')), 10000);
        const documentReadyState2 = await this.driver.executeScript('return document.readyState');
        console.log('Document Ready State:', documentReadyState2);
        console.log(await delUserBtn.getDomAttribute("type"), await delUserBtn.getDomAttribute('show'));
        console.log(await this.driver.wait(until.elementIsEnabled(element)));
        console.log(await delUserBtn.getRect())
        await delUserBtn.click()
        // await this.driver.sleep(1000);

    };


    async checkIfUserRemove(delemail, userPage){
       
        await this.driver.wait(until.elementLocated(By.className('notification')))
        const windowHandles = await this.driver.findElement(By.className('notification'));
        
        const windowHandlesText = await windowHandles.getText();
        console.log(windowHandlesText);

        if( windowHandlesText==='Such user already exists'){
          
          throw new Error('You have error, check screenshot');

        }
          try {

            await this.driver.wait(until.urlIs(userPage),10000)
            await this.driver.wait(until.elementsLocated(By.xpath('//table//td[3]')),10000)
            const allEmails = await this.driver.findElements(By.xpath('//table//td[3]'));
            
            for(const email of allEmails){

                const checkEmail = await email.getText();

                if(checkEmail === delemail){
                    throw new Error('It did not user remove');
                }
              }

            return
            
            }
            
          catch (error) {

            throw new Error(error.message);

          }
      
    }


};

module.exports = RemoveUser;