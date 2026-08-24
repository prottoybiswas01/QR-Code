import express from 'express';
import { reportAndHealBug, getSystemHealthOverview, triggerManualDiagnose } from '../controllers/systemController.js';

const router = express.Router();

// Public self-heal reporting endpoint
router.post('/heal', reportAndHealBug);

// System health metrics & diagnosis
router.get('/health', getSystemHealthOverview);
router.post('/diagnose', triggerManualDiagnose);

export default router;
