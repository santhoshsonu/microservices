import { requireAuth, validateRequest } from '@microservice-tickets/common';
import express from 'express';
import { check } from 'express-validator';
import { createPayment } from '../controllers/payments';
import mongoose from "mongoose";

const router = express.Router();

router.post('/',
    requireAuth,
    [
        check('token')
            .not()
            .isEmpty()
            .withMessage('token is requried'),
        check('orderId')
            .not()
            .isEmpty()
            .withMessage('orderId is requried')
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Invalid Order Id'),
    ],
    validateRequest,
    createPayment
);

export { router as paymentsRouter };
