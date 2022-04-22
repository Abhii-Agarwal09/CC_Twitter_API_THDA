const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const axios = require('axios');

const boilerHtml = () => {
    const html = `
        <h1 style="font-family: sans-serif;">Abhishek Agarwal</h1>
        <h3 style="font-family: sans-serif;">Reg. No. - 20BDS0070</h3>
        <p style="font-family: sans-serif;">Twitter API functionalities</p>
        <br>
        <br>
    `;
    return html;
};

const landingPageHTML = `
    ${boilerHtml()}
    <a style="font-family: sans-serif;" href="/tweet">Get tweet by ID (Id used - 1278747501642657792)</a>
    <br>
    <br>
    <a style="font-family: sans-serif;" href="/recent">Get recent top tweets</a>
    <br>
    <br>
    <a href="/users" style="font-family: sans-serif;">Get users by username</a>
`;

const tweetPageHTML = (text) => {
    const html = `
        ${boilerHtml()}
        <div style="font-family: sans-serif;">
            <h2 style="font-family: sans-serif;">Tweet received using the id 1278747501642657792</h2>
            <div style="font-family: sans-serif;">
                <p style="font-weight: bold; font-size: 20px; font-family: sans-serif;">Tweet text</p>
                <p style="font-family: sans-serif;">${text}</p>
            </div>
        </div>
        <br>
        <br>
        <a style="font-family: sans-serif;" href="/">Go back</a>
    `;
    return html;
};

const recentTweetHTML = (tweets) => {
    let html = `
        ${boilerHtml()}
    `;
    tweets.forEach((tweet, index) => {
        let tweetHtml = `
            <div style="border: 2px solid black; margin: 1rem 0; font-family: sans-serif;">
            <h2>Tweet ${index + 1}</h2>
            <div>
                <p style="font-weight: bold; font-size: 20px; font-family: sans-serif;">Tweet text</p>
                <p style="font-family: sans-serif">${tweet.text}</p>
            </div>
        </div>
        `;
        html = html.concat(tweetHtml);
    });
    html = html.concat(
        '<a style="font-family: sans-serif;" href="/">Go back</a>'
    );
    return html;
};

const usersPageHTML = (users) => {
    let html = `
        ${boilerHtml()}
    `;
    users.forEach((user, index) => {
        let userHtml = `
        <div style="border: 2px solid black; margin: 0.5rem 0;">
            <p style="font-family: sans-serif; font-size: 1rem">User ${
                index + 1
            }</p>
            <p style="font-family: sans-serif; font-size: 1rem">Name - ${
                user.name
            }</p>
            <p style="font-family: sans-serif; font-size: 1rem">Username - ${
                user.username
            }</p>
            <p style="font-family: sans-serif; font-size: 1rem">User id - ${
                user.id
            }</p>
        </div>
        `;
        html = html.concat(userHtml);
    });
    html = html.concat(
        '<a style="font-family: sans-serif;" href="/">Go back</a>'
    );
    return html;
};

const getTweets = async (req, res) => {
    const result = await axios.get(
        'https://api.twitter.com/2/tweets/1278747501642657792',
        {
            headers: {
                authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            },
        }
    );
    const html = tweetPageHTML(result.data.data.text);
    res.send(html);
};

const getTopTweets = async (req, res) => {
    const recentTweets = await axios.get(
        'https://api.twitter.com/2/tweets/search/recent?query=from:TwitterDev',
        {
            headers: {
                authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            },
        }
    );
    const html = recentTweetHTML(recentTweets.data.data);
    res.send(html);
};

const getUsersByUsername = async (req, res) => {
    const result = await axios.get(
        'https://api.twitter.com/2/users/by?usernames=abhii__agarwal,Prathkum,csaba_kissi&user.fields=created_at&expansions=pinned_tweet_id&tweet.fields=author_id,created_at',
        {
            headers: {
                authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            },
        }
    );
    const html = usersPageHTML(result.data.data);
    console.log(result.data.data);
    res.send(html);
};

app.get('/', (req, res) => {
    res.send(landingPageHTML);
});

app.get('/tweet', (req, res) => {
    getTweets(req, res);
});

app.get('/recent', (req, res) => {
    getTopTweets(req, res);
});

app.get('/users', (req, res) => {
    getUsersByUsername(req, res);
});

app.listen(3000, () => console.log('listening on port 3000'));
