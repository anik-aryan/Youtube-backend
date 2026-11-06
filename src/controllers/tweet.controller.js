import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    const userId= req.user._id

     if (!userId) {
        throw new ApiError(401, "Unauthorized: User ID missing");
    }

    if (!content || typeof content !== 'string' || content.trim() === "") {
        throw new ApiError(400, "Tweet content is required and must be a non-empty string");
    }

    const tweet = await Tweet.create({
        content : content.trim(),
        owner : userId
    })

    if(!tweet){
        throw new ApiError(500, "tweet creation failed!")
    }

    return res.status(201).send(
        new ApiResponse(201,tweet,"tweet created successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.user._id
    const tweets = await Tweet.find({owner:userId})

    if(tweets.length === 0){
        throw new ApiError(404, "tweets not found!")
    }

    return res.status(200).send(
        new ApiResponse(200,tweets,"tweets fetched successfully!")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content} = req.body
    
    if(!content || !tweetId){
        throw new ApiError(404 , "content or tweetId is missing")
    }

    const tweet= await Tweet.findByIdAndUpdate(tweetId,
        { content },
        { new: true } )

    if(!tweet){
        throw new ApiError(404,"no such tweet")
    }

    return res.status(200).send(
        new ApiResponse(200, tweet, "tweet updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} =req.params
    if(!tweetId){
        throw new ApiError(400, "tweet Id is required!")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
    if (!deletedTweet) {
    throw new ApiError(404, "No tweet found with the given ID");
    }

    return res.status(200).send(
        new ApiResponse(200, deletedTweet,"tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}