const { By, until } = require('selenium-webdriver');
const ChangeAreaStatus = require('./changeAreaStatusInView');


class ChangeAreaStatusInProjectProgress extends ChangeAreaStatus{

    constructor(driver){
        super(driver);
        this.driver = driver;
        this.statusNow='';
        this.selectStatusName = '';
    }

    async hoverAreaAndCheckCommentsAndAttachments(comments=0, attach=0){
        await this.driver.wait(until.elementLocated(By.css('html')), 10000);
        await this.driver.executeScript('return document.readyState');
        await this.driver.wait(until.elementsLocated(By.css(`.area-progress-list-areas__item[status-name="To Do"]`)), 10000);
        const areaElements = await this.driver.findElements(By.css(`.area-progress-list-areas__item`));
        const firstArea = await areaElements[0]
        await this.driver.actions().move({origin: firstArea}).perform()
        await this.driver.wait(until.elementLocated(By.css('.area-modal-mini')), 10000);
        const informAreaWindow = await firstArea.findElement(By.css('.area-modal-mini'));
        const commentsEl = await informAreaWindow.findElement(By.css('.comments-wrapper span'));
        const commentsNumber = await commentsEl.getText();
        const attachEl = await informAreaWindow.findElement(By.css('.files-wrapper span'));
        const attacheNumber = await attachEl.getText();
        // console.log(commentsNumber, 'comments',comments , attacheNumber, 'attach', attach);
        if(comments === +commentsNumber && +attacheNumber === attach){
            console.log(`Test passed, area has ${commentsNumber} comment(s) and ${attacheNumber} attachment(s)`);
            return;
        }
        throw new Error('Test failed, check screenshot')
        // await this.driver.sleep(10000);
    }

    async findeAreaInTheTable(status = '-3') {
        await this.driver.wait(until.elementLocated(By.css('html')), 10000);
        await this.driver.executeScript('return document.readyState');
        await this.driver.wait(until.elementsLocated(By.css(`.area-progress-list-areas__item[status-name="To Do"]`)), 10000);
        const areaElements = await this.driver.findElements(By.css(`.area-progress-list-areas__item[status-name="To Do"]`));
    
        if (areaElements.length === 0) {
            throw new Error('It has no area with status To Do');
        }
        for(let i of areaElements){
            const stEl = await i.getAttribute('status');
        }
        const firstArea = areaElements[0];
    
        console.log(await firstArea.getAttribute('status'), await firstArea.getAttribute('area-name'));
        this.selectStatusName = await firstArea.getAttribute('area-name');
        await firstArea.click();
    
        // await this.driver.wait(until.elementLocated(By.id('areaStatusSelect')), 10000);
        await this.driver.wait(until.elementLocated(By.css('.area__status-btn')), 10000);
        await this.driver.sleep(2000);
    }

    async closeAreaPopUpAndCheckStatusInPogress(status='-3'){
        // const selectStatus = await this.driver.findElement(By.id('areaStatusSelect'));
        const areaStatus = await this.driver.findElement(By.css('.area__status-btn'));
        const statusOfArea = await areaStatus.getText();
        this.statusNow = await statusOfArea.trim();
        const popUp = await this.driver.findElement(By.css('.backdrop[show="true"]'))
        const closeBtn = await popUp.findElement(By.id('btnCloseModal'));
        await this.driver.wait(until.elementIsEnabled(closeBtn),10000);
        await closeBtn.click()
        await this.driver.wait(until.elementLocated(By.css('html')), 10000);
        await this.driver.executeScript('return document.readyState');
        await this.driver.wait(until.elementsLocated(By.css(`.area-progress-list-areas__item[status="${status}"]`)),10000);
        const areaElements = await this.driver.findElements(By.css(`.area-progress-list-areas__item[status="${status}"]`))
        const firstArea = await areaElements[0];
        // const textArea = await firstArea.getText();
        if(await firstArea.getAttribute('status-name') !== this.statusNow){
            throw new Error('Close area Pop-up not work, check screenshot')
        }

    }

}

module.exports = ChangeAreaStatusInProjectProgress