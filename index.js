import { tweetsData } from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

const tweetBtn = document.getElementById("tweet-btn")
const tweetFeed = document.getElementById("feed")

let storedData = []

if (localStorage.getItem('tweetsLocalData')) {
    storedData = JSON.parse(localStorage.getItem("tweetsLocalData"))
} else {
    storedData = tweetsData
}

function saveToLocalStore() {
    localStorage.setItem('tweetsLocalData', JSON.stringify(storedData))
}

tweetBtn.addEventListener('click', function() {
    const tweetInput = document.getElementById('tweet-input')
    if (tweetInput.value) {
        const newTweet = {
            handle: '@Scrimba',
            profilePic: 'images/scrimbalogo.png',
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
        }

        storedData.unshift(newTweet)
        tweetInput.value = null
    }
    renderFeed()
    saveToLocalStore()
})

document.addEventListener('click', function(event) {
    
    if (event.target.dataset.like) {
        handleLikeClick(event.target.dataset.like)
    } else if (event.target.dataset.retweet) {
        handleRetweetClick(event.target.dataset.retweet)
    } else if (event.target.dataset.reply) {
        handleReplyClick(event.target.dataset.reply)
    }

})

function handleLikeClick(tweetId) {
    storedData.forEach(tweet => {
        if (tweet.uuid === tweetId) {
            const targetTweetObj = tweet
            if(tweet.isLiked) {
                targetTweetObj.likes--
            } else {
                targetTweetObj.likes++
            }
            targetTweetObj.isLiked = !targetTweetObj.isLiked
            renderFeed()
            saveToLocalStore()
        }
    })
}

function handleRetweetClick(tweetId) {
    storedData.forEach(tweet => {
        if (tweet.uuid === tweetId) {
            const targetTweetObj = tweet
            if (tweet.isRetweeted) {
                targetTweetObj.retweets--
            } else {
                targetTweetObj.retweets++
            }
            targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
            renderFeed()
            saveToLocalStore()
        }
    })
}

function handleReplyClick(tweetId) {
    const tweetReplies = document.getElementById(`replies-${tweetId}`)
    tweetReplies.classList.toggle('hidden')

    const replyInput = document.getElementById(`reply-input-${tweetId}`)
    const replySubmit = document.getElementById(`reply-btn-${tweetId}`)
    

    replySubmit.addEventListener("click", function() {
        const newReply = {
            handle: '@Scrimba',
            profilePic: 'images/scrimbalogo.png',
            tweetText: replyInput.value,
        }

        if (replyInput.value) {

            storedData.forEach(tweet => {
                if (tweet.uuid === tweetId) {
                    const targetTweetObj = tweet
                    targetTweetObj.replies.unshift(newReply)
                }
            })
            
            replyInput.value = null
        }
        renderFeed()
        handleReplyClick(tweetId)
        saveToLocalStore()
    })
}

function getFeedHtml() {
    let feedHtml = ""

    storedData.forEach(tweet => {

        let likeIconCLass = tweet.isLiked ? "liked" : ""
        let retweetIconClass = tweet.isRetweeted ? "retweeted" : ""

        let repliesHtml = ''

        if (tweet.replies.length) {
            tweet.replies.forEach(reply => {
                repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
                </div>`
            })
            repliesHtml += `
            <div class="tweet-reply" id="reply-form">
                <textarea class="tweet-reply-area" id="reply-input-${tweet.uuid}" placeholder="Reply to tweet"></textarea>
                <button class="reply-btn" id="reply-btn-${tweet.uuid}">Reply</button>
            </div>`
        } else {
            repliesHtml = `
            <div class="tweet-reply" id="reply-form">
                <textarea class="tweet-reply-area" id="reply-input-${tweet.uuid}" placeholder="Reply to tweet"></textarea>
                <button class="reply-btn" id="reply-btn-${tweet.uuid}">Reply</button>
            </div>`
        }




        feedHtml += `
        <div class="tweet">
        <div class="tweet-inner">
            <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                        <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                        <i class="fa-regular fa-heart ${likeIconCLass}" data-like="${tweet.uuid}"></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
            </div>   
        </div>`
    })

    return feedHtml
}

function renderFeed() {

    tweetFeed.innerHTML = getFeedHtml()
}

renderFeed()