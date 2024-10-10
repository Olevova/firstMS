const { Build, By, Select, until } = require('selenium-webdriver');
const InviteUser = require('./inviteUser');

class AddRemoveUserToProject extends InviteUser {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async addExistingUser(user) {
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(By.id('btnAddUsersToProject')),
      10000
    );
    const addExistingUserBtn = await this.driver.findElement(
      By.id('btnAddUsersToProject')
    );
    await this.driver.wait(until.elementIsEnabled(addExistingUserBtn), 10000);
    await addExistingUserBtn.click();
    await this.driver.wait(until.elementLocated(By.css('.backdrop')), 10000);
    const inviteForm = await this.driver.findElement(By.css('.form-invite'));
    const usersDropDown = await inviteForm.findElement(By.id('selectUsers'));
    await usersDropDown.click();
    await this.waitListDate('.ng-option', 2);
    const usersList = await this.driver.findElements(By.css('.ng-option'));
    await this.findDateInDropDown(usersList, user);
    const addToProjectBtn = await this.driver.findElement(By.id('btnAddUsers'));
    await this.driver.wait(until.elementIsEnabled(addToProjectBtn));
    await addToProjectBtn.click();
    await this.notificationCheck();
  }

  async addAllExistingUser(clickBtn = true) {
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(By.id('btnAddUsersToProject')),
      10000
    );
    const addExistingUserBtn = await this.driver.findElement(
      By.id('btnAddUsersToProject')
    );
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementIsEnabled(addExistingUserBtn), 10000);
    await addExistingUserBtn.click();
    await this.driver.wait(until.elementLocated(By.css('.backdrop')), 10000);
    const inviteForm = await this.driver.findElement(By.css('.form-invite'));
    const usersDropDown = await inviteForm.findElement(By.id('selectUsers'));
    await usersDropDown.click();
    await this.waitListDate('.ng-dropdown-footer', 1);
    await this.driver.sleep(1000);
    const allUserBtn = await this.driver.findElement(
      By.css('.ng-dropdown-footer a')
    );
    // console.log(await allUserBtn.getAttribute('hasusers'));
    const hasUsers = await allUserBtn.getAttribute('hasusers');
    if (hasUsers === 'true') {
      await allUserBtn.click();
      if (clickBtn) {
        const addToProjectBtn = await this.driver.findElement(
          By.id('btnAddUsers')
        );
        await this.driver.wait(until.elementIsEnabled(addToProjectBtn));
        await addToProjectBtn.click();
        await this.notificationCheck();
      }
    } else if (hasUsers === 'false') {
      throw new Error('Users list empty');
    } else {
      throw new Error('check screenshot');
    }
  }

  async unselectUser(user = false) {
    await this.driver.wait(
      until.elementLocated(By.css('.ng-select-container.ng-has-value')),
      10000
    );
    const addEl = await this.driver.findElements(By.css('.ng-value'));
    const lengthAddUser = await addEl.length;
    let delBtn;
    if (user) {
      for (let i of addEl) {
        const userNameEl = await i.findElement(By.css('.ng-value-label'));
        const userName = await userNameEl.getText();
        if (userName.trim().toLowerCase() === user.toLowerCase()) {
          delBtn = await i.findElement(By.css('.ng-value-icon'));
          await delBtn.click();
          await this.driver.sleep(500);
          break;
        }
      }
    } else {
      delBtn = await addEl[0].findElement(By.css('.ng-value-icon'));
      await delBtn.click();
      await this.driver.sleep(1000);
    }
    const addElAfter = await this.driver.findElements(By.css('.ng-value'));
    const lengthAddUserAfter = await addElAfter.length;
    // console.log(lengthAddUser, lengthAddUserAfter);

    if (lengthAddUser <= lengthAddUserAfter) {
      throw new Error('User unselect not work');
    }
  }

  async removeUserFromProject(user) {
    await this.waitListDate('.list-name-wrapper.user-name-wrapper', 1);
    await this.findItemAndOpenThreeDotsMenu(
      user,
      '.list-name-wrapper.user-name-wrapper'
    );
    await this.driver.wait(
      until.elementLocated(By.css('#dotsMenu[editmenuopen]')),
      1000
    );
    const removeBtn = await this.driver.findElement(By.id('deleteItem'));
    await this.driver.wait(until.elementIsEnabled(removeBtn), 10000);
    await removeBtn.click();
    await this.driver.wait(until.elementLocated(By.css('.backdrop')), 10000);
    const removeUserBtn = await this.driver.findElement(
      By.id('btnDeleteProject')
    );
    await this.driver.wait(until.elementIsEnabled(removeUserBtn), 10000);
    await removeUserBtn.click();
    await this.notificationCheck();
  }
}
module.exports = AddRemoveUserToProject;
