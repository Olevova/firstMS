const { By, until } = require('selenium-webdriver');
const Base = require('../base');
const locatorsCommon = require('../../utils/locators/locatorsCommon');
const locatorUser = require('../../utils/locators/locatorUser');


class InviteUser extends Base {
  static async nameChange(userName, user) {
    if (userName === user) {
      return user + '1';
    } else {
      return user;
    }
  }

  static async compareAnswer(profileName, menuName) {
    if (profileName === menuName) {
      return console.log('User updated successfully');
    }
    throw new Error('User updated not success');
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.startUsersNumber = 0;
    this.endUsersNumber = 0;
    this.usersNumberInUsersList = null;
  }

  async addExistingUser(user) {
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(locatorUser.userBtnAddUserToProject),
      10000
    );
    const addExistingUserBtn = await this.driver.findElement(
      locatorUser.userBtnAddUserToProject
    );
    await this.driver.wait(until.elementIsEnabled(addExistingUserBtn), 10000);
    await addExistingUserBtn.click();
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);
    const inviteForm = await this.driver.findElement(locatorsCommon.baseFormInvite);
    const usersDropDown = await inviteForm.findElement(locatorUser.userSelectUser);
    await this.driver.wait(until.elementIsEnabled(usersDropDown), 10000);
    await usersDropDown.click();
    await this.waitListDate('.ng-option', 2);
    const usersList = await this.driver.findElements(locatorsCommon.baseDropdownOption);
    await this.findDateInDropDown(usersList, user);
    const addToProjectBtn = await this.driver.findElement(locatorUser.userBtnAddUser);
    await this.driver.wait(until.elementIsEnabled(addToProjectBtn));
    await addToProjectBtn.click();
    await this.notificationCheck();
  }

  async addAllExistingUser(clickBtn = true) {
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(locatorUser.userBtnAddUserToProject),
      10000
    );
    const addExistingUserBtn = await this.driver.findElement(
      locatorUser.userBtnAddUserToProject
    );
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementIsEnabled(addExistingUserBtn), 10000);
    await addExistingUserBtn.click();
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);
    const inviteForm = await this.driver.findElement(locatorsCommon.baseFormInvite);
    const usersDropDown = await inviteForm.findElement(locatorUser.userSelectUser);
    await usersDropDown.click();
    await this.waitListDate('.ng-dropdown-footer', 1);
    await this.driver.sleep(1000);
    const allUserBtn = await this.driver.findElement(
      By.css('.ng-dropdown-footer a')
    );
    await this.driver.sleep(500);
    const hasUsers = await allUserBtn.getAttribute('hasusers');
    if (hasUsers === 'true') {
      await allUserBtn.click();
      if (clickBtn) {
        const addToProjectBtn = await this.driver.findElement(
          locatorUser.userBtnAddUser
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
      until.elementLocated(locatorUser.userSelectContainer),
      10000
    );
    const addEl = await this.driver.findElements(locatorsCommon.baseNgValue);
    const lengthAddUser = await addEl.length;
    let delBtn;
    if (user) {
      for (let i of addEl) {
        const userNameEl = await i.findElement(locatorsCommon.baseNgValueLable);
        const userName = await userNameEl.getText();
        if (userName.trim().toLowerCase() === user.toLowerCase()) {
          delBtn = await i.findElement(locatorsCommon.baseNgValueIcon);
          await delBtn.click();
          await this.driver.sleep(500);
          break;
        }
      }
    } else {
      delBtn = await addEl[0].findElement(locatorsCommon.baseNgValueIcon);
      await delBtn.click();
      await this.driver.sleep(1000);
    }
    const addElAfter = await this.driver.findElements(locatorsCommon.baseNgValue);
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
      until.elementLocated(locatorsCommon.baseDotMenuOpen),
      1000
    );
    const removeBtn = await this.driver.findElement(locatorsCommon.baseDeleteItemId);
    await this.driver.wait(until.elementIsEnabled(removeBtn), 10000);
    await removeBtn.click();
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop), 10000);
    const removeUserBtn = await this.driver.findElement(
      locatorsCommon.baseDelStatusProjectBtnId
    );
    await this.driver.wait(until.elementIsEnabled(removeUserBtn), 10000);
    await removeUserBtn.click();
    await this.notificationCheck();
  }

  async goToInviteUsersForm(user = 'sa') {
    if (user === 'sa') {
      const usersBtn = await this.driver.findElement(locatorUser.userLinkUser);
      await usersBtn.click();
      this.startUsersNumber = await this.numberOfItemsInTheList(
        '.item-info-list'
      );
    } else {
      await this.driver.sleep(2000);
      await this.driver.wait(
        until.elementLocated(locatorUser.userLinkUserInProject),
        10000
      );
      const userBtnCA = await this.driver.findElement(
        locatorUser.userLinkUserInProject
      );
      await this.driver.wait(until.elementIsEnabled(userBtnCA), 10000);
      await userBtnCA.click();
      await this.driver.executeScript('return document.readyState');
    }
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBtnCreate), 10000);
    const inviteNewUserBtn = await this.driver.findElement(locatorsCommon.baseBtnCreate);
    await this.driver.wait(until.elementIsEnabled(inviteNewUserBtn), 10000);
    await inviteNewUserBtn.click();
  }

  async openInviteUserFormInProject() {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBtnCreate), 10000);
    const inviteUserBtn = await this.driver.findElement(locatorsCommon.baseBtnCreate);
    await this.driver.wait(until.elementIsEnabled(inviteUserBtn));
    await inviteUserBtn.click();
    await this.driver.executeScript('return document.readyState');
  }

  async checkNumberOfUsersInUsersList(user = 'sa') {
    if (user === 'sa') {
      const usersBtn = await this.driver.findElement(locatorUser.userLinkUser);
      await usersBtn.click();
      this.startUsersNumber = await this.numberOfItemsInTheList(
        '.table-users__row'
      );
    } else {
      await this.driver.sleep(1000);
      await this.driver.wait(
        until.elementLocated(locatorUser.userLinkUserInProject),
        10000
      );
      const userBtnCA = await this.driver.findElement(
        locatorUser.userLinkUserInProject
      );
      await this.driver.wait(until.elementIsEnabled(userBtnCA), 10000);
      await userBtnCA.click();
      await this.driver.executeScript('return document.readyState');
    }
    this.startUsersNumber = await this.numberOfItemsInTheList(
      '.table-users__row'
    );
  }

  async checkAvailibleNumberOfUsersInInviteForm() {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBtnCreate), 10000);
    const inviteNewUserBtn = await this.driver.findElement(locatorsCommon.baseBtnCreate);
    await this.driver.wait(until.elementIsEnabled(inviteNewUserBtn), 10000);
    await inviteNewUserBtn.click();
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseBackdropAndModalCss),
      10000
    );
    await this.driver.wait(until.elementLocated(locatorsCommon.baseFormInvite), 10000);
    const formTitle = await this.driver.findElement(
      locatorsCommon.baseFormModalTitle
    );
    await this.driver.wait(until.elementIsVisible(formTitle), 3000);
    const userInfo = await formTitle.findElement(locatorUser.userAmountInfo);
    const userInfoText = await userInfo.getText();
    const arrayInfo = await userInfoText.split(' ');
    const arrayOfUser = arrayInfo[arrayInfo.length - 1].split('/');
    console.log(
      `available number of users ${arrayOfUser[0]}, users company plan ${arrayOfUser[1]}`
    );
    const userInProject = arrayOfUser[1] - arrayOfUser[0];
    console.log(userInProject);
    if (this.startUsersNumber === userInProject) {
      console.log('test passed succesful');
    } else {
      throw new Error(
        'Test availible number of users failed, check screenshot'
      );
    }
  }

  async fillInviteForm(email, company, role = false) {
    await this.driver.wait(until.elementLocated(locatorUser.userInputEmail), 10000);
    const selectEmail = await this.driver.findElement(locatorUser.userInputEmail);
    await this.driver.wait(until.elementIsVisible(selectEmail), 3000);
    await selectEmail.sendKeys(email);

    const companyDropDown = await this.driver.findElement(locatorUser.userCompanyId);
    await companyDropDown.click();

    await this.driver.wait(
      until.elementsLocated(locatorsCommon.baseDropdownOption),
      3000
    );
    const companyList = await this.driver.findElements(
      locatorsCommon.baseDropdownOption
    );

    await this.findDateInDropDown(companyList, company);
    await this.driver.sleep(1000);
    if (role) {
      if (role.trim().toLowerCase() !== 'company admin') {
        const roleDropDown = await this.driver.findElement(locatorUser.userRoleId);
        await roleDropDown.click();
        const roleList = await this.driver.findElements(locatorsCommon.baseDropdownOption);
        await this.findDateInDropDown(roleList, role);
      }
    }
    const sendAnInvite = this.driver.findElement(locatorUser.userBtnInviteId);
    // await this.waitForSpecificTime(18, 27)
    await sendAnInvite.click();
  }
  async fillInviteFormByCA(email, role) {
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBackdrop, 10000));
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementLocated(locatorUser.userInputEmail), 10000);
    const selectEmail = await this.driver.findElement(locatorUser.userInputEmail);
    await this.driver.wait(until.elementIsEnabled(selectEmail), 3000);
    await selectEmail.sendKeys(email);
    if (role) {
      const roleDropDown = await this.driver.findElement(locatorUser.userRoleId);
      await roleDropDown.click();
      await this.driver.wait(
        until.elementLocated(locatorUser.userdropdownListBox),
        10000
      );
      const roleList = await roleDropDown.findElements(
        locatorsCommon.baseNgOptionLable
      );
      await this.findDateInDropDown(roleList, role);
    }

    const sendAnInvite = this.driver.findElement(locatorUser.userBtnInviteId);

    await sendAnInvite.click();
  }

  async checkCreateNewUser(name) {
    await this.notificationCheck();
    await this.checkCreateItem('.user-email', name);
  }

  async checkNewUser(emailNew, userPage) {
    await this.notificationCheck();

    this.endUsersNumber = await this.numberOfItems(this.driver);
    console.log(
      'number of useres before',
      this.startUsersNumber,
      'after',
      this.endUsersNumber,
      'user invited successfully'
    );

    try {
      if (this.startUsersNumber >= this.endUsersNumber) {
        throw new Error('user did not invite');
      }
      return;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async goToUserList(user = 'sa') {
    if (user === 'sa') {
      const companyBtn = await this.driver.findElement(locatorUser.userLinkUser);
      await companyBtn.click();
    } else {
      await this.driver.sleep(1000);
      const companyBtn = await this.driver.findElement(
        locatorUser.userLinkUserInProject
      );
      await companyBtn.click();
    }

    await this.driver.executeScript('return document.readyState');

    const numberOFUser = await this.numberOfItemsInTheList('.table-users__row');
    if (numberOFUser >= 20) {
      await this.driver.wait(
        until.elementLocated(locatorsCommon.baseAmountItems),
        10000
      );

      const paginationDropDown = await this.driver.findElement(
        locatorsCommon.baseAmountItems
      );
      await this.driver
        .actions()
        .scroll(0, 0, 0, 0, paginationDropDown)
        .perform();

      const totalEl = await this.driver
        .findElement(locatorsCommon.baseSelectPaginationText)
        .getText();
      const numberEl = totalEl.split(' ');
      const numberOfCompanies = Number(numberEl[numberEl.length - 1]);

      if (numberOfCompanies > 10) {
        await paginationDropDown.click();
        const paginationList = await this.driver.findElements(
          locatorsCommon.baseDropdownOption
        );
        await this.findDateInDropDown(paginationList, '100');
        await this.waitListDate('.company-name', 11);
      }
    }
  }

  async findUser(user, usersPage) {
    await this.driver.wait(until.urlContains(usersPage), 10000);
    let userForSearch = '';

    await this.driver.wait(until.elementsLocated(locatorUser.userUserEmailMenu), 10000);
    const allUsers = await this.driver.findElements(locatorUser.userUserEmailMenu);

    if (allUsers) {
      for (let i = 0; i < allUsers.length; i += 1) {
        userForSearch = await allUsers[i].getText();

        if (userForSearch === user) {
          const userListInfo = await this.driver.findElements(
           locatorsCommon.baseItemInfoList
          );
          const userMenu = await userListInfo[i].findElement(
            locatorsCommon.baseDotsActions
          );
          await userMenu.click();
          await this.driver.sleep(1000);
          return;
        }
      }

      throw new Error('No such user');
    }
  }

  async removefindUser() {
    const userDotMenu = await this.driver.findElement(
      locatorsCommon.baseDotMenuOpen
    );
    const removeBtn = await userDotMenu.findElement(locatorsCommon.baseDeleteItemId);
    await this.driver.wait(until.elementIsVisible(removeBtn), 10000);
    await this.driver.executeScript('return document.readyState');

    await removeBtn.click();
    const modal = this.driver.findElement(locatorsCommon.baseBackdropManual);
    await this.driver.wait(until.elementIsEnabled(modal), 10000);

    const delUserBtn = await this.driver.findElement(locatorsCommon.baseDelStatusProjectBtnId);

    await this.driver.wait(until.elementLocated(locatorsCommon.baseHtml), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);

    await delUserBtn.click();
  }

  async checkIfUserRemove(delemail, userPage) {
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseNotificationClass),
      10000
    );
    const windowHandles = await this.driver.findElement(
      locatorsCommon.baseNotificationClass
    );

    const windowHandlesText = await windowHandles.getText();
    console.log(windowHandlesText);

    if (windowHandlesText === 'Such user already exists') {
      throw new Error('You have error, check screenshot');
    }
    try {
      await this.driver.wait(until.urlContains(userPage), 10000);
      await this.checkDeleteItem('.user-email', delemail);
      return;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async openUserForm() {
    const userMenu = await this.driver.findElement(locatorUser.userProfileUserBtn);
    await userMenu.click();
    await this.driver.wait(until.elementLocated(locatorUser.userProfileLink), 10000);
    const profileBtn = this.driver.findElement(locatorUser.userProfileLink);
    await this.driver.wait(until.elementIsEnabled(profileBtn), 10000);
    await profileBtn.click();
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBtnEdit), 10000);
    const goToFormEditBtn = await this.driver.findElement(locatorsCommon.baseBtnEdit);
    await this.driver.wait(until.elementIsEnabled(goToFormEditBtn));

    await goToFormEditBtn.click();
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementLocated(locatorUser.userInputName, 10000));
    const nameInput = this.driver.findElement(locatorUser.userInputName);
    this.inputName = await nameInput.getAttribute('value');
  }

  async openUserMenuPage() {
    const userMenu = await this.driver.findElement(locatorUser.userProfileUserBtn);
    await userMenu.click();
    await this.driver.wait(until.elementLocated(locatorUser.userProfileLink), 10000);
    const profileBtn = this.driver.findElement(locatorUser.userProfileLink);
    await this.driver.wait(until.elementIsEnabled(profileBtn), 10000);
    await profileBtn.click();
    await this.driver.wait(until.elementLocated(locatorsCommon.baseBtnEdit), 10000);
    const goToFormEditBtn = await this.driver.findElement(locatorsCommon.baseBtnEdit);
    await this.driver.wait(until.elementIsEnabled(goToFormEditBtn), 10000);
    await this.driver.wait(
      until.elementLocated(locatorUser.userBtnChangePasword),
      10000
    );
    const changePasswordBtn = await this.driver.findElement(
      locatorUser.userBtnChangePasword
    );
    await this.driver.wait(until.elementIsEnabled(changePasswordBtn), 10000);
  }

  async updateAndCheck(
    user,
    closeForm = false,
    phone = false,
    email = false,
    notCheck = false
  ) {
    if (closeForm) {
      const userDotMenu = await this.driver.findElement(
        locatorsCommon.baseDotMenuOpen
      );
      const editBtn = await userDotMenu.findElement(locatorsCommon.baseEditItemId);
      await this.driver.wait(until.elementIsVisible(editBtn), 10000);
      await this.driver.executeScript('return document.readyState');

      await editBtn.click();
    }
    await this.driver.wait(until.elementLocated(locatorUser.userInputName), 10000);
    await this.driver.sleep(500);
    const newName = await InviteUser.nameChange(this.inputName, user);
    const nameInput = this.driver.findElement(locatorUser.userInputName);
    await nameInput.clear();
    await this.driver.sleep(500);
    await nameInput.sendKeys(newName);
    if (phone) {
      const phoneInput = this.driver.findElement(locatorUser.userPhoneId);
      await phoneInput.clear();
      await this.driver.sleep(500);
      await phoneInput.sendKeys(phone);
    }
    if (email) {
      const emailInput = this.driver.findElement(locatorUser.userInputEmail);
      await emailInput.clear();
      await this.driver.sleep(500);
      await emailInput.sendKeys(email);
    }
    const submitBtn = this.driver.findElement(locatorsCommon.baseSaveBtn);
    await this.driver.wait(until.elementIsEnabled(submitBtn));
    await submitBtn.click();
    // await this.driver.sleep(3000);
    if (notCheck) {
      return;
    }
    await this.driver.wait(
      until.elementLocated(locatorsCommon.baseNotificationClass),
      10000
    );

    const windowHandles = await this.driver.findElement(
      locatorsCommon.baseNotificationClass
    );
    await this.driver.wait(until.stalenessOf(windowHandles), 10000);

    const userMenuBtn = await this.driver.findElement(locatorUser.userProfileUserBtn);
    const userMenuName = await userMenuBtn.getText();

    await InviteUser.compareAnswer(userMenuName, newName);
  }
}

module.exports = InviteUser;
