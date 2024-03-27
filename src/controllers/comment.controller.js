import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    // Extract videoId, page, and limit from request parameters and query
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id.");
    }

    // Validate page and limit
    if (page < 1 || limit > 10) {
        throw new ApiError(400, "Invalid page number or page limits.");
    }

    // Find the video by its ID
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(400, "Video is not found.");
    }

    // Aggregate pipeline to fetch comments for the video
    // The comments are fetched using an aggregation pipeline, 
    // which includes lookups to populate owner details and likes 
    // count for each comment.

    const videoComments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "commentOwner"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "commentLikes"
            }
        },
        {
            $addFields: {
                commentLikesCount: {
                    $size: "$commentLikes"
                },
                commentOwner: {
                    $arrayElemAt: ["$commentOwner", 0]
                },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user._id, "$commentLikes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                commentLikesCount: 1,
                commentOwner: {
                    username: 1,
                    avatar: 1
                },
                isLiked: 1
            }
        }
    ]);

    // Set up pagination options
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    // Paginate the comments
    const comments = await Comment.aggregatePaginate(videoComments, options);

    // If no comments are found, return a success response with a message
    if (!comments) {
        return res.status(200).json(new ApiResponse(200, {}, "Video has no comments."));
    }

    // Return a success response with the paginated comments
    return res.status(200).json(new ApiResponse(200, comments, "Video comments fetched successfully."));
});


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = body.params;
    const { content } = body.body;
    if(content===""){
        throw new ApiError(200, "Content required.")
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(200, "Invalid videoId.")
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(200, "Video not found.")
    }
    const comment = await Comment.create({
        content, video: video._id, owner: req.user?._id
    });
    if(!comment){
        throw new ApiError(400, "Error creating comment.")
    }

    return res.status(200).json( new ApiResponse(
        200, comment, "Comment created successfully."
    ))
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = body.params;
    const { content } = body.body;
    if(content===""){
        throw new ApiError(200, "Content required.")
    }
    if(!isValidObjectId(commentId)){
        throw new ApiError(200, "Invalid commentId.")
    }
    const updateComment = await Comment.findById(commentId);
    if(!updateComment){
        throw new ApiError(200, "comment not found.")
    }
    let updatedComment;
    if(updateComment.owner.toString() === req.user?._id.toString()){
        updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set: { content }
            },
            {
                new: true
            }
        )
    }

    return res
        .status(200)
        .json( new ApiResponse(
            200, updatedComment, "Comment updated successfully.")
        );
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid commentId.")
    }
    const deleteCommentById = await Comment.findById(commentId);
    if(!deleteCommentById){
        throw new ApiError(400, "Invalid commentId.");
    }
    if(deleteCommentById.owner.toString() === req.user?._id.toString()){
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if(deleteComment){
            await Like.deleteMany({ comment: deletedComment._id})
        }else{
            throw new ApiError(404, "Something went wrong while deleting comments.")
        }
    }else{
        throw new ApiError(403, "Unauthorized access.")
    }
    return res
        .status(200)
        .json( new ApiResponse(
            200, {}, "Comment deleted successfully."
        ));
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}