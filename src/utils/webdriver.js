const { Builder, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const ltCapabilite = require('../../capabilities');

const USERNAME = ltCapabilite.capability['LT:Options'].username;
const KEY = ltCapabilite.capability['LT:Options'].accessKey;
const GRID_HOST = 'hub.lambdatest.com/wd/hub';
const gridUrl = 'https://' + USERNAME + ':' + KEY + '@' + GRID_HOST;
const isRunningInTeamCity = process.env.RUNNING_IN_TEAMCITY === 'true';
const isRunningInDocker = process.env.RUNNING_IN_DOCKER === 'true';
const withoutLambda = process.env.RUNNING_WITHOUT_VIDEO === 'true';
const browsers = [{ browser: 'Chrome', bVersion: '126', os: 'Windows 10' }];
let inDocker = false;

async function createWebdriverChrom() {
  let driver;
  try {
    if ((isRunningInTeamCity || isRunningInDocker) && !withoutLambda) {
      console.log('running in docker or on teamcity');
      console.log(process.env, 'env');
      ltCapabilite.capability.browserName = browsers[0].browser;
      ltCapabilite.capability.browserVersion = browsers[0].bVersion;
      ltCapabilite.capability['LT:Options'].platformName = browsers[0].os;
      driver = await new Builder()
        .usingServer(gridUrl)
        .withCapabilities(ltCapabilite.capability)
        .build();
      return driver;
    } else if (withoutLambda) {
      console.log(withoutLambda, 'without video');
      const options = new chrome.Options();
      options.addArguments('--incognito');
      options.addArguments('--start-maximized');
      options.addArguments('--private');
      driver = await new Builder()
        .forBrowser('chrome')
        .usingServer('http://selenium-hub:4444/wd/hub')
        .setChromeOptions(options)
        .build();
      return driver;
    } else {
      inDocker = true;
      if (process.platform === 'darwin') {
        driver = await new Builder()
          .forBrowser('safari')
          .setChromeOptions(options)
          .build();
        return driver;
      }
      const options = new chrome.Options();
      options.addArguments('--incognito');
      options.addArguments('--start-maximized');
      options.addArguments('--private');
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
      return driver;
    }
  } catch (error) {
    console.log(error, 'error');
    const options = new chrome.Options();
    options.addArguments('--incognito');
    options.addArguments('--start-maximized');
    options.addArguments('--private');
    driver = await new Builder()
      .forBrowser('chrome')
      .usingServer('http://selenium-hub:4444/wd/hub')
      .setChromeOptions(options)
      .build();
    inDocker = true;
    return driver;
  }
}

module.exports = {
  createWebdriverChrom,
  isRunningInDocker,
  isRunningInTeamCity,
  inDocker,
};
