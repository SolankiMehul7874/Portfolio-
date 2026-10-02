import { chromium } from 'playwright'

async function runTest() {
  console.log('Launching browser to test 10-stage TV journey with natural scrolling...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2000)

  // Smooth incremental scroll simulating real user scrolling
  async function smoothScrollTo(targetProgress) {
    await page.evaluate((target) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (window.__lenis) {
        window.__lenis.scrollTo(target * maxScroll, { duration: 0.8 })
      } else {
        window.scrollTo({ top: target * maxScroll, behavior: 'smooth' })
      }
    }, targetProgress)
    await page.waitForTimeout(1100) // allow character & camera lerp to settle completely
  }

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
    console.log(`Smooth scrolling to ${step.label} (${Math.round(step.target * 100)}%)...`)
    await smoothScrollTo(step.target)
    await page.screenshot({ path: `test-artifacts-settled-${Math.round(step.target * 100)}.png` })
  }

  console.log('Testing reverse scroll to Project 01...')
  await smoothScrollTo(0.23)
  await page.screenshot({ path: 'test-artifacts-settled-reverse-23.png' })

  console.log('All settled screenshots written successfully.')
  await browser.close()
}

runTest().catch((err) => {
  console.error(err)
  process.exit(1)
})
