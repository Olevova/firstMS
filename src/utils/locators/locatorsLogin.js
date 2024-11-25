const { By } = require('selenium-webdriver');

module.exports = {
    authForm: By.css('form'),
    authEmailId: By.id('email'),
    authPasswordId: By.id('password'),
    authBtnSubmitId: By.id('btn-submit'),
    authForgotPasswordId: By.id('linkForgotPassword'),
    authCancelId: By.id('linkCancel'),
    authMainErrorId: By.id('mainErrorText'),
    authBtnChangePasswordCss: By.css('#btnChangePassword'),
    authCurrentPasswordId: By.id('currentPassword'),
    authNewPasswordId: By.id('newPassword'),
    authConfirmPasswordId: By.id('confirmPassword'),
    authProfileUserBtnId: By.id('profileUserBtn'),
    authBtnLogoutId: By.id('btnLogout'),
    authCheckBoxClass: By.className('checkbox'),
    authVersionTextCss: By.css('.version-text')
};
