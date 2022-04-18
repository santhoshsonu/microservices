
export const stripe = {
    charges: {
        // Return promise immediately which resolves itself automatically
        create: jest.fn().mockResolvedValue({})
    }
};
