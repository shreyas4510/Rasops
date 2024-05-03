import hotelController from "../../controllers/hotel.controller.js";
import { create, update } from "../utils/dummy.hotel.js";
import hotelRepo from "../../repositories/hotel.repository.js";
import hotelUserRelationRepo from "../../repositories/hotelUserRelation.repository.js";

// Initializing an empty response object
let res = {};

// console.log = jest.fn();

// Creating spies to track function calls
const hotelRepoSaveSpy = jest.spyOn(hotelRepo, 'save');
const hotelRepoUpdateSpy = jest.spyOn(hotelRepo, 'update');
const hotelUserRelationRepoSpy = jest.spyOn(hotelUserRelationRepo, 'save');

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

    // create hotel
    test('test payload validation', async () => {
        const { validationTest } = create;
        await hotelController.register(validationTest.req, res);
        
        // Expectations for response status and data
        expect(res.status).toHaveBeenCalledWith(validationTest.res.status);
        expect(res.send).toHaveBeenCalledWith(validationTest.res.data);
    })

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

    test('test create hotel with admin', async () => {
        const { adminTest } = create;

        // Mocking resolved values for repository functions
        hotelRepoSaveSpy.mockResolvedValue(adminTest.db.hotel);
        hotelUserRelationRepoSpy.mockResolvedValue();          

        // Calling the hotel registration controller function
        await hotelController.register(adminTest.req, res);

        // Expectations for function calls and response data
        expect(res.status).toHaveBeenCalledWith(adminTest.res.status);
        expect(hotelUserRelationRepoSpy).toHaveBeenCalledTimes(2);
        expect(res.send).toHaveBeenCalledWith(adminTest.db.hotel);
    })

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

    // update hotel
    test('test update hotel successfully', async () => {

        const { success } = update;

        hotelRepoUpdateSpy.mockResolvedValue(1);

        await hotelController.update(success.req, res);

        expect(res.status).toHaveBeenCalledWith(success.res.status);
        expect(hotelRepoUpdateSpy).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(success.res.data);
    })

    test('test update hotel throw error', async () => {
        const { error } = update;
        hotelRepoUpdateSpy.mockRejectedValue(new Error(error.error));
        await hotelController.update(error.req, res);

        expect(res.status).toHaveBeenCalledWith(error.res.status);
        expect(hotelRepoUpdateSpy).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(error.res.data);
    })
})
