import { db } from '../../../config/database';
import userController from '../../controllers/user.controllers';
import { create, list, remove } from '../utils/dummy.invite';

// mock the database operations
jest.mock('../../../config/database.js', () => ({
    db: {
        users: {
            create: jest.fn(),
            findOne: jest.fn()
        },
        invites: {
            create: jest.fn(),
            update: jest.fn(),
            findAndCountAll: jest.fn(),
            destroy: jest.fn()
        }
    }
}));

// mock the email sending functions
jest.mock('../../../config/email.js', () => ({
    transporter: { sendMail: jest.fn() }
}));

// mocking express res
let res = {};

// invite user
describe('test invite cases', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
    });

    // send invite
    test('test user invited successfully', async () => {
        db.invites.create.mockResolvedValue(create.db);
        await userController.invite({ body: { email: create.body.email }, user: create.body.user }, res);

        // database method got called
        expect(db.invites.create).toHaveBeenCalled();

        // api success with status code 200
        expect(res.status).toHaveBeenCalledWith(create.res.code);

        // successfully user got invited
        const data = res.send.mock.calls[0][0];
        expect(data).toEqual(create.res.data);
    });

    test('test failed to invite user', async () => {
        // Mocking the rejection of invite creation
        db.invites.create.mockRejectedValue(new Error('Failed to create invite'));

        // Invoking the invite function from userController with mocked data
        await userController.invite({ body: { email: create.body.email }, user: create.body.user }, res);

        // Asserting that the appropriate status is set
        expect(res.status).toHaveBeenCalledWith(create.error.code);

        // Extracting data sent in the response and asserting its structure
        const data = res.send.mock.calls[0][0];
        expect(data).toHaveProperty('message');
    });

    // list invites
    test('test list invites success', async () => {
        db.invites.findAndCountAll.mockResolvedValue(list.res.data);

        await userController.listInvites(list.req, res);

        expect(res.status).toHaveBeenCalledWith(list.res.status);
        expect(db.invites.findAndCountAll).toHaveBeenCalled();

        const data = res.send.mock.calls[0][0];
        expect(data).toEqual(list.res.data);
    });

    test('test error for list invites', async () => {
        db.invites.findAndCountAll.mockRejectedValue(new Error('Failed to fetch invites'));

        await userController.listInvites(list.req, res);

        expect(res.status).toHaveBeenCalledWith(list.error.status);
        expect(db.invites.findAndCountAll).toHaveBeenCalled();

        const data = res.send.mock.calls[0][0];
        expect(data.message).toEqual(list.error.message);
    });

    // remove invites
    test('test invited user not found', async () => {
        db.invites.findAndCountAll.mockResolvedValue(remove.db.findAndCountAll.empty);
        db.invites.destroy.mockResolvedValue(remove.db.destory.success);

        await userController.removeInvite(remove.req, res);

        expect(res.status).toHaveBeenCalledWith(remove.error.errorInviteUser.status);
        expect(db.invites.findAndCountAll).toHaveBeenCalled();
        expect(db.invites.destroy).toHaveBeenCalled();

        const data = res.send.mock.calls[0][0];
        expect(data.message).toEqual(remove.error.errorInviteUser.message);
    });

    test('test invited user is active', async () => {
        db.invites.findAndCountAll.mockResolvedValue(remove.db.findAndCountAll.accepted);

        await userController.removeInvite(remove.req, res);

        expect(res.status).toHaveBeenCalledWith(remove.error.errorActiveUser.status);
        expect(db.invites.findAndCountAll).toHaveBeenCalled();

        const data = res.send.mock.calls[0][0];
        expect(data.message).toEqual(remove.error.errorActiveUser.message);
    });

    test('test invited user deleted successfully', async () => {
        db.invites.findAndCountAll.mockResolvedValue(remove.db.findAndCountAll.success);
        db.invites.destroy.mockResolvedValue(remove.db.destory.success);

        await userController.removeInvite(remove.req, res);

        expect(res.status).toHaveBeenCalledWith(remove.res.success.status);

        expect(db.invites.findAndCountAll).toHaveBeenCalled();
        expect(db.invites.destroy).toHaveBeenCalled();

        const data = res.send.mock.calls[0][0];
        expect(data.message).toEqual(remove.res.success.message);
    });

    test('test remove invite error', async () => {
        db.invites.findAndCountAll.mockResolvedValue(remove.db.findAndCountAll.success);
        db.invites.destroy.mockRejectedValue(new Error(remove.error.errorInternalUser.message));

        await userController.removeInvite(remove.req, res);

        expect(res.status).toHaveBeenCalledWith(remove.error.errorInternalUser.status);

        expect(db.invites.findAndCountAll).toHaveBeenCalled();
        expect(db.invites.destroy).toHaveBeenCalled();

        const data = res.send.mock.calls[0][0];
        expect(data.message).toEqual(remove.error.errorInternalUser.message);
    });
});
