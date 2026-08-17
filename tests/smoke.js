const { chromium } = require("playwright");
const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", error => errors.push(`pageerror: ${error.message}`));
  page.on("console", message => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });

  const appUrl = pathToFileURL(path.resolve(__dirname, "..", "index.html")).href;
  await page.goto(appUrl);
  await page.screenshot({ path: path.resolve(__dirname, "..", "career-compass-preview.png"), fullPage: true });

  await page.getByRole("button", { name: /start my compass/i }).click();

  for (let step = 0; step < 14; step += 1) {
    const cards = page.locator("fieldset.question-card");
    const count = await cards.count();
    if (!count) throw new Error(`No questions rendered at step ${step + 1}`);

    for (let index = 0; index < count; index += 1) {
      const card = cards.nth(index);
      const name = await card.locator("input").first().getAttribute("name");
      let value = 4;
      if (name.startsWith("i")) {
        const number = Number(name.slice(1));
        value = [2, 5, 4, 3, 2, 4][(number - 1) % 6];
      }
      await card.locator(`input[value="${value}"]`).evaluate(input => {
        input.checked = true;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }
    await page.locator("#next-button").click();
  }

  await page.waitForSelector("#results-title");
  const activeAfterResults = await page.evaluate(() => {
    const skip = document.querySelector(".skip-link");
    return {
      tag: document.activeElement?.tagName,
      id: document.activeElement?.id,
      className: document.activeElement?.className,
      skipTop: getComputedStyle(skip).top,
      skipFocusVisible: skip.matches(":focus-visible")
    };
  });
  const code = await page.locator(".code-stack strong").textContent();
  if (code !== "IAC") throw new Error(`Unexpected interest code: ${code}`);
  if (await page.locator(".recommendation-card").count() !== 4) throw new Error("Expected four recommendation cards");
  if (await page.locator(".trait-card").count() !== 5) throw new Error("Expected five personality cards");
  await page.screenshot({ path: path.resolve(__dirname, "..", "career-compass-results.png"), fullPage: true });

  await page.reload();
  const resumeLabel = await page.locator("#start-button").innerText();
  if (!/View my saved compass/i.test(resumeLabel)) throw new Error("Completed results were not persisted");
  await page.locator("#start-button").click();
  await page.waitForSelector("#results-title");

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await mobile.goto(appUrl);
  const bodyWidth = await mobile.evaluate(() => document.body.scrollWidth);
  if (bodyWidth > 390) throw new Error(`Mobile page overflows horizontally: ${bodyWidth}px`);
  await mobile.screenshot({ path: path.resolve(__dirname, "..", "career-compass-mobile.png"), fullPage: true });

  if (errors.length) throw new Error(errors.join("\n"));
  console.log(JSON.stringify({ ok: true, code, pages: 14, recommendations: 4, mobileWidth: bodyWidth, activeAfterResults }));
  await browser.close();
})().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
