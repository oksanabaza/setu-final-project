import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert, Button, message } from 'antd';
import BaseLayout from './BaseLayout';
import { useParams, useNavigate } from 'react-router-dom';

const TemplateDetails = ({ onLogout }) => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrapeResult, setScrapeResult] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

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
        console.log('Template Data:', templateData);
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
  const flattenObject = (obj, parentKey = '', res = {}) => {
    for (let key in obj) {
      const propName = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], propName, res);
      } else {
        res[propName] = Array.isArray(obj[key]) ? obj[key].join('; ') : obj[key];
      }
    }
    return res;
  };
  
  const handleDownloadCSV = () => {
    if (!scrapeResult || !Array.isArray(scrapeResult)) {
      message.error("Scrape result is not an array.");
      return;
    }
  
    const flatData = scrapeResult.map(item => flattenObject(item));
    const headers = [...new Set(flatData.flatMap(obj => Object.keys(obj)))];
  
    const csvRows = [
      headers.join(","), 
      ...flatData.map(row =>
        headers.map(header =>
          `"${(row[header] ?? "").toString().replace(/"/g, '""')}"`
        ).join(",")
      )
    ];
  
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `scraped_data_${new Date().toISOString()}.csv`;
    link.click();
  };
  
  
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

      let scrapePayload = {
        links: linksArray,
        is_xpath: template.is_xpath,
        type: template.scraping_type,
        wrapper: template.wrapper.String,
      };

      if (template.settings.elements && template.settings.elements.description) {
        scrapePayload.elements = {
          description: template.settings.elements.description,
          price: template.settings.elements.price,
          title: template.settings.elements.title,
        };
      } else {
        scrapePayload.elements = {
          description: template.settings.description,
          price: template.settings.price,
          title: template.settings.title,
        };
      }
  
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
      <Card title={template.name}  extra={
        <Button
          type="default"
          onClick={() => navigate(`/templates/edit/${template.id}`)}
        >
          Edit Template
        </Button>
      }>
        <p><strong>ID:</strong> {template.id}</p>
        <p><strong>Website:</strong> {websiteName}</p>
        <p><strong>Status:</strong> {template.is_active ? 'Active' : 'Inactive'}</p>
        <p><strong>Created:</strong> {template.created_at}</p>
        <p>{template.settings.description}</p>
        <p>{template.settings.links}</p>
        <p>{template.settings.scrapingLevel}</p>
        <p><strong>wrapper:</strong> {template.wrapper.String}</p>
        <p><strong>type:</strong> {template.scraping_type}</p>

        <Button type="primary" onClick={handleScrape} style={{ marginTop: 16 }}>
          Scrape Now
        </Button>
         {scrapeResult && (
    <Card
      type="inner"
      title="Scrape Result"
      style={{
        marginTop: 16,
        backgroundColor: '#f6f8fa',
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(scrapeResult, null, 2)}</pre>
      <Button type="default" onClick={handleDownload} style={{ marginTop: 8 }}>
        Download JSON
      </Button>
      <Button type="default" onClick={handleDownloadCSV} style={{ marginTop: 8, marginLeft: 8 }}>
        Download CSV
      </Button>
    </Card>
  )}
      </Card>
  );
};

export default TemplateDetails;
