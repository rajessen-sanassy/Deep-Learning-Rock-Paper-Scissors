import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import { CoreContext } from '../Provider';

const AuthCard = () => {
    const { user, login, signup } = useContext(CoreContext)
    const [authType, setAuthType] = useState('signup')

    const formRef = useRef()

    const onFinish = () => {
        if(authType === 'signup') {
            const data = formRef.current.getFieldsValue()
            signup(data)
        } else {
            login()
        }
    }

    const screen = {
        login: (
            <div>
                <p className="info-title">Login</p>
                <p className="info-description">
                    Face towards your camera to log into RPLSS.
                </p>

                <Button type="primary" block onClick={onFinish}>Login</Button>

                <div style={{textAlign: "center", paddingTop: "12px"}}>
                    <span>
                        Haven't registered your face? 
                        <a onClick={() => setAuthType("signup")}> Signup</a>
                    </span>
                </div>
            </div>
        ),
        signup: (
            <div>
                <p className="info-title">Signup</p>
                <p className="info-description">
                    Face towards your camera and keep still so that we can train our AI to detect your face in the future.
                </p>                

                <Form onFinish={onFinish} ref={formRef}>
                    <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name.'}]}>
                        <Input id='name' prefix={<UserOutlined/>} placeholder="Name"/>
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>Signup</Button>

                    <div style={{textAlign: "center", paddingTop: "12px"}}>
                        <span>
                            Already registered your face? 
                            <a onClick={() => setAuthType("login")}> Login</a>
                        </span>
                    </div>
                </Form>                
            </div>
        ),
    }
    
    if(user) return <div/>

    return (
        <div className="info-card">
            {screen[authType]}
        </div>
    );
};

export default AuthCard;