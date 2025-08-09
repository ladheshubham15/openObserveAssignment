import { test, expect } from '@playwright/test';
import LoginPage from '../support/UiHelper/supportFunctions/loginPage'
import LogsPage from '../support/UiHelper/supportFunctions/logsPage'
import DashboardPage from '../support/UiHelper/supportFunctions/dashboardPage';

test.describe('Dashboard Line Chart Automation', () => {

  test('Add and Configure Line Chart in Dashboard', async ({ page }) => {
    const loginFunc = new LoginPage(page)
    const logsFunc = new LogsPage(page)
    const dashboardFunc = new DashboardPage(page)
    const version = Math.random(0, 2000)
    const dashboardName = `Shubham Test Dashboard ${version}`
    const panelName = `Shubham Line Chart ${version}`
    const email = process.env.EMAIL
    const password = process.env.PASSWORD


    if(!email && !password){
      throw new Error('email,password not provided')
    }
    
    await loginFunc.login(email, password)
    // navigate to logs from menu and select the stream default
    await logsFunc.openLogsStream('default')

    await logsFunc.selectLineChart()
    //remove existing added item from y axis
    await logsFunc.removeSelectedField({
      fieldName: '_timestamp',
      sectionName: 'y'
    })

    //search for existing fields and add to graph param section
    await logsFunc.searchAndAddField({
      fieldName: 'log',
      lineGraphParamSection: 'y'
    })

    await logsFunc.searchAndAddField({
      fieldName: 'country',
      lineGraphParamSection: 'b'
    })
    // add line chart to dashboard
    await dashboardFunc.addToDashboard()
    // create new dashboard from line charts section
    await dashboardFunc.createNewDashboardFromChartSection({
      name: `Shubham Test Dashboard ${version}`,
      description: 'For Testing Purpose'
    })
    await dashboardFunc.setPanelTitle(panelName)

    // edit the dashboard to enable connect null values settings
    await dashboardFunc.editPanelAndToggleConnectNullValues(panelName)
    // verify if chart is getting displayed with valid details and canvas is loaded after connect null values setting enabled
    await dashboardFunc.verifyDashboardAndPanelDetails({
      dashboardName,
      panelName
    })

    // edit the dashboard to enable Others series
    await dashboardFunc.enableOthersSeries({
      panelName,
      topNseriesNumber: '5'
    })

    // verify if chart is getting displayed with valid details and canvas is loaded after others series enabled
    await dashboardFunc.verifyDashboardAndPanelDetails({
      dashboardName,
      panelName
    })

    // verify if others series is applied or not on line chart with the help of screenshot of canvas and pasring canvas text
    const text = await dashboardFunc.getTextFromElementScreenshot()
    expect(text).toContain('others')
  })
})