const {By} = require('selenium-webdriver');

module.exports = {
 
  companyNameMobile: By.id('companyNameMobile'),
  companyAddressMobile: By.id('companyAddressMobile'),
  companyAddressSecond: By.id('companyAddressSecond'),
  companyState: By.id('companyState'),
  companyCity: By.id('companyCity'),
  companyZipCode: By.id('companyZipCode'),
  companyPhone: By.id('companyPhone'),
  companyEmail: By.id('companyEmail'),
  companyPlan: By.id('companyPlan'),
  subdomainName: By.id('subdomainName'),
  companyType: By.id('companyType'),
  companyPlanMaxNumberUsers: By.id('companyPlanMaxNumberUsers'),
  companyDeleteBtn: By.id('btnDeleteCompanyOpenModal'),
  linkCompanies: By.id('linkCompanies'),
  linkCompanySettings: By.id('linkCompanySettings'),
  companyFilterStateElevent: By.css(".filter-field-wrapper [placeholder='Add State']"),
  companyFilterTypeElement: By.css(".filter-field-wrapper [placeholder='Add Type']"),
  companyWindowHeader: By.xpath("//h1[@class='sub-header__title']"),
  createProjectButton: By.id('btnCreate'),
};


