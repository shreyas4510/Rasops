import { db } from '../../../config/database';
import userController from '../../controllers/user.controllers';
import { register, login, verify, forget, reset } from '../utils/dummy.auth';
// mock the database operations
jest.mock('../../../config/database.js', () => ({
    db: {
        users: {
            create: jest.fn(),
            findOne: jest.fn()
        }
    }
}));

// mock the email sending functions
jest.mock('../../../config/email.js', () => ({
    transporter: { sendMail: jest.fn() }
}));

// mocking express res
let res = {};

describe('testing user cases', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
    });

    // Register user test cases
    test('test invalid email to register a user', async () => {
        const { invalidEmailData } = register;
        await userController.create({ body: invalidEmailData.body }, res);

        // Status code should be 400
        expect(res.status).toHaveBeenCalledWith(invalidEmailData.res.code);

        // The res.send function is called exactly ones
        expect(res.send.mock.calls).toHaveLength(1);

        const data = res.send.mock.calls[0][0];
        expect(data).toEqual(invalidEmailData.res.data);
    });

    test('test invalid password to register a user', async () => {
        const { invalidPasswordData } = register;
        await userController.create({ body: invalidPasswordData.body }, res);

        // Status code should be 400
        expect(res.status).toHaveBeenCalledWith(invalidPasswordData.res.code);

        // The res.send function is called exactly ones
        expect(res.send.mock.calls).toHaveLength(1);

        const data = res.send.mock.calls[0][0];
        expect(data).toHaveProperty('message');
        expect(data.message).toContain(invalidPasswordData.res.data.message);
    });

    test('test invalid phone number to register a user', async () => {
        const { invalidPhoneData } = register;
        await userController.create({ body: invalidPhoneData.body }, res);

        // Status code should be 400
        expect(res.status).toHaveBeenCalledWith(invalidPhoneData.res.code);

        // The res.send function is called exactly ones
        expect(res.send.mock.calls).toHaveLength(1);

        const data = res.send.mock.calls[0][0];
        expect(data).toEqual(invalidPhoneData.res.data);
    });

    test('test invalid body to register a user', async () => {
        const { invalidData } = register;
        await userController.create({ body: invalidData.body }, res);

        // Status code should be 400
        expect(res.status).toHaveBeenCalledWith(invalidData.res.code);

        // The res.send function is called exactly ones
        expect(res.send.mock.calls).toHaveLength(1);

        const data = res.send.mock.calls[0][0];
        expect(data).toEqual(invalidData.res.data);
    });

    test('test successful register of user', async () => {
        const { user } = register;
        // mock user details
        db.users.create.mockResolvedValue(user.db);

        await userController.create({ body: user.body }, res);

        // Status code should be 201
        expect(res.status).toHaveBeenCalledWith(user.res.code);

        // The res.send function is called exactly ones
        expect(res.send.mock.calls).toHaveLength(1);

        // expected response should match the user details from mocked database
        expect(res.send).toHaveBeenCalledWith(user.db);
    });

    // Login user test cases
    test('test email not registered', async () => {
        const { unregisteredEmailData } = login;

        db.users.findOne.mockResolvedValue(undefined);
        await userController.login({ body: unregisteredEmailData.body }, res);

        // Status code should be 404
        expect(res.status).toHaveBeenCalledWith(unregisteredEmailData.res.code);

        // The res.send function is called exactly ones
        expect(res.send.mock.calls).toHaveLength(1);

        // compare the error message
        const data = res.send.mock.calls[0][0];
        expect(data).toEqual(unregisteredEmailData.res.data);
    });

    test('test invalid password', async () => {
        const { incorrectPasswordData } = login;

        db.users.findOne.mockResolvedValue(incorrectPasswordData.db);
        await userController.login({ body: incorrectPasswordData.body }, res);

        // Status code should be 401
        expect(res.status).toHaveBeenCalledWith(incorrectPasswordData.res.code);

        // The res.send function is called exactly ones
        expect(res.send.mock.calls).toHaveLength(1);

        // compare the error message
        const data = res.send.mock.calls[0][0];
        expect(data).toHaveProperty('message');
        expect(data.message).toEqual(incorrectPasswordData.res.data.message);
    });

    test('test email not verified', async () => {
        const { inActiveData } = login;

        db.users.findOne.mockResolvedValue(inActiveData.db);
        await userController.login({ body: inActiveData.body }, res);

        // Status code should be 401
        expect(res.status).toHaveBeenCalledWith(inActiveData.res.code);

        // The res.send function is called exactly ones
        expect(res.send.mock.calls).toHaveLength(1);

        // compare the error message
        const data = res.send.mock.calls[0][0];
        expect(data).toEqual(inActiveData.res.data);
    });

    test('test successful login of user', async () => {
        const { successLoginData } = login;

        db.users.findOne.mockResolvedValue(successLoginData.db);
        await userController.login({ body: successLoginData.body }, res);

        // Status code should be 200
        expect(res.status).toHaveBeenCalledWith(successLoginData.res.code);

        // The res.send function is called exactly ones
        expect(res.send.mock.calls).toHaveLength(1);

        // compare the error message
        const data = res.send.mock.calls[0][0];
        expect(data).toHaveProperty('token');
        expect(data).toHaveProperty('data');
    });

    // verify test cases
    test('test user already verified', async () => {
        const { userAlreadyVerifiedData } = verify;

        db.users.findOne.mockResolvedValue(userAlreadyVerifiedData.db);
        await userController.verify({ body: userAlreadyVerifiedData.body }, res);

        // Status code should be 400
        expect(res.status).toHaveBeenCalledWith(userAlreadyVerifiedData.res.code);

        // The res.send function is called exactly ones
        expect(res.send.mock.calls).toHaveLength(1);

        // compare the error message
        const data = res.send.mock.calls[0][0];
        expect(data).toEqual(userAlreadyVerifiedData.res.data);
    });

    test('test expired link', async () => {
        const { linkExpiredData } = verify;

        db.users.findOne.mockResolvedValue(linkExpiredData.db);
        await userController.verify({ body: linkExpiredData.body }, res);

        // Status code should be 410
        expect(res.status).toHaveBeenCalledWith(linkExpiredData.res.code);

        // The res.send function is called exactly ones
        expect(res.send.mock.calls).toHaveLength(1);

        // compare the error message
        const data = res.send.mock.calls[0][0];
        expect(data).toEqual(linkExpiredData.res.data);
    });

    test('test verify email', async () => {
        const { verifyEmailData } = verify;

        verifyEmailData.db.save = jest.fn();
        db.users.findOne.mockResolvedValue(verifyEmailData.db);
        await userController.verify({ body: verifyEmailData.body }, res);

        // Status code should be 200
        expect(res.status).toHaveBeenCalledWith(verifyEmailData.res.code);

        // The res.send function is called exactly ones
        expect(res.send.mock.calls).toHaveLength(1);

        // compare the error message
        const data = res.send.mock.calls[0][0];
        expect(data).toHaveProperty('token');
        expect(data).toHaveProperty('data');
    });

    // forgot password test cases
    test('test not verified user', async () => {
        const { unverifiedData } = forget;

        db.users.findOne.mockResolvedValue(unverifiedData.db);
        await userController.forget({ body: unverifiedData.body }, res);

        // Status code should be 403
        expect(res.status).toHaveBeenCalledWith(unverifiedData.res.code);

        // The res.send function is called exactly ones
        expect(res.send.mock.calls).toHaveLength(1);

        // compare the error message
        const data = res.send.mock.calls[0][0];
        expect(data).toEqual(unverifiedData.res.data);
    });

    test('test forgot password', async () => {
        const { forgotPasswordData } = forget;

        db.users.findOne.mockResolvedValue(forgotPasswordData.db);
        await userController.forget({ body: forgotPasswordData.body }, res);

        // Status code should be 200
        expect(res.status).toHaveBeenCalledWith(forgotPasswordData.res.code);

        // The res.send function is called exactly ones
        expect(res.send.mock.calls).toHaveLength(1);

        // compare the error message
        const data = res.send.mock.calls[0][0];
        expect(data).toEqual(forgotPasswordData.res.data);
    });

    // reset password
    test('test to reset password', async () => {
        const { resetPasswordData } = reset;

        resetPasswordData.db.save = jest.fn();
        db.users.findOne.mockResolvedValue(resetPasswordData.db);
        await userController.reset({ body: resetPasswordData.body }, res);

        // Status code should be 200
        expect(res.status).toHaveBeenCalledWith(resetPasswordData.res.code);

        // The res.send function is called exactly ones
        expect(res.send.mock.calls).toHaveLength(1);

        // compare the error message
        const data = res.send.mock.calls[0][0];
        expect(data).toEqual(resetPasswordData.res.data);
        expect(resetPasswordData.db.password).toEqual(resetPasswordData.body.newPassword);
    });
});
