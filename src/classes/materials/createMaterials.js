const { By, until } = require('selenium-webdriver');
const Base = require('../base');
const path = require('path');

class CreateMaterials extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async openMaterialsAddMaterialsForm(){
    await this.clickElement('#btnCreate');
    await this.driver.wait(until.elementLocated(By.css('.backdrop .form-invite')),10000);
    const saveMaterialsBtn = await this.driver.findElement(By.id('btnSubmitMobile'));
    await this.driver.wait(until.elementIsEnabled(saveMaterialsBtn), 10000);
  }

  async fillAddMaterialsFields(
    save=false,
    user='sa',
    tag,
    description=false,
    unit,
    supplier,
    area,
    submittalStatus,
    file=false,
    orderStatus,
    eta=false,
    grossQty=false,
    orderQty=false,
    orderDate=false,
    paymentStatus=false,
    receivedQty = false,
    location= false,
    materialNotes=false,
    fileSecondInput=false
){

    await this.driver.executeScript('return document.readyState');
    const tagEl = await this.driver.findElement(By.id('tagNameMobile'));
    await tagEl.sendKeys(tag);

    if(description){
        const descriptionEL = await this.driver.findElement(By.id('materialDescription'));
        await descriptionEL.sendKeys(description);
    }
    
    const unitEl = await this.driver.findElement(By.id('materialUnit'));
    await this.driver.wait(until.elementIsEnabled(unitEl),10000);
    await unitEl.click();
    await this.waitListDate('.material__unit-menu__text',3);
    const unitList = await this.driver.findElements(By.css('.material__unit-menu__text'))
    await this.findDateInDropDown(unitList, unit);

    const supplierEL = await this.driver.findElement(By.id('supplierName'));
    await supplierEL.sendKeys(supplier);

    const areaEL = await this.driver.findElement(By.id('areaName'));
    await areaEL.sendKeys(area);
    await this.driver.sleep(1000);
    
    const submittalStatusEl = await this.driver.findElements(By.css('#materialSelectBtn'));
    for (let i of submittalStatusEl){
        const elText = await i.getText();
        if(elText.trim() === 'Select Status'){
            await i.click();
            await this.waitListDate('.material__unit-menu__item',2);
            const submittalStatusList = await this.driver.findElements(By.css('.material__unit-menu__item'))
            await this.findDateInDropDown(submittalStatusList, submittalStatus);
            await this.driver.sleep(500);
        }  
    }
    if(file){
        const fileEl = await this.driver.findElements(By.id('fileInputMobile'));
        const pathFile = path.join(__dirname, 'Logo.png')
        await fileEl[0].sendKeys(pathFile);
    }

    // const submittalStatusEl = await this.driver.findElements(By.css('#materialSelectBtn'));
    for (let i of submittalStatusEl){
        const elText = await i.getText();
        if(elText.trim() === 'Not Ordered'){
            await i.click();
            await this.waitListDate('.material__unit-menu__item',2);
            const orderStatusList = await this.driver.findElements(By.css('.material__unit-menu__item'))
            await this.findDateInDropDown(orderStatusList, orderStatus);
            await this.driver.sleep(500);
        }  
    }

    if(eta){
        const etaEl = await this.driver.findElement(By.id('materialEtaDate'));
        await etaEl.sendKeys(eta);
    };
    if(grossQty){
        const grossQtyEl = await this.driver.findElement(By.id('grossQtyName'));
        await grossQtyEl.sendKeys(grossQty);
    };
    
    if(orderQty){
        const orderQtyEl = await this.driver.findElement(By.id('orderQtyName'));
        await orderQtyEl.sendKeys(orderQty);
    };
    if(orderDate){
        const orderDateEl = await this.driver.findElement(By.id('materialOrderDate'));
        await orderDateEl.sendKeys(grossQty);
    };
    if(paymentStatus){
        const paymentStatusEl = await this.driver.findElement(By.id('paymentStatus'));
    await paymentStatusEl.click();
    await this.waitListDate('.material__unit-menu__item',2);
    const paymentStatusList = await this.driver.findElements(By.css('.material__unit-menu__item'))
    await this.findDateInDropDown(paymentStatusList, paymentStatus);
    };
    if(receivedQty){
        const receivedQtyNameEl = await this.driver.findElement(By.id('receivedQtyName'));
        await receivedQtyNameEl.sendKeys(receivedQty);
    };
    if(location){
        const storedLocationEl = await this.driver.findElement(By.id('storedLocation'));
        await storedLocationEl.click();
        await this.waitListDate('.material__unit-menu__item',2);
        const storedLocationList = await this.driver.findElements(By.css('.material__unit-menu__item'))
        await this.findDateInDropDown(storedLocationList, storedLocation);
    };
    if(materialNotes){
        const materialNotesEl = await this.driver.findElement(By.id('receivedQtyName'));
        await materialNotesEl.sendKeys(materialNotes);
    };
    if(fileSecondInput){
        const fileEl = await this.driver.findElements(By.id('fileInputMobile'));
        const pathFile = path.join(__dirname, 'Logo.png')
        await fileEl[1].sendKeys(pathFile);
    }
    await this.driver.sleep(5000);
    if(save){
        await this.clickElement('#btnSubmitMobile');
        await this.notificationCheck();
    }
  }

}

module.exports = CreateMaterials;
