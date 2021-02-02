import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, userData) => {
    if (err) return res.json({ success: false, err });

    return res.status(200).json({ success: true, userData });
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }).then((targetUser) => {
    if (!targetUser) {
      res.json({ loginState: false, message: "there is no matched user" });
    } else {
      targetUser.comparePassword(req.body.password).then((result) => {
        if (!result) {
          res.json({ loginState: false, message: "wrong password" });
        } else {
          let token = jwt.sign(targetUser._id.toHexString(), "secret");
          targetUser.token = token;
          console.log(targetUser);
          targetUser.save();
        }
      });
    }
  });
});

export default router;
