import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(404,"userId required")
    }
    const existedLike= await Like.findOne({video : videoId, likedBy :  userId})

    if(!existedLike){
        await Like.create({video : videoId, likedBy :  userId})
    }else{
        await Like.deleteOne({video : videoId, likedBy :  userId})
    }

    return res.status(200).send(
        new ApiResponse(200,{},"Like toggled successfully")
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(404,"userId required")
    }
    const existedLike= await Like.findOne({comment : commentId, likedBy :  userId})

    if(!existedLike){
        await Like.create({comment : commentId, likedBy :  userId})
    }else{
        await Like.deleteOne({comment : commentId, likedBy :  userId})
    }

    return res.status(200).send(
        new ApiResponse(200,{},"Like toggled successfully")
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(404,"userId required")
    }
    const existedLike= await Like.findOne({tweet : tweetId, likedBy :  userId})

    if(!existedLike){
        await Like.create({tweet : tweetId, likedBy :  userId})
    }else{
        await Like.deleteOne({tweet : tweetId, likedBy :  userId})
    }

    return res.status(200).send(
        new ApiResponse(200,{},"Like toggled successfully")
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id
    const existedLike = await Like.find({ likedBy: userId }).populate("video");

    let videos = [];
    existedLike.forEach((like)=>{
        if(like.video){
            videos.push(like.video)
        }
    });

    return res.status(200).send(
        new ApiResponse(200,videos,"liked videos fetched successfully")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}