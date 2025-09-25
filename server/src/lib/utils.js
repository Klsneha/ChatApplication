import jwt from "jsonwebtoken";
export const generateToken = (userId, res) => {
  const jwtToken = jwt.sign(
    {userId},
    process.env.JWT_SECRET,
    { expiresIn: '7d' }, // Token expiration time
  );

  res.cookie("jwt", jwtToken, { 
    httpOnly: true, // accessible only by web server
    secure: false,
    sameSite: "strict", // required for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return jwtToken;
};