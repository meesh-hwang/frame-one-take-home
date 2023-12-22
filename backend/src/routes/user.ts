import express from "express";
import { UserModel } from "../models/User";
import { CommunityModel } from "../models/Community";

const userRouter = express.Router();

/**
 * @route GET /user/:id
 * @param {string} id - User ID
 * @returns {User} - User object with experiencePoints field
 */
userRouter.get("/:id", async (req, res) => {
	const user = await UserModel.findById(req.params.id).select('+experiencePoints+community');
	if (!user) {
		return res.status(404).send({ message: "User not found" });
	}
	res.send(user);
});

/**
 * @route GET /user
 * @returns {Array} - Array of User objects
 * @note Adds the virtual field of totalExperience to the user.
 * @hint You might want to use a similar aggregate in your leaderboard code.
 */
userRouter.get("/", async (_, res) => {
	const users = await UserModel.aggregate([
		{
			$unwind: "$experiencePoints"
		},
		{
			$group: {
				_id: "$_id",
				email: { $first: "$email" },
				profilePicture: { $first: "$profilePicture" },
				totalExperience: { $sum: "$experiencePoints.points" },
				community: { $first: "$community" },
			}
		}
	]);
	res.send(users);
});

/**
 * @route POST /user/:userId/join/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description Joins a community
 */
userRouter.post("/:userId/join/:communityId", async (req, res) => {
	const { userId, communityId } = req.params;

	try {
		// Find the user
		const user = await UserModel.findById(userId);

		if (!user) {
			return res.status(404).send({ message: "User not found" });
		}

		// Check if user is in a community
		if (user.community !== null && user.community !== undefined) {
			// User community is same as selected
			if (user.community === communityId) {
				return res.status(400).send({ message: "Already joined this community" });
				// Check if user is in this community

			} else {
				return res.status(403).send({ message: "Cannot join another community. Would you like to leave and join this one instead?", communityId });
			}
		} else {
			// Update the user's document to include the community
			user.community = communityId;
			await user.save();

			// Add the user to the community's users array
			const community = await CommunityModel.findById(communityId);

			if (!community) {
				return res.status(404).send({ message: "Community not found" });
			}

			community.users = community.users || [];
			community.users.push(userId);
			await community.save();

			return res.status(201).send({ message: "Successfully joined community", communityId });
		}
	} catch (error) {
		console.error("Error joining community:", error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
});

/**
 * @route DELETE /user/:userId/leave/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description Leaves a community
 */
userRouter.delete("/:userId/leave/:communityId", async (req, res) => {
	const { userId, communityId } = req.params;

	try {
		// Find the user
		const user = await UserModel.findById(userId);

		if (!user) {
			return res.status(404).send({ message: "User not found" });
		}

		const userCommunity = user.community?.toString();

		// Check if user is part of any community
		if (userCommunity !== undefined && userCommunity !== null) {

			// Check if user is NOT in selected community
			const leaveThenJoin = res.statusCode === 403
			if (leaveThenJoin) {

				// Update the user's document to remove the community
				user.community = undefined;
				await user.save();

				// Find the user's community
				const community = await CommunityModel.findOne({
					users: { $in: [userId] }
				});


				if (!community) {
					return res.status(404).send({ message: "Current community not found" });
				}

				// Remove user from the current community's users array
				community.users = community.users || [];
				community.users = community.users.filter((id) => id.toString() !== userId);
				await community.save();
				return res.status(404).send({ message: "Current community not found" });

				// Check if user is in the selected community
			} else {
				user.community = undefined;
				await user.save();
				const community = await CommunityModel.findById(userCommunity);
				if (!community) {
					return res.status(404).send({ message: "Community not found" });
				}
				// Remove user from the current community's users array
				community.users = community.users || [];
				community.users = community.users.filter((id) => id.toString() !== userId);
				await community.save();
				return res.status(200).send({ message: "Successfully left community:", userId });
			}

		}

	} catch (error) {
		console.error("Error leaving community:", error);
		return res.status(500).send({ message: "Internal Server Error" });
	}

});

export {
	userRouter
}
