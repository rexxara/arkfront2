import React, { FormEvent } from 'react';
import { Input, Form, Button } from 'antd'
const { TextArea } = Input

import { connect } from 'dva'
interface IProps {
    form: any,
    dispatch: Function,
    script: string
}
const form = (props: IProps) => {
    const { getFieldDecorator } = props.form
    const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault()
        props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                props.dispatch({
                    type: 'global/submitScript',
                    payload: { ...values, edited: true },
                });
            }
        })
    }
    return <Form onSubmit={handleSubmit}>
        <Form.Item>
            {getFieldDecorator('script', {
                initialValue: props.script
            })(
                <TextArea rows={10} />
            )}
        </Form.Item>
        <Form.Item>
            <Button type="primary" htmlType="submit">
                run
          </Button>
        </Form.Item>
    </Form>
}
const ScriptEditor = Form.create({ name: 'playGround' })(form);

export default connect(({ global: { script } }) => ({
    script,
}))(ScriptEditor);