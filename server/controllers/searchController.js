import Post from "../models/Post.js";
import { User } from "../models/User.js";
import Community from "../models/Community.js";

export const search = async (req, res) => {
  const { q: query, community } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  try {
    const searchRegex = new RegExp(query, "i");

    const postQuery = community
      ? {
          $and: [
            { $or: [{ title: searchRegex }, { content: searchRegex }] },
            { "community.name": community },
          ],
        }
      : { $or: [{ title: searchRegex }, { content: searchRegex }] };

    const [posts, users, communities] = await Promise.all([
      Post.find(postQuery)
        .populate("authorId", "username")
        .populate("community", "name")
        .limit(5)
        .select("title community"),

      !community
        ? User.find({ username: searchRegex })
            .limit(3)
            .select("username avatar")
        : Promise.resolve([]),

      !community
        ? Community.find({ name: searchRegex }).limit(3).select("name members")
        : Promise.resolve([]),
    ]);

    const formattedResults = [
      ...posts.map((post) => ({
        ...post.toObject(),
        type: "post",
      })),
      ...users.map((user) => ({
        ...user.toObject(),
        type: "user",
      })),
      ...communities.map((community) => ({
        ...community.toObject(),
        type: "community",
      })),
    ];

    res.status(200).json({
      success: true,
      data: formattedResults,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};
