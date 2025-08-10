import { expect } from '@playwright/test'
import {loginLocators} from '../locators/loginPageLocators'

export default class LoginPage {
  constructor(page) {
    this.page = page
  }

  async goto() {
    await this.page.goto('/web/login')
  }

  async login(username, password) {
    this.goto()
    await this.page.locator(loginLocators.userIdField).fill(username)
    await this.page.locator(loginLocators.passwordField).fill(password)
    await this.page.locator(loginLocators.loginButton).click()
    await expect(this.page.locator('[data-test="menu-link-/logs-item"]')).toBeVisible()
  }
}
