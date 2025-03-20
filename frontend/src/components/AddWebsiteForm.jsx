import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { addSite } from '../utils/api';  

const AddWebsiteForm = ({ onSiteAdded }) => {
  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSite({ name: siteName, url: siteUrl });
      onSiteAdded();  
      setSiteName('');
      setSiteUrl('');
    } catch (err) {
      console.error('Error adding website:', err);
    }
  };

  return (
    <div>
      <h2>Add a New Website</h2>
      <Form onSubmitCapture={handleSubmit}>
        <Form.Item label="Website Name">
          <Input
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            required
            placeholder="Enter website name"
          />
        </Form.Item>
        <Form.Item label="Website URL">
          <Input
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            required
            placeholder="Enter website URL"
          />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Add Website
        </Button>
      </Form>
    </div>
  );
};

export default AddWebsiteForm;
