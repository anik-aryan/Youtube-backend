import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.user._id
    if(!channelId){
        throw new ApiError(400,"Channel Id required.")
    } 

    const videos = await Video.find({owner : channelId})
    let videoCnt=0;
    let viewsCnt=0;
    if(videos.length > 0){
        videoCnt=videos.length
        viewsCnt = videos.reduce((acc, video) => acc + video.views, 0);
    }

    const subscribers = await Subscription.find({channel : channelId})
    let subCnt= subscribers.length

    const likes = await Like.find({likedBy : channelId})
    let likesCnt= likes.length
    
    return res.status(200).send(
        new ApiResponse(200,{
            likesCnt,
            viewsCnt,
            videoCnt,
            subCnt
        },"stats fetched successfully")
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const channelId = req.user._id
    if(!channelId){
        throw new ApiError(400,"Channel Id required.")
    }

    const videos = await Video.find({owner : channelId})
    if(videos.length===0){
        return res.status(200).send(
            new ApiResponse(200,{},"channel has not posted any videos")
        )
    }

    return res.status(200).send(
            new ApiResponse(200, videos ,"videos fetched successfully")
        )

})

export {
    getChannelStats, 
    getChannelVideos
    }