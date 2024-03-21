import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    //get user detail from client
    //check validation - not empty
    //check if user is already exist username or email
    //check image of avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation 
    //return response

    const { fullName, email, username, password } = req.body;

    if (
        [ fullName, email, username, password ].some((field) => {
            field?.trim() === ""
        })
    ) {
        throw new ApiError(400, "All field are required.");
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if(existingUser){
        throw new ApiError(409, "User with username or email already exists.");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0].path;
    console.log("req.files: ", req.files);

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required.");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    
    if(!avatar){
        throw new ApiError(400, "Avatar file is required.");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email: email,
        password: password,
        username: username.toLowerCase()
    })

    const createUser = await User.findById(user._id).
        select("-password -refreshToken");
    
    if(!createUser){
        throw new ApiError(500, "Something went wrong while registering user.")
    }

    return res.status(201).json(
        new ApiResponse(200, createUser, "User registered successfully.")
    )
})

export { registerUser }