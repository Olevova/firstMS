const { By } = require('selenium-webdriver');

module.exports = {
  dashCompanyTable:By.css('app-dashboard-companies-table'),
  dashProjectTable:By.css('app-dashboard-projects-table'),
  dashTaskTable: By.css('app-dashboard-tasks-table'),
  dashCompaniesTableRow: By.css('app-dashboard-companies-table .table-companies__row'),
  dashProjectsTableRow: By.css('app-dashboard-projects-table .table-projects__row'),
  dashTasksTableRow: By.css('app-dashboard-tasks-table .table-tasks__row'),
  dashRowCompanies: By.css('.table-companies__row'),
  dashRowProjects: By.css('.table-projects__row'),
  dashCompanyId: By.css('.table-companies__row .company-id'),
  dashCompanyName: By.css('.table-companies__row .company-name'),
  dashProjectId: By.css('.table-projects__row .company-id'),
  dashProjectName: By.css('.table-projects__row .company-name'),
  dashTaskId: By.css('.table-tasks__row .task-id'),
  dashTaskName: By.css('.table-tasks__row .task-name'),
  dashTotalStatistic: By.css('.total-statistic'),
  dashTotalStatisticAmount: By.css('.total-statistic-amount'),
  dashCompanySidebarName: By.css('.company-name.company-name-sidebar'),
  dashProjectActiveLink: By.css('.project-list-link.nav-list__link--active'),
  dashTaskNameMobile: By.css('.backdrop .form-invite #taskNameMobile'),
  dashTableLink: By.css('.settings-wrapper__header .table-link'),
  dashCompanyNumberLabel: By.xpath("//p[@class='total-statistic'][contains(text(),'Total Companies')]/span[2]"),
  dashProjectNumberLabel: By.xpath("//p[@class='total-statistic'][contains(text(),'Total  Open Projects')]/span[2]"),
  dashProjectTasksLabel: By.xpath("//p[@class='total-statistic'][contains(text(),'My Open Tasks')]/span"),
  dashSeeAllCompaniesLink: By.xpath("//a[contains(text(),'See All Companies')]"),
  dashSeeAllProjectsLink: By.xpath("//a[contains(text(),'See All Projects')]"),
  dashGreetingsText: By.className('greeting'),
  dashGreetingsDateText: By.className('time-wrapper'),


}