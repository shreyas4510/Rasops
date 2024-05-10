export const tableRole = 'table';

export const rowRole = 'row';

export const noRecordsId = 'no-records';

export const getData = (len) => {
    return [...Array(len)].map((item, i) => ({
        id: `test-id-${i}`,
        name: `test-name-${i}`
    }));
};

export const defaultRows = 10;

export const pagination = {
    pageIndex: 0,
    pageSize: 10
};

export const pagesTestId = 'page-count';

export const pagesText = '1 of 5';

export const next = 'next-page';

export const last = 'last-page';

export const columnText = 'Name';

export const filterInputTestId = 'filter-input-name';

export const searchText = 'testing filter';
