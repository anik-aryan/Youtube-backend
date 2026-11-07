import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const userId= req.user._id

    let subscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    })

    let message;
    if(!subscription){
        subscription = await Subscription.create({ subscriber: userId, channel: channelId })
        message="subscribed successfully" 
    }else{
        await subscription.deleteOne()
        message="unsubscribed successfully"
    }

    return res.status(200).send(
        new ApiResponse(200,{},message)
    )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId){
        throw new ApiError(400,"channel Id not provided")
    }

    const subscriptions= await Subscription.find({channel:channelId})
    if (subscriptions.length === 0) {
    return res.status(200).send(
        new ApiResponse(200, [], "No subscribers found for this channel")
    );
    }


    let subscribers = [];
    subscriptions.forEach((subscription)=>subscribers.push(subscription.subscriber))

    return res.status(200).send(
        new ApiResponse(200,subscribers,"subscribers fetched successfully")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!subscriberId){
        throw new ApiError(400,"subscriber Id not provided")
    }

    const subscriptions= await Subscription.find({subscriber:subscriberId})
    if (subscriptions.length === 0) {
        return res.status(200).send(
            new ApiResponse(200, [], "No subscribed channels found")
        );
    }

    const channels = subscriptions.map(sub => sub.channel);

    return res.status(200).send(
        new ApiResponse(200,channels,"subscribers fetched successfully")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}