import { logger } from "../../../shared/services/logger.js";
import {
  loginService,
  registerService,
  resetPassword,
} from "../service/userService.js";

export const registerController = async (req, res) => {
  try {
    const userData = req.body;

    const user = await registerService(userData);

    return res
      .status(200)
      .json({ message: "registration is successfull", user });
  } catch (error) {
    // console.error(error);

    logger.error(error);

    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const userData = req.body;
    const { token, user } = await loginService(userData);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "login successfull", userToken: token, user });
  } catch (error) {
    logger.error(error);
    // console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const resetPass = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "token not found",
      });
    }
    const userId = req.userId;
    const userData = req.body;
    await resetPassword(userData, userId);
    return res.status(200).json({
      message: "Password changed",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // production me true
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
