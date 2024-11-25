const { By } = require('selenium-webdriver');
module.exports = {
    
    taskBtnDeleteTask: By.id('btnDeleteTask'),
    taskFileNameWithTimeLeft: By.css('.fileName-with-timeLeft'),
    taskFilterByStatusId: By.id('filterByStatus'),
    taskFlterByStatus: By.css('#filterByStatus[formcontrolname="status"]'),
    taskFilesList: By.css('.files-list'),
    taskItemInfoList: By.css('.item-info-list'),
    taskLabelSearch: By.className('label-search'),
    taskPrioritySelectMobile: By.id('prioritySelectMobile'),
    taskDescriptionMobile: By.id('taskDescriptionMobile'),
    taskDueDate: By.id('taskDueDate'),
    taskId: By.className('task-id'),
    taskTabId:By.id('tasksTab'),
    taskName: By.className('task-name'),
    taskNameMobile: By.id('taskNameMobile'),
    taskSelectMemberMobile: By.id('taskSelectMemberMobile'),
    taskStatusMenu: By.className('task-status-menu'),
    taskStatusMenuItem: By.className('task-status-menu__item'),
    taskStatusTd: By.className('task-status-td'),
    taskStatusTdOpenMenu: By.css('.task-status-td[openmenu]'),
    taskTaskIdList: By.css('.task-id .list-name-wrapper'),
    taskTaskNameList: By.css('.task-name .list-name-wrapper'),
    tableSortIconBtn: By.className('table-sort-icon-btn'),
    tabListItem: By.className('tab-list__item'),
    taskMember:By.className('task-members'),
    taskTableRowTaskName: By.css('.table-tasks__row .task-name')
    
  };