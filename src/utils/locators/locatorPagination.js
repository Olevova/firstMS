const { By } = require('selenium-webdriver');

module.exports = {
  paginationListItem: By.css('.pagination-list__item:not(.hidden)'),
  paginationBtnNextPageId: By.id('btnNextPage'),
  paginationSelectAmountItemsId: By.id('selectAmountItems'), 
};