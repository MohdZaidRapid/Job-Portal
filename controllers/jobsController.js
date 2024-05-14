import jobsModel from "../models/jobsModel.js";

// Create jobs
export const createJobController = async (req, res, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next("Please Provide All Fields");
  }
  req.body.createdBy = req.user.userId;
  const jobs = await jobsModel.create(req.body);
  res.status(201).json({ jobs });
};

// get All jobs
export const getAllJobsController = async (req, res, next) => {
  const jobs = await jobsModel.find({ createdBy: req.user.userId });
  res.status(200).json({ totalJobs: jobs.length, jobs });
};
