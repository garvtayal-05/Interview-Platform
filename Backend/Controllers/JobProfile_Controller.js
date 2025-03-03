const JobProfile = require("../Models/JobProfile_Model");
require('dotenv').config()

GEMINI_API_KEY = process.env.API_KEY
const { GoogleGenerativeAI } =  require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


async function generateQuestions(req, res) {
    const { jobrole } = req.params;
  
    if (!jobrole) {
        return res.status(400).json({ Error: "JobProfile is required" });
    }
    try {
   
        // const result = await model.generateContent(`Generate 5 Interview Questions on ${JobProfile}`);
        const result = await model.generateContent(
            `Generate 5 interview questions for ${jobrole}. 
             1 easy question, 2 medium questions, and 2 hard questions. 
             Format:
             Easy: <question>
             Medium: <question>
             Medium: <question>
             Hard: <question>
             Hard: <question>`
        )
        if (result.response.text) {
            const questions = result.response.text().split("\n").map(question => question.trim()).filter(Boolean);
            return res.status(200).json({ Questions: questions });
        }
        else {
            throw new Error("Failed to generate questions");
        }
    } catch (e) {
        console.error("Error in generateQuestions:", e);
        return res.status(500).json({ Error: "Internal Server Error" });
    }
}

async function CreateJobProfile(req, res){
    const {jobTitle, requirements, questions} = req.body;
    console.log(req.body)
    
    if(!jobTitle || !requirements || !questions){
        return res.status(401).json({Error: "All fields are required"});
    }


    if(await JobProfile.findOne({jobTitle : jobTitle.trim().toLowerCase()})) {
        return res.status(409).json({Error: "Job Profile Already Exist"});
    }

   try{
    await JobProfile.create({
        jobTitle, requirements, questions,
        createdBy: req.user._id,
    });

    return res.status(201).json({Message: "Job Profile Created"});
   }
   catch(e){
    console.log("Error: ",e);
    return res.status(500).json({Error: "Internal server error"})
   }
}

async function GetAllJobProfiles(req, res){
    try{
        const JobProfiles = await JobProfile.find({});

        if(JobProfiles.length === 0){
            return res.status(404).json({Error: "No Job Profiles Found"});
        }
        console.log(JobProfiles)
        return res.status(200).json({Message: "All Job Profiles fetched", Job_Profiles: JobProfiles})
    }
    catch(error){
        console.error(error);
        return res.status(500).json({Error : 'Internal Server Error'})
    }
}

async function GetJobProfile(req, res){
    const {_id} = req.params;
    // console.log(_id)
    try{
        const Profile = await JobProfile.findById({_id});

        if(!Profile){
            return res.status(404).json({Error: "No Job Profile Found."});
        }
        // console.log(Profile)
        return res.status(200).json({Message: "Job profile fetched", Job_Profile: Profile});
    }
    catch(e){
        console.log(Error, e);
        return res.status(500).json({Error: "Internal Server Error"});
    }

}

async function GetJobsCreatedByUser(req, res){
    const userId = req.user._id;
    console.log(userId)
    try{
        const jobs = await JobProfile.find({createdBy: userId});
        console.log(jobs)

        if(!jobs || !jobs.length === 0){
            return res.status(404).json({Error: "No Jobs created by the User"})
        }
        
        return res.status(200).json({Job_Profiles: jobs})
    }
    catch(e){
        console.log("Error: ", e)
        return res.status(500).json({Error: "Internal server error"})
    }
}
// edit delete and show only creareatd by person, apply job, section for applied jobs
module.exports ={ 
    CreateJobProfile, 
    GetAllJobProfiles,
    generateQuestions,
    GetJobProfile,
    GetJobsCreatedByUser
}