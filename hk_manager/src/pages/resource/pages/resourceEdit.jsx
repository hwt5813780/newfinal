import React from 'react'
import {Card, Form, Input, Select, Upload, message, Button} from 'antd'
import {InboxOutlined} from '@ant-design/icons'
import Moment from 'moment'

import KaiUploadImg from '../../../components/KaiUploadImg'
import {
    getResourceClasses,
    getResourceMeta,
    getResourceFormat,
    getResourceCategory,
    getResourceArea,
    editResource,
    getFileList
} from "../../../api/resourceApi";
import {getUser} from "../../../api/adminApi";

const {Option} = Select;


export default class ResourceEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '',
            focusImgUrl: '',

            dragFileList: [], // 存放上传的文件
            resource_classes: [],
            resource_meta: [],
            resource_format: [],
            resource_category: [],
            resource_area: [],
            resource_id: '',
            resource_content_tag: ''
        };

        this.resourceFormRef = React.createRef();
    }

    componentDidMount() {
        if (!this.props.location.state) {
            this.setState = () => false;
            this.props.history.goBack();
        }

        // 0. 获取上一个界面传递的数据
        if (this.props.location.state) {
            const resourceItem = this.props.location.state.resource;
            if (resourceItem) {
                this.resourceFormRef.current.setFieldsValue(resourceItem);
                // 封面图/轮播图/直播信息id
                this.setState({
                    imageUrl: resourceItem.resource_img, // 资源封面
                    focusImgUrl: resourceItem.focus_img, // 轮播图封面
                    resource_id: resourceItem.id,
                    resource_content_tag: resourceItem.resource_content
                });
            }

            // 1. 获取文件
            getFileList(resourceItem.resource_content).then((result) => {
                if (result && result.status === 1) {
                    this.setState({
                        dragFileList: result.data
                    })
                }
            }).catch((error) => {
                console.log(error);
            });
        }


        getResourceClasses().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    resource_classes: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        });

        getResourceArea().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    resource_area: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        });

        getResourceCategory().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    resource_category: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        });

        getResourceFormat().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    resource_format: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        });

        getResourceMeta().then((result) => {
            if (result && result.status === 1) {
                this.setState({
                    resource_meta: result.data
                })
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 2}
            },
            wrapperCol: {
                xs: {span: 12}
            },
        };

        const {
            resource_classes,
            resource_meta,
            resource_format,
            resource_category,
            resource_area
        } = this.state;

        const onFinish = values => {
            const {imageUrl, focusImgUrl, dragFileList, resource_id, resource_content_tag} = this.state;
            if (!imageUrl) {
                message.warning('请上传资源封面!');
                return;
            }

            // 1. 生成创建日期
            const resource_publish_time = Moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

            // 2. 上传资源
            editResource(getUser().token, resource_id, values.resource_name, values.resource_author, resource_publish_time, dragFileList, values.resource_category_id, values.resource_classes_id, values.resource_area_id, values.resource_meta_id, values.resource_format_id, imageUrl, values.resource_price, focusImgUrl, resource_content_tag).then((result) => {
                if (result && result.status === 1) {
                    message.success(result.msg);
                    this.props.history.goBack();
                }
            }).catch((error) => {
                message.error('编辑直播课失败!');
            })
        };

        const {imageUrl, focusImgUrl} = this.state;
        return (
            <Card title="编辑幼教资源">
                <Form  {...formItemLayout} onFinish={onFinish} ref={this.resourceFormRef}>
                    <Form.Item
                        label={"Staff ID"}
                        name="staff_id"
                        rules={[{required: true, message: 'Enter the ID'}]}
                    >
                        <Input style={{width:'30%'}}/>
                    </Form.Item>
                    <Form.Item
                        label={"Profile"}
                        name="resource_img"
                    >
                        <KaiUploadImg
                            upLoadBtnTitle={"Upload Profile"}
                            upLoadName={"profile"}
                            upLoadAction={"/api/auth/resource/upload_resource"}
                            upImage={imageUrl}
                            successCallBack={(name) => {
                                this.setState({
                                    imageUrl: name
                                })
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"Name"}
                        name="name"
                        rules={[{required: true, message: 'Enter the name'}]}
                    >
                        <Input style={{width:'30%'}}/>
                    </Form.Item>
                    <Form.Item
                        label="Position"
                        name="position"
                        rules={[{required: true, message: 'Choose the position'}]}
                    >
                        <Select placeholder={"Choose Position"} style={{width: "30%"}}>
                            <Option value="Manager" key="Manager">Manager</Option>
                            <Option value="Purchaser" key="Purchaser">Purchaser</Option>
                            <Option value="Salesman" key="Salesman">Salesman</Option>
                            <Option value="Other" key="Other">Other</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={"Phone"}
                        name="phone"
                        rules={[{required: true, message: 'Enter the phone'}]}
                    >
                        <Input style={{width:'30%'}}/>
                    </Form.Item>
                    <Form.Item
                        label={"Email"}
                        name="email"
                        rules={[{required: true, message: 'Enter the email'}]}
                    >
                        <Input style={{width:'30%'}}/>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{span: 16}}
                    >
                        <div style={{textAlign: 'center', marginTop: 30}}>
                            <Button type={"primary"} htmlType={"submit"} style={{marginRight: 15}}>修改</Button>
                            <Button onClick={() => {
                                this.props.history.goBack()
                            }}>取消</Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}