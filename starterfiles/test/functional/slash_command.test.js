const puppeteer = require('puppeteer');
require('expect-puppeteer');
const utils = require('../helper/utils');

let page, browser;
const TIMEOUT = 50000 // 50 seconds

describe('Starter Test', () => {
    beforeAll(async () => {
      browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      page = await browser.newPage();
    });

    afterEach(async () => {
        await utils.cleanUp();
    });

    afterAll(async() => {
      await browser.close();
    });
  
    it('should be titled "Slack | Spec Test Bot | Slack Community" after logging in and opening DMs', async () => {
      // Log in
      await page.goto('https://community.slack.com');
      await expect(page).toFill('input[id="email"]', process.env.email, { timeout: TIMEOUT });
      await expect(page).toFill('input[id="password"]', process.env.password, { timeout: TIMEOUT });
      await expect(page).toClick('button[id="signin_btn"]', { timeout: TIMEOUT });

      // Click on Bot in side bar
      await page.waitForSelector(`a[data-qa-channel-sidebar-channel-id="${process.env.channel}"]`, { timeout: TIMEOUT });
      await expect(page).toClick(`a[data-qa-channel-sidebar-channel-id="${process.env.channel}"]`, { timeout: TIMEOUT });
      
      // Verify Page Title
      expect(await page.title()).toBe('Slack | Spec Test Bot | Slack Community');
    }, TIMEOUT);

    it('should respond with "Hello world!" after running /test_slash_command', async() => {
        // Execute Slash Command
        await expect(page).toFill('div[data-qa="message_input"]', '/test_slash_command', { timeout: TIMEOUT });
        await page.keyboard.press('Enter');
        await page.keyboard.press('Enter');

        //Validate Response
        await expect(page).toMatch('Hello world!', { timeout: TIMEOUT });
    });
})
