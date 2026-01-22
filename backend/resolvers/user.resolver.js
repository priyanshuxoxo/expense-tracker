import { users } from "../dummyData/data.js";
import User from "../models/user.model.js";

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;

        if (!username || !name || !password || !gender) {
          throw new Error("All fiels are mandatory");
        }
        if (User.findOne({ username })) {
          throw new Error("User already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password, salt);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          username,
          name,
          password: hasedPassword,
          gender:
            gender.toLowerCase() === "male" ? boyProfilePic : girlProfilePic,
        });
        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (error) {
        console.error("Error in creating user: ", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, passowrd } = input;
        const { user } = await context.authenticate("graphql-local", {
          username,
          passowrd,
        });
        await context.login(user);
        return user;
      } catch (error) {
        console.error("Error in login: ", error);

        throw new Error("Internal server error");
      }
    },
    logout: async (_, _, context) => {
      try {
        await context.logout();
        req.session.destroy((err) => {
          if (err) {
            console.error("Error destroying session: ", err);
          }
        });
        res.clearCookie("connect.sid");

        return { message: "Logout successful" };
      } catch (error) {
        console.error("Error in logout: ", error);
        throw new Error("Internal server error");
      }
    },
  },
  Query: {
    authUser: async (_, _context) => {
      try {
        const user = await context.getUser();
        if (!user) {
          throw new Error("Not authenticated");
        }
        return user;
      } catch (error) {
        console.error("Error in fetching auth user: ", error);
        throw new Error("Internal server error");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (error) {
        console.error("Error in fetching user: ", error);
        throw new Error(err.meesage || "Internal server error");
      }
    },
  },
  // TODO=>ADD USER/TRANSACTION Relation
};
export default userResolver;
