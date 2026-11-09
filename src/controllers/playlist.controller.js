import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const userId = req.user._id
    //TODO: create playlist
 
    let existedPlaylist = await Playlist.findOne({name: name, owner : userId})
    if(existedPlaylist){
        return res.status(409).send(
            new ApiResponse(409, {}, "Playlist already exists")
        );
    }

    const newPlaylist = await Playlist.create({
        name,
        description,
        owner: userId
    })

    if(!newPlaylist){
        throw new ApiError(404, "Playlist creation failed")
    }

    return res.status(200).send(
        new ApiResponse(200, newPlaylist, "Playlist created successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    const userExists = await User.findById(userId);
    if (!userExists) {
        throw new ApiError(404, "User not found");
    }
    //TODO: get user playlists
    const playlists = await Playlist.find({owner:userId})
    if (playlists.length === 0) {
        return res.status(204).send(
            new ApiResponse(204, {}, "No playlists found for this user")
        );
    }

    return res.status(200).send(
        new ApiResponse(200,playlists,"playlists fetched successfully")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "playlist not found")
    }

    return res.status(200).send(
        new ApiResponse(200,playlist,"playlist fetched successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    
    let playlist = await Playlist.findByIdAndUpdate(
            playlistId, 
            { $push: { videos: videoId } }, 
            { new: true } 
    );

    if (!playlist) {
            throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).send(
        new ApiResponse(200,playlist,"video successfully added to playlist")
    )
    
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    let playlist = await Playlist.findByIdAndUpdate(
            playlistId, 
            { $pull: { videos: videoId } }, 
            { new: true } 
    );

    if (!playlist) {
            throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).send(
        new ApiResponse(200,playlist,"video successfully removed from playlist")
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    const playlist = await Playlist.findByIdAndDelete(playlistId)
    if(!playlist){
        throw new ApiError(404, " no such playlist existed")
    }
    return res.status(200).send(
        new ApiResponse(200,playlist,"playlist deleted successfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if(!name || !description){
        throw new ApiError(500, " name and description are required")
    }
    //TODO: update playlist
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {name , description},
        {new : true}
    )
    if(!playlist){
        throw new ApiError(404, " no such playlist existed")
    }
    return res.status(200).send(
        new ApiResponse(200,playlist,"playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}