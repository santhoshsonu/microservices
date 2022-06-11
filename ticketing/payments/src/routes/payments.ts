import { requireAuth, validateRequest } from '@microservice-tickets/common';
import express from 'express';
import { check, oneOf } from 'express-validator';
import { createPayment } from '../controllers/payments';
import mongoose from "mongoose";

const router = express.Router();

router.post('/',
    requireAuth,
    [
        oneOf([
            check('paymentMethodId')
                .not()
                .isEmpty()
                .withMessage('paymentMethodId is requried'),
            check('stripeId')
                .not()
                .isEmpty()
                .withMessage('stripeId is requried')
        ]),
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
