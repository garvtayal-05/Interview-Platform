const Experience = require("../Models/Experience_Model");

async function CreateExperience(req, res) {
    const {
        name,
        email,
        linkedin,
        currentRole,
        companyName,
        offer,
        experience,
        difficulty,
    } = req.body;

    // console.log(req.body);
    if (!companyName || !offer || !experience || !difficulty) {
        return res.status(401).json({ Error: "Required fields are missing" });
    }

    try {
        const newExperience = new Experience({
            name,
            email,
            linkedin,
            currentRole,
            companyName,
            offer,
            experience,
            difficulty,
            createdBy: req.user?._id || null  // Optional auth user tracking
        });

        await newExperience.save();

        return res.status(201).json({ Message: "Experience Submitted Successfully" });
    } catch (e) {
        console.log("Error: ", e);
        return res.status(500).json({ Error: "Internal server error" });
    }
}


async function Get_All_Experiences(req, res) {
    try {
        const experiences = await Experience.find().sort({ createdAt: -1 }); // latest first
        console.log(experiences)
        res.status(200).json(experiences);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
}

async function Get_User_Experiences(req, res) {
    try {
        const userId = req.user._id;

        const experiences = await Experience.find({ createdBy: userId })
            .sort({ createdAt: -1 });

        res.status(200).json(experiences);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
}

async function Update_Experience(req, res) {
    const { id } = req.params;

    try {
        const experience = await Experience.findById(id);

        if (!experience) {
            return res.status(404).json({ Error: "Experience not found" });
        }

        // Check user authorization
        if (experience.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ Error: "Unauthorized" });
        }

        // Update allowed fields
        const updatableFields = ['name', 'email', 'linkedin', 'currentRole', 'companyName', 'offer', 'experience', 'difficulty'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                experience[field] = req.body[field];
            }
        });

        await experience.save();

        res.status(200).json({ Message: "Experience Updated Successfully", experience });

    } catch (error) {
        console.log("Update error:", error);
        res.status(500).json({ Error: "Internal server error" });
    }
}

// ❌ Delete Experience by ID
async function Delete_Experience(req, res) {
    const { id } = req.params;

    try {
        const experience = await Experience.findById(id);

        if (!experience) {
            return res.status(404).json({ Error: "Experience not found" });
        }

        // Authorization check
        if (experience.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ Error: "Unauthorized" });
        }

        await Experience.findByIdAndDelete(id);

        res.status(200).json({ Message: "Experience Deleted Successfully" });
    } catch (error) {
        console.log("Delete error:", error);
        res.status(500).json({ Error: "Internal server error" });
    }
}
// Upvote experience
async function upvoteExperience(req, res) {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const experience = await Experience.findById(id);
    if (!experience) return res.status(404).json({ Error: "Experience not found" });

    // Remove user from downvotes if present
    experience.downvotes = experience.downvotes.filter(uid => uid.toString() !== userId.toString());

    // Toggle upvote
    if (experience.upvotes.some(uid => uid.toString() === userId.toString())) {
      // User already upvoted, so remove upvote (toggle off)
      experience.upvotes = experience.upvotes.filter(uid => uid.toString() !== userId.toString());
    } else {
      // Add upvote
      experience.upvotes.push(userId);
    }

    await experience.save();

    res.status(200).json({
      Message: "Upvote updated",
      upvotesCount: experience.upvotes.length,
      downvotesCount: experience.downvotes.length,
    });
  } catch (error) {
    console.log("Upvote error:", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}

// Downvote experience
async function downvoteExperience(req, res) {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const experience = await Experience.findById(id);
    if (!experience) return res.status(404).json({ Error: "Experience not found" });

    // Remove user from upvotes if present
    experience.upvotes = experience.upvotes.filter(uid => uid.toString() !== userId.toString());

    // Toggle downvote
    if (experience.downvotes.some(uid => uid.toString() === userId.toString())) {
      // User already downvoted, remove downvote (toggle off)
      experience.downvotes = experience.downvotes.filter(uid => uid.toString() !== userId.toString());
    } else {
      // Add downvote
      experience.downvotes.push(userId);
    }

    await experience.save();

    res.status(200).json({
      Message: "Downvote updated",
      upvotesCount: experience.upvotes.length,
      downvotesCount: experience.downvotes.length,
    });
  } catch (error) {
    console.log("Downvote error:", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}

module.exports = {
    CreateExperience,
    Get_All_Experiences,
    Get_User_Experiences,
    Update_Experience,
    Delete_Experience,
    upvoteExperience,
    downvoteExperience,
};
