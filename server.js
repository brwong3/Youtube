const express = require('express')
const puppeteer = require('puppeteer');

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/search/:searchTerm/:number', async(req,res) => {

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

    async function autoScroll(page, scroll_number) {
        await page.evaluate(async (scroll_number) => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const timer = setInterval(() => {
                    const scrollHeight = window.innerHeight * scroll_number;
                    window.scrollBy(0, window.innerHeight);
                    totalHeight += window.innerHeight;
                    if (totalHeight > scrollHeight) {
                        clearInterval(timer);
                            resolve(true);
                    }
                }, 100);
                });
        }, scroll_number);
    }

    await autoScroll(page, 12)
    //ytd-thumbnail > #thumbnail > #overlays

    try {
        let scrapedData = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("div#dismissible.ytd-video-renderer"))
                .map(element => {
                    return {
                        Thumbnail: element.querySelector("ytd-thumbnail > a > yt-image > img").getAttribute("src"),
                        Title: element.querySelector(".text-wrapper > #meta > #title-wrapper > h3 > a").getAttribute("title"),
                        Artist: element.querySelector(".text-wrapper > #channel-info > ytd-channel-name > #container > #text-container > yt-formatted-string > a").textContent,
                        Link: `https://youtube.com${element.querySelector("ytd-thumbnail > a").getAttribute("href")}`,
                        //Length: element.querySelector("ytd-thumbnail > #thumbnail > #overlays > ytd-thumbnail-overlay-time-status-renderer > span").textContent
                    }
                })}
            )
            res.send(scrapedData.slice(0, req.params.number));
    } catch (error) {
        res.status(404);
    }
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})