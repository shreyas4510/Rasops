export const invite = {
	message: 'Success',
	btn: 'Send',
	inputId: 'invite-email-id',
	email: 'test_email@test.com',
	success: 'User invited successfully',
	err: 'Failed to fetch',
	failure: 'Failed to invite user: Failed to fetch'
};

export const defaultList = { count: 0, rows: [] };

export const noRecordId = 'no-records';
export const success = {
	res: { count: 1, rows: [{ id: 'test-invite-id' }] }
};

export const defaultRows = 10;

export const list = {
	err: 'Something went wrong',
	message: 'Failed to invite user: Something went wrong'
};

export const delRecords = {
	data: {
		counts: 2,
		rows: [
			{ id: 'test-invite-1', status: 'PENDING' },
			{ id: 'test-invite-2', status: 'ACCEPTED' }
		]
	},
	btn: 'Delete',
	modalBody: '.modal-body',
	confirmation: 'Are you sure you want to delete the Invite? This action cannot be undone.',
	modalFooter: '.modal-footer',
	btnRole: 'button',
	message: 'Invite record deleted successfully'
};
