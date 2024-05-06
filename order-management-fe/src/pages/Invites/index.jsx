import { useEffect, useState } from "react";
import { emailRegex } from "../../validations/auth";
import { inviteUser, list, remove } from "../../services/invite.service";
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import "../../assets/styles/invite.css";
import Table from "../../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import OTMModal from "../../components/Modal";

function Invites() {
    const [email, setEmail] = useState('');
    const [change, setChange] = useState(false);
    const [removeInvite, setRemoveInvite] = useState(false);
    const [inviteData, setInviteData] = useState({ count: 0, rows: [] });

    /**** sorting state ****/
    const [sorting, setSorting] = useState([]);
    
    /**** filtering state ****/
    const [filtering, setFiltering] = useState({});

    /**** pagination state ****/
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    /**** table pagination start ****/
    const onPaginationChange = (e) => {
        setPagination(e);
    }

    useEffect(() => {
        getInvites();
    }, [pagination, sorting[0]?.desc, sorting[0]?.id, filtering.field, filtering.value, change]);
    /**** table pagination end ****/

    /**** table sorting start ****/
    const onSortingChange = (e) => {
        const sortDetails = e()[0];
        const data = [...sorting][0];
        if (!data || data.id !== sortDetails.id) {
            setSorting([{ id: sortDetails.id, desc: false }]);
            return;
        }

        setSorting([{ ...data, desc: !data.desc }]);
    }
    /**** table sorting end ****/

    /**** table filtering start ****/
    const onFilterChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
 
        setFiltering({
            field: name,
            value: value
        })
    }
   /**** table filtering emd ****/

    const getInvites = async () => {
        try {
            const params = {
                skip: pagination?.pageIndex ? ( pagination?.pageIndex * pagination?.pageSize ) : undefined,
                limit: pagination?.pageSize,
                sort_key: sorting[0]?.id,
                sort_order: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
                filter_key: filtering?.field,
                filter_value: filtering?.value
            }    
            const res = await list(params.skip, params.limit, params.sort_key, params.sort_order, params.filter_key, params.filter_value);
            setInviteData(res);
        } catch (error) {
            toast.error(`Failed to invite user: ${error.message}`);
        }
    }

    const handleSend = async () => {
        try {
            await inviteUser({ email });
            setChange(!change);
            toast.success('User invited successfully');
        } catch (error) {
            toast.error(`Failed to invite user: ${error.message}`);
        }
    }

    const handleDelete = async () => {
        try {
            const payload = { id: removeInvite }
            await remove(payload);
            setChange(!change);
            setRemoveInvite(false);
            toast.success('Invite record deleted successfully');
        } catch (error) {
            toast.error(`Failed to delete invite record: ${error.message}`);
        }
    }

    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.display({
            id: 'id',
            header: 'Id',
            cell: ({ row }) => <div>{row.original.id}</div>,
        }),
        columnHelper.display({
            id: 'ownerId',
            header: 'Owner Id',
            cell: ({ row }) => <div>{row.original.ownerId}</div>,
        }),
        columnHelper.display({
            id: 'email',
            header: 'Email',
            cell: props => <div>{props.row.original.email}</div>,
        }),
        columnHelper.display({
            id: 'createdAt',
            header: 'Invited',
            cell: ({ row }) => {
                return row.original.createdAt && <div>{moment(row.original.createdAt).format('DD-MMM-YYYY')}</div>
            },
        }),
        columnHelper.display({
            id: 'status',
            header: 'Status',
            cell: ({ row }) => <div>{row.original.status}</div>,
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            enableSorting: 'FALSE',
            enableFiltering: 'FALSE',
            cell: ({ row }) => {
                return row.original.status ?
                    <Button
                        style={{ background: '#49AC60', border: 'none' }}
                        disabled={row.original.status === 'ACCEPTED'}
                        onClick={() => { setRemoveInvite(row.original.id) }}
                    >Delete</Button> : <></>
            },
        })
    ]

    return (
        <>
            <div className="position-relative">
                <div className="heading-container">
                    <h4 className="text-center text-white pt-5">Invite Manager</h4>
                </div>
                <div className="position-absolute top-100 start-50 translate-middle email-container">
                    <input
                        data-testid="invite-email-id"
                        type="text"
                        placeholder="test@test.com"
                        className="py-3 px-5 border-0 email-input"
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                    <button
                        disabled={!emailRegex.test(email)}
                        onClick={() => { handleSend() }}
                        className="py-3 px-4 border-0 send-button"
                    >Send</button>
                </div>
            </div>
            <div className="m-5 p-5 d-flex flex-column">
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
            <OTMModal
                show={removeInvite}
                size="md"
                closeText={'Cancel'}
                submitText={'Delete'}
                title={'Delete Invite'}
                description={'Are you sure you want to delete the Invite? This action cannot be undone.'}
                handleClose={setRemoveInvite}
                handleSubmit={handleDelete}
            />
        </>
    )
}

export default Invites
