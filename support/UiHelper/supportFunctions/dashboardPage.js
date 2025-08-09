import { expect } from '@playwright/test';
import { dashBoardLocators } from "../locators/dashboardPageLocators"
import { logPageLocators } from "../locators/logsPageLocators"
const Tesseract = require('tesseract.js')

export default class DashboardPage {
    constructor(page) {
        this.page = page;
    }

    async addToDashboard() {
        await this.page.locator(dashBoardLocators.addToDashboardButton).click()
    }

    async createNewDashboardFromChartSection({ name, description }) {
        await this.page.locator(dashBoardLocators.newDashboardButton).click()
        await this.page.locator(dashBoardLocators.dashboardName).fill(name)
        await this.page.locator(dashBoardLocators.dashboardDescription).fill(description)
        await this.page.locator(dashBoardLocators.dashboardSubmit).click()
    }

    async setPanelTitle(title) {
        await this.page.locator(dashBoardLocators.panelTitle).fill(title)
        await this.page.locator(dashBoardLocators.updateSettingsButton).click()
    }

    async clickOnEditDashboardDropDown(panelName) {
        await this.page.locator(`[data-test="dashboard-edit-panel-${panelName}-dropdown"]`).click();
    }

    async editPanelAndToggleConnectNullValues(panelName) {
        await this.clickOnEditDashboardDropDown(panelName)
        await this.page.locator(dashBoardLocators.EditPanelOption).click()
        await this.page.locator(dashBoardLocators.sidebar).click()
        await this.page.locator(logPageLocators.lineChartItem).click()
        await this.page.locator(dashBoardLocators.connectNullValuesToggle).first().click();
        await this.page.locator(dashBoardLocators.applyButton).click()
        await this.page.locator(dashBoardLocators.savePanelButton).click()
    }

    async enableOthersSeries({ panelName, topNseriesNumber }) {
        await this.clickOnEditDashboardDropDown(panelName)
        await this.page.locator(dashBoardLocators.EditPanelOption).click()
        await this.page.locator(dashBoardLocators.sidebar).click()
        await this.page.locator(logPageLocators.lineChartItem).click()
        await this.page.locator(dashBoardLocators.topNSeriesField).fill(topNseriesNumber)
        await this.page.locator(dashBoardLocators.addOtherSeriesToggle).click()
        await this.page.locator(dashBoardLocators.applyButton).click()
        await this.page.locator(dashBoardLocators.savePanelButton).click()
    }

    async verifyDashboardAndPanelDetails({ dashboardName, panelName }) {
        await expect(this.page.locator('[data-test="dashboard-panel-bar"]')).toContainText(panelName)
        await expect(this.page.locator('[class*="q-table__title"]').last()).toContainText(dashboardName)
        const canvas = await this.page.locator('canvas').first()
        await expect(canvas).toBeVisible()
    }

     async getTextFromElementScreenshot() {
        const lang = 'eng'
        const tempPath = 'canvas_screenshot.png';

        // Capture only element screenshot
        const elementLocator = await this.page.locator('canvas').first()
        await elementLocator.screenshot({ path: tempPath });

        // Run OCR on the screenshot
        const { data: { text } } = await Tesseract.recognize(tempPath, lang)

        return text.trim()
    }
}
