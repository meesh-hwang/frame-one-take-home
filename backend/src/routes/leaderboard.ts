import express from "express";
import { CommunityModel } from "../models/Community";

const leaderboardRouter = express.Router();

/**
 * @route GET /leaderboard
 * @returns {Array} - Array of community leaderboard entries
 */
leaderboardRouter.get("/", async (_, res) => {
  try {
    const leaderboard = await CommunityModel.aggregate([
      // Open users array
      {
        $unwind: {
          path: "$users",
          preserveNullAndEmptyArrays: true
        }
      },
      // Convert users to objectId so it matches the foreignField type during the lookup stage
      {
        $addFields: {
          "users": { $toObjectId: "$users" }
        }
      },
      // Join with users collection 
      // Adds user object to usersData array from users collection for each overlapping id
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "usersData",
        }
      },
      // Open usersData array
      {
        $unwind: {
          path: "$usersData",
          preserveNullAndEmptyArrays: true,
        }
      },

      // Open experiencePoints array from usersData array
      {
        $unwind: {
          path: "$usersData.experiencePoints", 
          preserveNullAndEmptyArrays: true,
        }
      },
      // Group by _id and project the following:
      {
        $group: {
          _id: "$_id",
          communityLogo: { $first: "$logo" }, // - Community logo
          communityName: { $first: "$name" }, // - Community name
          communityPoints: { $sum: "$usersData.experiencePoints.points" }, // -Total number of collective experience points
          // Array of user _id
          userCount: { $addToSet: "$usersData._id" } 
        }
      },
      {
        $addFields: {
          // Return length of array of users
          userCount: { $size: "$userCount" } // - Number of users in the community
        }
      },
      {
        $setWindowFields: {
          // Sort by communityPoints
          sortBy: { communityPoints: -1 },
          output: { rank: { '$rank': {} } }, // - Placing (rank) in the leaderboard
        }
      }
    ]);
  
    res.send(leaderboard);

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

export { leaderboardRouter };
