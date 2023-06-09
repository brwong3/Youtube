const express = require('express')
const puppeteer = require('puppeteer');

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/search/:searchTerm', async(req,res) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`https://www.youtube.com/results?search_query=${req.params.searchTerm}`)

    const scrapedData = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.ytd-video-renderer #video-title'))
      .map(link => ({
        title: link.getAttribute('title'),
        link: link.getAttribute('href')
      }))
      .slice(0, 10)
  )

    res.send(scrapedData)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})