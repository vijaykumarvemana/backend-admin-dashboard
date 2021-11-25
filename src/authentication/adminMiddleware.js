import createHttpError from "http-errors";

export const adminMiddleware = (req, res, next) => {
    if(req.user.role === "admin"){
        next();
    } else {
        next(createHttpError(403, "You are not authorized to access"));
    }
}