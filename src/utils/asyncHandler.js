import asyncHandler from 'async-handler';

const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch(
            (err) => err.next()
        )
    }
}

export { asyncHandler }

// const asyncHandler = (fn) => {}
// const asyncHandler = (fn) => (fn) => {}
// const asyncHandler = (fn) => async () => {}

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
        
//     } catch (error) {
//         res.status(error.code || 500.).json({
//             success: false,
//             message: error.message
//         })
//     }
// }