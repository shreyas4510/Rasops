import hotelController from "../../controllers/hotel.controller.js";
import { create } from "../utils/dummy.hotel.js";
import hotelRepo from "../../repositories/hotel.repository.js";
import hotelUserRelationRepo from "../../repositories/hotelUserRelation.repository.js";
import userRepo from "../../repositories/user.repository.js";

// Initializing an empty response object
let res = {};

// Creating spies to track function calls
const hotelRepoSaveSpy = jest.spyOn(hotelRepo, 'save');
const hotelUserRelationRepoSpy = jest.spyOn(hotelUserRelationRepo, 'save');
const userRepoSpy = jest.spyOn(userRepo, 'findOne')

// Describing the test suite for hotel registration functionality
describe('testing hotel cases', () => {
    // Resetting all mocks before each test
    beforeEach(() => {
        jest.resetAllMocks();
        // Resetting response object
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
    });

    // Testing payload validation
    test('test payload validation', async () => {
        const { validationTest } = create;
        await hotelController.register(validationTest.req, res);
        
        // Expectations for response status and data
        expect(res.status).toHaveBeenCalledWith(validationTest.res.status);
        expect(res.send).toHaveBeenCalledWith(validationTest.res.data);
    })

    // Testing hotel creation without an admin
    test('test create hotel without admin', async () => {
        const { ownerTest } = create;

        // Mocking resolved values for repository functions
        hotelRepoSaveSpy.mockResolvedValue(ownerTest.db.hotel);
        hotelUserRelationRepoSpy.mockResolvedValue({});

        // Calling the hotel registration controller function
        await hotelController.register(ownerTest.req, res);

        // Expectations for function calls and response data
        expect(hotelRepoSaveSpy).toHaveBeenCalled();
        expect(hotelUserRelationRepoSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(ownerTest.res.status);
        expect(res.send).toHaveBeenCalledWith(ownerTest.db.hotel);
    })

    // Testing hotel creation with an admin
    test('test create hotel with admin', async () => {
        const { adminTest } = create;

        // Mocking resolved values for repository functions
        hotelRepoSaveSpy.mockResolvedValue(adminTest.db.hotel);
        userRepoSpy.mockResolvedValue(adminTest.db.admin);

        // Calling the hotel registration controller function
        await hotelController.register(adminTest.req, res);

        // Expectations for function calls and response data
        expect(res.status).toHaveBeenCalledWith(adminTest.res.status);
        expect(userRepoSpy).toHaveBeenCalled();
        expect(hotelUserRelationRepoSpy).toHaveBeenCalledTimes(2);
        expect(res.send).toHaveBeenCalledWith(adminTest.db.hotel);
    })

    // Testing error scenario during hotel creation
    test('test create hotel error', async () => {
        const { errorTest } = create;
        // Mocking rejected value for repository function
        hotelRepoSaveSpy.mockRejectedValue(errorTest.error);
        // Calling the hotel registration controller function
        await hotelController.register(errorTest.req, res)

        // Expectations for error handling
        expect(res.status).toHaveBeenCalledWith(errorTest.res.status);
        expect(res.send).toHaveBeenCalledWith(errorTest.res.data);
    })
})
