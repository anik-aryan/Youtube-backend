import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = '', sortBy='createdAt', sortType='desc', userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const videos = await Video.find()?.sort({[sortBy]:sortType})
    if(!videos){
        throw new ApiError(400 , "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
            success: true,
            page : page,
            limit: limit,
            data: videos,
            count: videos.length
            },
            "video fetched successfully"
        )
    )

    
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description,duration} = req.body
    // TODO: get video, upload to cloudinary, create video
    
    const videoPath =  req.files?.videoFile?.[0].path;
    const thumbnailPath= req.files?.thumbnail?.[0].path;

    if(!videoPath){
        throw new ApiError(400, "Video file missing!")
    }
    if(!thumbnailPath){
        throw new ApiError(400, "thumbnail file missing!")
    }

    const videoFile=await uploadOnCloudinary(videoPath)
    const thumbnail= await uploadOnCloudinary(thumbnailPath)

    if(!videoFile.url){
        throw new ApiError(400, "Error while uploading video")
    }
    if(!thumbnail.url){
        throw new ApiError(400, "Error while uploading video")
    }


    const video = await Video.create({
        videoFile : videoFile.url,
        thumbnail : thumbnail.url,
        title,
        description,
        duration
    })

    const uploadedVideo =  await Video.findById(video._id)
    if(!uploadedVideo) {
        throw new ApiError(500, "something went wrong while uploading video")
    }

    return res.status(201).json(
        new ApiResponse(200, uploadedVideo, "video published Successfully")
    )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"no such video")
    }

    return res.status(200).send({
        video
    })
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"no such video")
    }

    const {title, description, thumbnail} = req.body
    if (title !== undefined) {video.title = title;}
    if (description !== undefined) {video.description = description;}
    if (thumbnail !== undefined) {video.thumbnail = thumbnail;}

    await video.save()
    
    return res.status(200).send(
        new ApiResponse(200,video,"video updated successfully")
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const deletedVideo = await Video.findByIdAndDelete(videoId)

    if (!deletedVideo) {
    throw new ApiError(404, "Video not found");
    }

    return res.status(200).send(
        new ApiResponse(200,{}, "video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = Video.findById(videoId)

    if(!video){
        throw new ApiError(400,"video not found")
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).send(
        new ApiResponse(200,video,"toggled successfully")
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}