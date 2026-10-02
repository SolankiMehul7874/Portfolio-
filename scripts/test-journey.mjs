import { chromium } from 'playwright'

async function runTest() {
  console.log('Launching browser to test 10-stage TV journey...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  // Collect console errors
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })
  page.on('pageerror', (err) => {
    errors.push(err.message)
  })

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2000)

  console.log('Taking screenshot at 0% (Arrival / Hero)...')
  await page.screenshot({ path: 'test-artifacts-hero.png' })

  // Forward scroll progression testing through 10 stages
  const scrollSteps = [
    { target: 0.14, label: 'GitHub TV' },
    { target: 0.23, label: 'Project 01 (Prime News)' },
    { target: 0.31, label: 'Project 02 (Backend REST)' },
    { target: 0.39, label: 'Project 03 (ML Pipeline)' },
    { target: 0.46, label: 'Project 04 (Native Android)' },
    { target: 0.55, label: 'Academic Journey' },
    { target: 0.66, label: 'Experience (InfoLabz)' },
    { target: 0.77, label: 'Skills Constellation' },
    { target: 0.88, label: 'About Philosophy' },
    { target: 0.98, label: 'Final Contact TV' },
  ]

  for (const step of scrollSteps) {
    console.log(`Scrolling forward to ${step.label} (${Math.round(step.target * 100)}%)...`)
    await page.evaluate((progress) => {
      if (window.__lenis) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        window.__lenis.scrollTo(progress * maxScroll, { immediate: true })
      } else {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        window.scrollTo({ top: progress * maxScroll, behavior: 'instant' })
      }
    }, step.target)

    await page.waitForTimeout(600)
    await page.screenshot({ path: `test-artifacts-step-${Math.round(step.target * 100)}.png` })
  }

  // Reverse scroll testing
  console.log('Scrolling backward to 25%...')
  await page.evaluate(() => {
    if (window.__lenis) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      window.__lenis.scrollTo(0.25 * maxScroll, { immediate: true })
    }
  })
  await page.waitForTimeout(600)

  // Click to open technical dossier
  console.log('Testing Click-to-Detail modal...')
  const dossierBtn = page.locator('button:has-text("OPEN TECHNICAL DOSSIER")')
  if (await dossierBtn.isVisible()) {
    await dossierBtn.click()
    await page.waitForTimeout(400)
    await page.screenshot({ path: 'test-artifacts-dossier-open.png' })
    console.log('Closing modal...')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
  }

  // Perspective Toggle test (TPP -> FPP -> TPP)
  console.log('Testing FPP / TPP toggle...')
  await page.keyboard.press('KeyQ')
  await page.waitForTimeout(400)
  await page.screenshot({ path: 'test-artifacts-fpp.png' })

  await page.keyboard.press('KeyE')
  await page.waitForTimeout(400)
  await page.screenshot({ path: 'test-artifacts-tpp-returned.png' })

  console.log('Test completed successfully. Total console errors:', errors.length)
  if (errors.length > 0) {
    console.error('Errors encountered:', errors.slice(0, 5))
  }

  await browser.close()
}

runTest().catch((err) => {
  console.error('Failed test:', err)
  process.exit(1)
})
