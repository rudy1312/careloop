import { Router } from "express";

import {
    registration,
    logging,
    feeding,
    getMyFeed
} from "../controller/patient/patient.controller.js";

const router = Router();

router.route("/reg").post(registration);
router.route("/log").post(logging);
router.route("/feed").post(feeding);
router.route("/fetchMy").post(getMyFeed);

export default router;