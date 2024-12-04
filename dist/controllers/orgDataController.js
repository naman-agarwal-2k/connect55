"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgDataController = void 0;
const responseMessages_1 = require("../utils/responseMessages");
const universalFunctions_1 = require("../utils/universalFunctions");
class OrgDataController {
    getOrganisationData(payload, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                (0, universalFunctions_1.sendSuccess)(responseMessages_1.SUCCESS.ORG_DATA_LIST, data, res, {});
            }
            catch (error) {
                (0, universalFunctions_1.sendError)(error, res, {});
            }
        });
    }
    ;
}
exports.OrgDataController = OrgDataController;
