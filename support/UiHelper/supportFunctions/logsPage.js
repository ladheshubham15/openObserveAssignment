import { logPageLocators } from "../locators/logsPageLocators";
export default class LogsPage {
  constructor(page) {
    this.page = page;
  }

  async openLogsStream(stream) {
    await this.page.locator(logPageLocators.logsMenu).click()
    await this.page.locator(logPageLocators.streamSelect).click()
    await this.page.locator(logPageLocators.streamOption).getByText(stream).click()
  }

  async selectLineChart() {
    await this.page.waitForLoadState('networkidle')
    await this.page.locator(logPageLocators.visualizeToggle).click()
    await this.page.locator(logPageLocators.lineChartItem).click()
  }

  async removeSelectedField({fieldName,sectionName}) {
    await this.page.locator(`[data-test="dashboard-${sectionName}-item-${fieldName}-remove"]`).click()
  }


  async searchAndAddField({fieldName, lineGraphParamSection}) {
    await this.page.locator(logPageLocators.fieldSearch).clear()
    await this.page.locator(logPageLocators.fieldSearch).fill(fieldName)
    await this.page.locator(`[data-test="field-list-item-logs-default-${fieldName}"] [data-test="dashboard-add-${lineGraphParamSection}-data"]`).click()
  }
}
