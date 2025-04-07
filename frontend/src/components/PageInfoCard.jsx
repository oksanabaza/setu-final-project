import React, { useState } from 'react';
import { Card, Row, Col, Button, Typography } from 'antd';

const { Title, Text } = Typography;

const PageInfoCard = () => {
  const [showDescription, setShowDescription] = useState(false);

  const handleExpandClick = () => {
    setShowDescription(!showDescription);
  };

  return (
   <div>
      <Row align="middle" justify="space-between" gutter={8}> 
        <Col>
          <Title level={4} style={{ marginBottom: 0 }}> 
            Websites
          </Title>
        </Col>
        <Col>
          <Button
            type="link"
            style={{ padding: 0 }} 
            onClick={handleExpandClick}
          >
            {showDescription ? 'Show Less' : 'Learn More'}
          </Button>
        </Col>
      </Row>

      {showDescription && (
        <Text style={{ marginTop: 8, display: 'block' }}>
          This page helps you manage websites, track scraping tasks, and view
          results. You can add new websites, manage existing ones, and monitor
          the scraping progress effectively.
        </Text>
      )}
  </div>
  );
};

export default PageInfoCard;
