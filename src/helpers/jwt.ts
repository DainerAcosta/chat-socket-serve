import jwt from "jsonwebtoken";

const generateJWT = async (uid: String, name: String): Promise<any> => {
  const payload = { uid, name };

  const newJWT = await jwt.sign(payload, `${process.env.SECRET_JWT_SEED}`, {
    expiresIn: "2h",
  });

  return newJWT;
};

export default generateJWT;
