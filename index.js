import { tweetsData } from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const tweetBtn = document.getElementById("tweet-btn")
const tweetFeed = document.getElementById("feed")

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

        tweetsData.unshift(newTweet)
        tweetInput.value = null
    }

    renderFeed()

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
    tweetsData.forEach(tweet => {
        if (tweet.uuid === tweetId) {
            const targetTweetObj = tweet
            if(tweet.isLiked) {
                targetTweetObj.likes--
            } else {
                targetTweetObj.likes++
            }
            targetTweetObj.isLiked = !targetTweetObj.isLiked
            renderFeed()
        }
    })
}

function handleRetweetClick(tweetId) {
    tweetsData.forEach(tweet => {
        if (tweet.uuid === tweetId) {
            const targetTweetObj = tweet
            if (tweet.isRetweeted) {
                targetTweetObj.retweets--
            } else {
                targetTweetObj.retweets++
            }
            targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
            renderFeed()
        }
    })
}

function handleReplyClick(tweetId) {
    document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
}


function getFeedHtml() {
    let feedHtml = ""

    tweetsData.forEach(tweet => {

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