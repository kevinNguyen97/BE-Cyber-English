"use strict";
import express from "express";
import { ResponseCode } from "../models/response";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    return res
      .status(ResponseCode.UNAUTHORIZED)
      .json({ responseData: "note test" });
  } catch (err) {
    return res.status(ResponseCode.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default router;
