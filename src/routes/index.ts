import { Router } from "express";
import authRoutes from "./auth.routes";
import propertyRoutes from "./property.routes";
import planRoutes from "./plan.routes";
import testimonialRoutes from "./testimonial.routes";
import userRoutes from "./user.routes";
import aboutRoutes from "./about.routes";
import galleryRoutes from "./gallery.routes";
import enquiryRoutes from "./enquiry.routes";
import sourceRoutes from "./src.routes";
import adminRoutes from "./dashboard.routes";
import formRoutes from "./form.routes";
import { UploadController } from "../controllers/upload.controller";
import { upload } from "../config/multer";
const router = Router();
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/property", propertyRoutes);
router.use("/plan", planRoutes);
router.use("/testimonial", testimonialRoutes);
router.use("/user", userRoutes);
router.use("/about", aboutRoutes);
router.use("/gallery", galleryRoutes);
router.use("/enquiry", enquiryRoutes);
router.use("/src", sourceRoutes);
router.use("/form", formRoutes);

router.post(
  "/upload",

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
  upload.array("files", 10),
  UploadController.upload,
);

router.post(
  "/get-uploads",

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
  UploadController.getUploads,
);
export default router;
