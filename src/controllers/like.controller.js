import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js/"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid videoId.")
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(400, "Video not found.")
    }
    const videoAlreadyLiked = await Like.findOne({
        video: video._id,
        likedBy: req.user?._id
    });
    if(videoAlreadyLiked){
        await Like.findByIdAndDelete(videoAlreadyLiked._id);
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200, {}, "Video disliked successfully."
                )
            )
    }else{
        await Like.create({
            video: video._id,
            likedBy: req.user?._id
        })
    }
    return res
        .status(200)
        .json( new ApiResponse(
            200, {}, "Video liked successfully."
        ))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid commentId.");
    }
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(400, "Comment not found.");
    }
    const commentAlreadyLiked = await comment.findOne({
        comment: comment._id,
        likedBy: req.user?._id
    });
    if(commentAlreadyLiked){
        await Like.findByIdAndDelete(commentAlreadyLiked._id);
        return res
            .status(200)
            .json( new ApiResponse(
                200, {}, "Comment dislike successfully."
            ))
    }else{
        await Like.create({
            comment: comment._id,
            likedBy: req.user?._id
        });
        return res
            .status(200)
            .json( new ApiResponse(
                200, {}, "Comment liked successfully."
            ));
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweetId.")
    }
    const tweet = await Tweet.findById("tweetId");
    if(!tweet){
        throw new ApiError(400, "Tweet not found.")
    }
    const tweetAlreadyLiked = await Like.findOne({
        tweet: tweet._id,
        likedBy: req.user?._id
    });

    if(tweetAlreadyLiked){
        await Like.findByIdAndDelete(tweetAlreadyLiked._id);
        return res  
            .status(200)
            .json( new ApiResponse(
                200, {}, "Tweet disliked successfully."
            ))
    }else{
        await Like.create({
            tweet: tweet._id, 
            likedBy: req.user._id
        })
    }

    return res
        .status(200)
        .json( new ApiResponse(
            200, {}, "Tweet liked successfully."
        ))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}