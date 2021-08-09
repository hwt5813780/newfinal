import React from 'react'
import {Card, Button, Table, Switch, Divider, Modal, message, notification} from 'antd'
import {getResourceList, setFocusResource, deleteResource} from "../../../api/resourceApi";
import config from "../../../config/config";

export default class ResourceList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            resourceList: [],
            totalSize: 0,
            pageSize: 10
        }
    }

    componentDidMount() {
        // 加载列表数据
        this._loadData();
    }

    _loadData = (page_num = 1, page_size = 10) => {
        getResourceList(page_num, page_size).then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    totalSize: result.data.resource_count,
                    resourceList: result.data.resource_list
                })
            }
        }).catch(() => {
            message.error('Fail to list!');
        })
    };

    // 列的配置信息
    columns = [
        {title: 'Staff ID', dataIndex: 'staff_id', key: 'staff_id', align: 'center'},
        {
            title: 'Profile', dataIndex: 'profile', key: 'profile', align: 'center',
            render: (text, record) => {
                return (
                    <img src={config.BASE_URL + record.profile} alt="profile" style={{width:50,borderRadius:'50%'}} />
                )
            }
        },
        {title: 'Name', dataIndex: 'name', key: 'name', align: 'center'},
        {title: 'Position', dataIndex: 'position', key: 'position', align: 'center'},
        {title: 'Phone', dataIndex: 'phone', key: 'phone', align: 'center'},
        {title: 'email', dataIndex: 'email', key: 'email', align: 'center'},
        {title: 'Purchase Quantity', dataIndex: 'purchase_quantity', key: 'purchase_quantity', align: 'center'},
        {title: 'Purchase Cost', dataIndex: 'purchase_cost', key: 'purchase_cost', align: 'center'},
        {title: 'Sale Quantity', dataIndex: 'sale_quantity', key: 'sale_quantity', align: 'center'},
        {title: 'Sale Value', dataIndex: 'sale_value', key: 'sale_value', align: 'center'},
        {
            title: 'Action', align: 'center',
            render: (text, record) => {
                return (
                    <div>
                        <Button type="link" onClick={() => {
                            this.props.history.push({
                                pathname: '/resource/resource-edit',
                                state: {
                                    resource: record
                                }
                            });
                        }}>Edit</Button>
                        <Divider type="vertical"/>
                        <Button type="link" onClick={() => {
                            Modal.confirm({
                                title: 'Delete',
                                content: 'Are you sure to delete the staff member?',
                                okText: 'Yes',
                                cancelText: 'No',
                                onOk: () => {
                                    deleteResource(record.id).then(result => {
                                        if (result && result.status === 1) {
                                            message.success(result.msg);
                                            this._loadData();
                                        } else {
                                            message.error('Delete Failed!');
                                        }
                                    }).catch(() => {
                                        message.error('Delete Failed!');
                                    })
                                }
                            });
                        }}>Delete</Button>
                    </div>
                )
            }
        },
    ];

    render() {
        // 添加按钮
        let addBtn = (
            <Button type={"primary"} onClick={() => {
                this.props.history.push('/resource/resource-add');
            }}>
                Add New Staff Member
            </Button>
        );

        return (
            <Card title={"Staff List"} extra={addBtn}>
                <Table
                    columns={this.columns}
                    dataSource={this.state.resourceList}
                    rowKey={"id"}
                    pagination={{
                        total: this.state.totalSize,
                        pageSize: this.state.pageSize,
                        onChange: (pageNum, pageSize) => {
                            console.log('需要加载' + pageNum, pageSize);
                            this._loadData(pageNum, pageSize)
                        }
                    }}
                />
            </Card>
        )
    }
}