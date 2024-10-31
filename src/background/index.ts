import { Client } from "@notionhq/client"
import { tweet2Markdown, tweet2NotionBlock } from "@src/app/utils/export"

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
}) 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkInstallation") {
    // 直接回复 content script
    sendResponse({ isInstalled: true })
  }
  if (request.action === "createNotionPage") {
    const tweetInfos = request.data

    tweetInfos.forEach((tweetInfo) => {
      const tweetNotionBlocks = tweet2NotionBlock(tweetInfo)
      console.log("================tweetInfo=============")
      console.log(tweetNotionBlocks)

      notion.pages
        .create({
          parent: { database_id: process.env.NOTION_DATABASE_ID },
          properties: {
            Author: {
              rich_text: [
                {
                  text: { content: tweetInfo.username }
                }
              ]
            }
          },
          children: tweetNotionBlocks
        })
        .then((response) => {
          sendResponse({ success: true, data: response })
        })
        .catch((error) => {
          console.error(error)
          sendResponse({ success: false, error: error.message })
        })
    })

    return true
  }
})

chrome.runtime.onInstalled.addListener(function (details) {
  console.log("onInstalled", details)
  if (details.reason == "install") {
    chrome.tabs.create({ url: "https://x-cards.net/welcome" })
  }
})
