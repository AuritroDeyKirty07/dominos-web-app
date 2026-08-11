import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET || "dominos_jwt_secret_key_12345";

export const genrateToken =  (userId) => {
  const token = jwt.sign(
    {
      userId:userId,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    },
  );
  return token;
};

export const verifyToken=(token)=>{
    const decodedPayload=jwt.verify(token, getJwtSecret());
    if(!decodedPayload){
        throw new Error("token verification failed");
    }
    return decodedPayload;
}
