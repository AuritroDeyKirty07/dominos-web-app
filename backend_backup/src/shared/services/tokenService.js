import jwt from "jsonwebtoken";

export const genrateToken =  (userId) => {
  const token = jwt.sign(
    {
      userId:userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
  return token;
};

export const verifyToken=(token)=>{
    const decodedPayload=jwt.verify(token,process.env.JWT_SECRET);
    if(!decodedPayload){
        throw new Error("token verification failed");
    }
    return decodedPayload;
}
