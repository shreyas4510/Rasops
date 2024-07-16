import React, { useEffect, useState } from 'react';
import '../../assets/styles/invite.css';
import { createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';
import { MdDeleteForever } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import ActionDropdown from '../../components/ActionDropdown';
import OMTModal from '../../components/Modal';
import Table from '../../components/Table';
import {
    inviteUserRequest,
    listInviteRequest,
    removeInviteRequest,
    setEmail,
    setRemoveInvite,
    setSelectedInvite
} from '../../store/slice/invite.slice';
import { emailRegex } from '../../validations/auth';
function Invites() {
    const dispatch = useDispatch();
    const { change, email, inviteData, isRemoveInvite, selectedInvite } = useSelector((state) => state.invite);

    /** ** sorting state ****/
    const [sorting, setSorting] = useState([]);

    /** ** filtering state ****/
    const [filtering, setFiltering] = useState({});

    /** ** pagination state ****/
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    /** ** table pagination start ****/
    const onPaginationChange = (e) => {
        setPagination(e);
    };

    useEffect(() => {
        getInvites();
    }, [pagination, sorting[0]?.desc, sorting[0]?.id, filtering.field, filtering.value, change]);
    /** ** table pagination end ****/

    /** ** table sorting start ****/
    const onSortingChange = (e) => {
        const sortDetails = e()[0];
        const data = [...sorting][0];
        if (!data || data.id !== sortDetails.id) {
            setSorting([{ id: sortDetails.id, desc: false }]);
            return;
        }

        setSorting([{ ...data, desc: !data.desc }]);
    };
    /** ** table sorting end ****/

    /** ** table filtering start ****/
    const onFilterChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setFiltering({
            field: name,
            value
        });
    };
    /** ** table filtering emd ****/

    const getInvites = async () => {
        const params = {
            skip: pagination?.pageIndex ? pagination?.pageIndex * pagination?.pageSize : undefined,
            limit: pagination?.pageSize,
            sortKey: sorting[0]?.id,
            sortOrder: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
            filterKey: filtering?.field,
            filterValue: filtering?.value
        };
        dispatch(listInviteRequest(params));
    };

    const handleSend = () => {
        dispatch(inviteUserRequest({ email }));
    };

    const handleClose = () => {
        dispatch(setRemoveInvite());
    };
    const handleDelete = () => {
        dispatch(removeInviteRequest(selectedInvite));
    };

    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.display({
            id: 'email',
            header: 'Email',
            cell: (props) => <div>{props.row.original.email}</div>
        }),
        columnHelper.display({
            id: 'createdAt',
            header: 'Invited',
            cell: ({ row }) => {
                return row.original.createdAt && <div>{moment(row.original.createdAt).format('DD-MMM-YYYY')}</div>;
            }
        }),
        columnHelper.display({
            id: 'status',
            header: 'Status',
            cell: ({ row }) => <div>{row.original.status}</div>
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            enableSorting: 'FALSE',
            enableFiltering: 'FALSE',
            cell: ({ row }) => {
                return row.original.status ? (
                    <ActionDropdown
                        disabled={row.original.status.toUpperCase() === 'ACCEPTED'}
                        options={[
                            {
                                label: 'Delete',
                                icon: MdDeleteForever,
                                meta: { id: row.original.id },
                                onClick: () => {
                                    dispatch(setSelectedInvite(row.original.id));
                                    handleClose();
                                }
                            }
                        ]}
                    />
                ) : (
                    <></>
                );
            }
        })
    ];

    return (
        <>
            <div className="position-relative">
                <div className="heading-container">
                    <h4 className="text-center text-white pt-5">Invite Manager</h4>
                </div>
                <div className="d-flex flex-column align-items-center my-3">
                    <div className='email-container'>
                        <input
                            data-testid="invite-email-id"
                            type="text"
                            placeholder="test@test.com"
                            className="py-3 px-5 border-0 email-input"
                            value={email || ''}
                            onChange={(e) => {
                                dispatch(setEmail(e.target.value));
                            }}
                        />
                        <button
                            disabled={!emailRegex.test(email)}
                            onClick={() => {
                                handleSend();
                            }}
                            className="py-3 px-4 border-0 send-button"
                        >
                            Send
                        </button>
                    </div>
                    { email && !emailRegex.test(email) && <p className='error-text m-0'>Invalid Email</p> }
                </div>
            </div>
            <div className="mx-5 d-flex flex-column">
                <Table
                    columns={columns}
                    data={inviteData.rows}
                    count={inviteData.count}
                    // pagination props
                    onPaginationChange={onPaginationChange}
                    pagination={pagination}
                    // sorting props
                    onSortingChange={onSortingChange}
                    sorting={sorting}
                    // filtering props
                    onFilterChange={onFilterChange}
                    filtering={filtering}
                />
            </div>
            <OMTModal
                show={isRemoveInvite}
                size="md"
                closeText={'Close'}
                submitText={'Delete'}
                title={'Delete Invite'}
                description={'Are you sure you want to delete the Invite? This action cannot be undone.'}
                handleClose={handleClose}
                handleSubmit={handleDelete}
            />
        </>
    );
}

export default Invites;
