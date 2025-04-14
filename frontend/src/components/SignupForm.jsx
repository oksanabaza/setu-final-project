import React, { useState } from 'react';
import { Form, Input, Button, Alert, Typography, Space } from 'antd';
import { signup } from '../utils/api';
import { Link } from 'react-router-dom'; 

const { Title, Link:AntLink } = Typography;

const SignupForm = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    const { email, password } = values;
    try {
      await signup(email, password);
      onSignup(); 
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <Title level={2} style={{ textAlign: 'center' }}>Signup</Title>
        {error && <Alert message={error} type="error" showIcon />}
        
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
          >
            <Input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" block htmlType="submit">
              Signup
            </Button>
          </Form.Item>
        </Form>

        
        <div style={{ textAlign: 'center' }}>
                <AntLink>
                  <Link to="/login">Already have an account? Back to Login</Link>
                </AntLink>
              </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', 
    background: '#001529', 
    boxSizing: 'border-box',
    margin:0,
    padding:0
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px', 
    padding: '20px',
    background: '#f0f2f5', 
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
    boxSizing: 'border-box',
  },
};

export default SignupForm;
