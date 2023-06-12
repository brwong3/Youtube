const express = require('express')
const puppeteer = require('puppeteer');

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/search/:searchTerm/', async(req,res) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();


    await page.goto(`https://www.youtube.com/results?search_query=${req.params.searchTerm}`)

    /*TODO:
        Get Title
        Get Link
        Get Artist
        Get Thumbnail
        Get Length of Video
    */

    await page.evaluate(() => 
        scrollTo(0, 500)
    )

    try {
        let scrapedData = await page.evaluate(() => 
        Array.from(document.querySelectorAll("div#dismissible.ytd-video-renderer"))
            .map(element => {
                return {
                    Thumbnail: element.querySelector("ytd-thumbnail > a > yt-image > img").getAttribute("src"),
                    Title: element.querySelector(".text-wrapper > #meta > #title-wrapper > h3 > a").getAttribute("title"),
                    Artist: element.querySelector(".text-wrapper > #channel-info > ytd-channel-name > #container > #text-container > yt-formatted-string > a").textContent,
                    Link: `https://youtube.com${element.querySelector("ytd-thumbnail > a").getAttribute("href")}`,
                    Length: null
                }
            })
        )
        res.send(scrapedData);
    } catch (error) {
        res.status(404);
    }
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})