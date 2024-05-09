import React from 'react';
import { render, screen } from '@testing-library/react';
import NoData from '../../../components/NoData';
import { id } from '../../utils/components/dummy.nodata';

describe('test no data component', () => {
	test('test no data ', async () => {
		render(<NoData />);
		const logo = screen.getByTestId(id);
		expect(logo).toBeInTheDocument();
	});
});
