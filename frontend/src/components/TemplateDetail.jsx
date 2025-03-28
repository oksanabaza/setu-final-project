import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Alert, Button, message } from 'antd';
import BaseLayout from './BaseLayout';

const TemplateDetails = ({ onLogout }) => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrapeResult, setScrapeResult] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const templateResponse = await fetch(`http://localhost:8080/templates/${id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        if (!templateResponse.ok) {
          throw new Error('Failed to fetch template details.');
        }
        const templateData = await templateResponse.json();

        const websitesResponse = await fetch('http://localhost:8080/websites', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        if (!websitesResponse.ok) {
          throw new Error('Failed to fetch websites.');
        }
        const websitesData = await websitesResponse.json();

        setTemplate(templateData);
        setWebsites(websitesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleScrape = async () => {
    if (!template) {
      message.error("Template data is missing.");
      console.error("Error: No template data available.");
      return;
    }
  
    
    const linksArray = Array.isArray(template.settings.links)
      ? template.settings.links
      : [template.settings.links]; 
  
    if (linksArray.length === 0) {
      message.error("No valid links found to scrape.");
      console.error("Error: No valid links found.", template.settings.links);
      return;
    }
  
    const scrapePayload = {
      links: linksArray, 
      elements: {
        title: "//h1",
        description: "//meta[@name='description']/@content",
      },
      is_xpath: true,
      type: "detailed",
    };
  
    console.log("Sending Scrape Request:", JSON.stringify(scrapePayload, null, 2));
  
    try {
      const response = await fetch("http://localhost:8080/scrape", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scrapePayload),
      });
  
      console.log("Scrape Response Status:", response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Scraping failed:", errorText);
        throw new Error(`Scraping failed: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("Scrape Result:", data);
      setScrapeResult(data);
      message.success("Scraping successful!");
    } catch (err) {
      console.error("Error during scraping:", err);
      message.error(`Scraping failed: ${err.message}`);
    }
  };
  
  
  
  

  const handleDownload = () => {
    if (!scrapeResult) return;

    const blob = new Blob([JSON.stringify(scrapeResult, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `scraped_data_${new Date().toISOString()}.json`;
    link.click();
  };

  if (loading) return <Spin size="large" tip="Loading template details..." />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  const websiteName = websites.find((site) => site.id === template.website_id)?.name || 'Unknown';

  return (
    <BaseLayout
      onLogout={onLogout}
      breadcrumbs={[
        { title: 'Home' },
        { title: 'Dashboard' },
        { title: 'Templates', path: '/templates' },
        { title: template.name },
      ]}
    >
      <Card title={template.name}>
        <p><strong>ID:</strong> {template.id}</p>
        <p><strong>Website:</strong> {websiteName}</p>
        <p><strong>Status:</strong> {template.is_active ? 'Active' : 'Inactive'}</p>
        <p><strong>Created:</strong> {template.created_at}</p>
        <p>{template.settings.description}</p>
        <p>{template.settings.links}</p>
        <p>{template.settings.scrapingLevel}</p>

        <Button type="primary" onClick={handleScrape} style={{ marginTop: 16 }}>
          Scrape Now
        </Button>

        {scrapeResult && (
          <>
            <pre style={{ marginTop: 16, whiteSpace: 'pre-wrap' }}>{JSON.stringify(scrapeResult, null, 2)}</pre>
            <Button type="default" onClick={handleDownload} style={{ marginTop: 8 }}>
              Download JSON
            </Button>
          </>
        )}
      </Card>
    </BaseLayout>
  );
};

export default TemplateDetails;
