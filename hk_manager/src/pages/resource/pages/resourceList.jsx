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
            pageSize: 4
        }
    }

    componentDidMount() {
        // 加载列表数据
        this._loadData();
    }

    _loadData = (page_num = 1, page_size = 4) => {
        getResourceList(page_num, page_size).then((result) => {
            if (result && result.status === 1) {
                message.success(result.msg);
                this.setState({
                    totalSize: result.data.resource_count,
                    resourceList: result.data.resource_list
                })
            }
        }).catch(() => {
            message.error('获取资源列表失败!');
        })
    };

    // 列的配置信息
    columns = [
        {title: 'Staff ID', dataIndex: 'staff_id', key: 'staff_id', align: 'center'},
        {
            title: 'Profile', dataIndex: 'profile', key: 'profile', align: 'center',
            render: (text, record) => {
                return (
                    <img src={config.BASE_URL + record.resource_img} alt="profile" width={100}/>
                )
            }
        },
        {title: 'Name', dataIndex: 'name', key: 'name', align: 'center'},
        {title: 'Position', dataIndex: 'position', key: 'position', align: 'center'},
        {
            title: '操作', align: 'center',
            render: (text, record) => {
                return (
                    <div>
                        <Button onClick={() => {
                            this.props.history.push({
                                pathname: '/resource/resource-edit',
                                state: {
                                    resource: record
                                }
                            });
                        }}>编辑</Button>
                        <Divider type="vertical"/>
                        <Button onClick={() => {
                            Modal.confirm({
                                title: '确认删除吗?',
                                content: '删除此资源,所有关联的内容都会被删除',
                                okText: '确认',
                                cancelText: '取消',
                                onOk: () => {
                                    deleteResource(record.id).then(result => {
                                        if (result && result.status === 1) {
                                            message.success(result.msg);
                                            this._loadData();
                                        } else {
                                            message.error('删除失败!');
                                        }
                                    }).catch(() => {
                                        message.error('删除失败!');
                                    })
                                }
                            });
                        }}>删除</Button>
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
                添加幼教资源
            </Button>
        );

        return (
            <Card title={"幼教资源列表"} extra={addBtn}>
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