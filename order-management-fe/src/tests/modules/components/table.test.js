import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Table from '../../../components/Table';
import {
    columnText,
    defaultRows,
    filterInputTestId,
    getData,
    last,
    next,
    noRecordsId,
    pagesTestId,
    pagesText,
    pagination,
    rowRole,
    searchText,
    tableRole
} from '../../utils/components/dummy.table';

// Initialize an empty array to hold table columns
let columns = [];

// Test suite for Table component
describe('test table components', () => {
    // Before all tests, create columns using createColumnHelper from react-table
    beforeAll(() => {
        const columnHelper = createColumnHelper();
        columns = [
            columnHelper.display({
                id: 'id',
                header: 'Id',
                cell: ({ row }) => <div>{row.original.id}</div>
            }),
            columnHelper.display({
                id: 'name',
                header: 'Name',
                cell: ({ row }) => <div>{row.original.ownerId}</div>
            })
        ];
    });

    // Test to check if the table renders correctly when there is no data
    test('test check table rendering', async () => {
        render(<Table />);

        const table = screen.getByRole(tableRole);
        expect(table).toBeInTheDocument();

        const noData = screen.getByTestId(noRecordsId);
        expect(noData).toBeInTheDocument();
    });

    // Test to check if data is rendered correctly in the table
    test('test data rendering', async () => {
        const data = getData(5);
        render(<Table columns={columns} data={data} count={data.length} />);

        const table = screen.getByRole(tableRole);
        expect(table).toBeInTheDocument();

        const rows = screen.getAllByRole(rowRole, { within: table });
        const noOfRows = rows.length - 1; // Subtracting 1 for the header row
        expect(noOfRows).toEqual(defaultRows);
    });

    // Test to check pagination functionality of the table
    test('test table pagination', async () => {
        const data = getData(10);

        const onPaginationChange = jest.fn();
        render(
            <Table
                columns={columns}
                data={data}
                count={data.length * 5} // Count is set to a higher value for pagination testing
                onPaginationChange={onPaginationChange}
                pagination={pagination}
            />
        );

        const table = screen.getByRole(tableRole);
        const rows = screen.getAllByRole(rowRole, table);

        const noOfRows = rows.length - 1;
        expect(noOfRows).toEqual(10); // Expecting 10 rows per page

        const pages = screen.getByTestId(pagesTestId);
        expect(pages).toContainHTML(pagesText);

        const nextBtn = screen.getByTestId(next);
        const lastBtn = screen.getByTestId(last);

        // Clicking pagination buttons and checking if onPaginationChange is called
        await act(async () => {
            userEvent.click(nextBtn);
            expect(onPaginationChange).toHaveBeenCalledTimes(1);

            userEvent.click(lastBtn);
            expect(onPaginationChange).toHaveBeenCalledTimes(2);
        });
    });

    // Test to check sorting functionality of the table
    test('test table sorting', async () => {
        const data = getData(5);

        const sorting = [];
        const onSortingChange = jest.fn();

        render(
            <Table columns={columns} data={data} count={data.length} onSortingChange={onSortingChange} sorting={sorting} />
        );

        const header = screen.getByText(columnText);
        await act(async () => {
            userEvent.click(header);
            expect(onSortingChange).toHaveBeenCalled();
        });
    });

    // Test to check filtering functionality of the table
    test('test table filters', async () => {
        const data = getData(5);

        const filtering = [];
        const onFilterChange = jest.fn();

        render(
            <Table columns={columns} data={data} count={data.length} onFilterChange={onFilterChange} filtering={filtering} />
        );

        const input = screen.getByTestId(filterInputTestId);
        await act(async () => {
            const value = searchText;
            userEvent.type(input, value);
            expect(onFilterChange).toHaveBeenCalledTimes(value.length);
        });
    });
});
