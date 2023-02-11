import { useEffect, useState } from "react";
import { definePageConfig } from "ice";
import { Button, Drawer, Form, Input, InputNumber, Modal } from "antd";
import {
  SettingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import "./index.less";

export default function Home() {
  const STORAGE_KEY = "FITNESS_MARK_DS";
  const [visible, setVisible] = useState(false);
  const [ds, setDs] = useState<Array<IItem>>([]);
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    form.resetFields();
  }, [visible]);

  useEffect(() => {
    const localDS = localStorage.getItem(STORAGE_KEY);

    if (localDS === null) {
      const exampleDS = [
        {
          title: "示例俯卧撑",
          groupCount: 3,
          groupList: new Array(3).fill(0),
        },
      ];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(exampleDS));
      setDs(exampleDS);
    } else {
      try {
        setDs(JSON.parse(localDS));
      } catch (error) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      }
    }
  }, []);

  return (
    <div className="app">
      <div className="app-header">
        <SettingOutlined
          style={{ color: "#fff", fontSize: 25 }}
          onClick={() => {
            setVisible(true);
          }}
        />
      </div>
      {ds.map((item, dsIndex, dsArr) => (
        <>
          <div className="app-item">
            <div className="app-item-title">{item.title}</div>
            {item.groupList.map((value, gIndex) => (
              <div className="app-item-group">
                <div className="app-item-group-name">第 {gIndex + 1} 组</div>
                {[...new Array(10)].map((_, _index) => (
                  <div
                    className={`app-item-group-item ${
                      _index < value ? "app-item-group-item-done" : ""
                    }`}
                    onClick={() => {
                      // 已选
                      if (_index + 1 <= value && _index === 0) {
                        ds[dsIndex].groupList[gIndex] = _index;
                      } else {
                        ds[dsIndex].groupList[gIndex] = _index + 1;
                      }

                      setDs([...ds]);
                      localStorage.setItem(STORAGE_KEY, JSON.stringify(ds));
                    }}
                  >
                    {_index + 1}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {dsArr.length - 1 === dsIndex ? null : (
            <div className="app-dash"></div>
          )}
        </>
      ))}
      <Drawer
        maskClosable={false}
        open={visible}
        title="设置"
        onClose={() => {
          setVisible(false);
        }}
      >
        <Form
          initialValues={{
            ds: ds.map((item) => ({
              title: item.title,
              groupCount: item.groupCount,
              groupListCount: item.groupList.length,
            })),
          }}
          form={form}
          name="dynamic_form_nest_item"
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.List name="ds">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index, arr) => (
                  <div key={key} className="app-form-item">
                    <div style={{ flexGrow: 1 }}>
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
                        rules={[{ required: true, message: "必填" }]}
                      >
                        <Input placeholder="运动名称，如：俯卧撑" />
                      </Form.Item>
                      <div className="app-form-item-both">
                        <Form.Item
                          {...restField}
                          name={[name, "groupCount"]}
                          rules={[{ required: true, message: "必填" }]}
                        >
                          <InputNumber placeholder="组数" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "groupListCount"]}
                          rules={[{ required: true, message: "必填" }]}
                        >
                          <InputNumber placeholder="每组次数" />
                        </Form.Item>
                      </div>
                    </div>

                    <MinusCircleOutlined
                      style={{ fontSize: 20, marginLeft: 10 }}
                      onClick={() => remove(name)}
                    />
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加运动
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
        <Button
          block
          type="primary"
          onClick={() => {
            form.validateFields().then((values) => {
              modal.confirm({
                title: "确认保存？",
                icon: <ExclamationCircleOutlined />,
                content: "保存后，将会清空所有数据",
                okText: "确认",
                cancelText: "取消",
                onOk: () => {
                  const newDs = values.ds.map((item) => ({
                    title: item.title,
                    groupCount: item.groupCount,
                    groupList: new Array(item.groupListCount).fill(0),
                  }));

                  setVisible(false);
                  setDs(newDs);
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(newDs));
                },
              });
            });
          }}
        >
          保存
        </Button>
      </Drawer>
      {contextHolder}
    </div>
  );
}

export const pageConfig = definePageConfig(() => ({
  title: "Fitness Mark",
}));