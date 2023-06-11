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

    /*TODO:
        Get Title
        Get Link
        Get Artist
        Get Thumbnail
        Get Length of Video
    */

    // let scrapedArtists = await page.evaluate(() => 
    //     Array.from(document.querySelectorAll("[id=dismissile] >.style-scope.ytd-channel-name > .yt-simple-endpoint.style-scope.yt-formatted-string"))
    //         .map(link => {
    //             return link.textContent;
    //         })    
    // )

    // let scrapedData = await page.evaluate(() =>
    //     Array.from(document.querySelectorAll('.ytd-video-renderer #video-title'))
    //         .map(link => 
    //         {
    //             return {
    //                 Title: link.getAttribute('title'),
    //                 Link: `https://www.youtube.com${link.getAttribute('href')}`,
    //             }
    //         })
    //         .slice(0, 30)
    // ) 

    await scrollPageToBottom(page);

    let scrapedData = await page.evaluate(() => 
        Array.from(document.querySelectorAll("div#dismissible"))
            .map(element => {
                return {
                    Thumbnail: element.querySelector("ytd-thumbnail > a > yt-image > img").getAttribute("src")
                }
            })
            .slice(0,20)
    )
    

    res.send(scrapedData)
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})