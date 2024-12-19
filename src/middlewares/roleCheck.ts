import { Request, Response, NextFunction } from "express";
import User from "../models/User";

//use -router.put("/user/:id", checkRole(["admin"]), updateUser);

export const checkRole = (allowedRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id; // Assuming user ID is attached to `req.user` after authentication

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: "You do not have permission to perform this action." });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
