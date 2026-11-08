import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const comments= 
        await Comment
        .find({video : videoId})
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
                    
    if(!comments) {
        throw new ApiError(400,"comments not found!")
    }

    return res.status(200).send(
        new ApiResponse(200,comments,"comments fetched successfully")
    )

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content} = req.body
    const userId = req.user._id
    const {videoId}= req.params

    if (!content || !videoId || !userId) {
    throw new ApiError(400, "Missing required fields: content, video, or user");
    }

    const comment= await Comment.create({
        content,
        video: videoId,
        owner : userId
    })

    if(!comment){
        throw new ApiError(500,"comment not created")
    }

    return res.status(201).send(
        new ApiResponse(201,comment,"comment published successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content} = req.body
    const {commentId} = req.params

    if(!content || !commentId){
        throw new ApiError(500,"content & commentId, both fields are req!")
    }

    const updatedComment= await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        {new: true}
    )
    if(!updatedComment){
        throw new ApiError(400,"comment not updated")
    }

    return res.status(200).send(
        new ApiResponse(200,updatedComment,"comment updated successfully")
    )

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    const comment =await Comment.findByIdAndDelete(commentId)
    if(!comment){
        throw new ApiError(400, " no such comment existed")
    }

    return res.status(200).send(
        new ApiResponse(200,{},"comment deleted successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }