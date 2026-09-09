"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const property_routes_1 = __importDefault(require("./property.routes"));
const plan_routes_1 = __importDefault(require("./plan.routes"));
const testimonial_routes_1 = __importDefault(require("./testimonial.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const about_routes_1 = __importDefault(require("./about.routes"));
const gallery_routes_1 = __importDefault(require("./gallery.routes"));
const enquiry_routes_1 = __importDefault(require("./enquiry.routes"));
const src_routes_1 = __importDefault(require("./src.routes"));
const upload_controller_1 = require("../controllers/upload.controller");
const multer_1 = require("../config/multer");
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/property", property_routes_1.default);
router.use("/plan", plan_routes_1.default);
router.use("/testimonial", testimonial_routes_1.default);
router.use("/user", user_routes_1.default);
router.use("/about", about_routes_1.default);
router.use("/gallery", gallery_routes_1.default);
router.use("/enquiry", enquiry_routes_1.default);
router.use("/src", src_routes_1.default);
router.post("/upload", 
/*
      #swagger.tags = ['1.Upload']
      #swagger.summary = 'Upload Files'
      #swagger.description = 'Upload single or multiple images, videos, and PDF files'

      #swagger.consumes = ['multipart/form-data']

      #swagger.parameters['files'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'Select one or more files'
      }

      #swagger.responses[200] = {
        description: 'Files Uploaded Successfully'
      }

      #swagger.responses[400] = {
        description: 'No files uploaded'
      }
  */
multer_1.upload.array("files", 10), upload_controller_1.UploadController.upload);
router.post("/get-uploads", 
/*
    #swagger.tags = ['1.Upload']
    #swagger.summary = 'Get Uploaded Files'
    #swagger.description = 'Fetch uploaded images, videos, PDFs with pagination and filters'

    #swagger.parameters['body'] = {
      in: 'body',
      required: false,
      schema: {
        page: 1,
        limit: 10,
        media_type: 'image',
        id: '1,2,3'
      }
    }

   

    

    #swagger.responses[500] = {
      description: 'Internal Server Error',
      schema: {
        success: 0,
        data: [],
        message: 'Something went wrong'
      }
    }
*/
upload_controller_1.UploadController.getUploads);
exports.default = router;
