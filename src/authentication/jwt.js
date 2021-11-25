import jwt from 'jsonwebtoken';


export const JWTAuthentication = async user => {
    const accessToken = await generateAccessToken({_id:user._id})
    return accessToken
}


const generateAccessToken = payload => 
   new Promise((resolve, reject) => 
   jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1 week"}, (err, token) => {
       if(err) reject(err)
       resolve(token)
   }))
    