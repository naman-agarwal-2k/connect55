import ResponseMessages, { SUCCESS } from "../utils/responseMessages";
import { Request, Response } from "express";
import {
  sendError,
  sendSuccess,
} from "../utils/universalFunctions";


export class OrgDataController{

    public async getOrganisationData(payload: Request, res: Response): Promise<void> {
            try {
              const data = {
                skills: [
                  "JavaScript",
                  "Python",
                  "Java",
                  "React",
                  "Node.js",
                  "TypeScript",
                  "SQL",
                  "MongoDB",
                  "AWS",
                  "DevOps",
                  "UI/UX Design",
                  "Data Analysis",
                ],
                designations: [
                  "Software Engineer",
                  "Frontend Developer",
                  "Backend Developer",
                  "Fullstack Developer",
                  "Data Scientist",
                  "Product Manager",
                  "DevOps Engineer",
                  "UI/UX Designer",
                  "Business Analyst",
                ],
                departments: [
                  "Engineering",
                  "Marketing",
                  "Sales",
                  "Human Resources",
                  "Finance",
                  "Operations",
                  "Customer Support",
                  "Product Development",
                ],
              };
          
              sendSuccess(SUCCESS.ORG_DATA_LIST,data, res, {});
            } catch (error) {
                sendError(error, res, {});
            }
          };
      }
    
   