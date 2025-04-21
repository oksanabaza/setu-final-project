import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert, Button, message, Descriptions } from 'antd';
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
        const [templateResponse, websitesResponse] = await Promise.all([
          fetch(`https://setu-final-project.onrender.com/templates/${id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          }),
          fetch('https://setu-final-project.onrender.com/websites', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          }),
        ]);

        if (!templateResponse.ok || !websitesResponse.ok) {
          throw new Error('Failed to fetch data.');
        }

        const [templateData, websitesData] = await Promise.all([
          templateResponse.json(),
          websitesResponse.json(),
        ]);

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
    if (!template) return message.error("Template data is missing.");

    const linksArray = Array.isArray(template.settings.links)
      ? template.settings.links
      : [template.settings.links];

    if (linksArray.length === 0) return message.error("No valid links to scrape.");

    const scrapePayload = {
      links: linksArray,
      is_xpath: template.is_xpath,
      type: template.scraping_type,
      wrapper: template.wrapper.String,
      elements: template.settings.elements?.description
        ? {
            description: template.settings.elements.description,
            price: template.settings.elements.price,
            title: template.settings.elements.title,
          }
        : {
            description: template.settings.description,
            price: template.settings.price,
            title: template.settings.title,
          },
    };

    try {
      const response = await fetch("https://setu-final-project.onrender.com/scrape", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scrapePayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Scraping failed: ${errorText}`);
      }

      const data = await response.json();
      setScrapeResult(data);
      message.success("Scraping successful!");
    } catch (err) {
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
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  const websiteName = websites.find(site => site.id === template.website_id)?.name || 'Unknown';

  return (
      <Card
        title={`Template: ${template.name}`}
        extra={
          <Button onClick={() => navigate(`/templates/edit/${template.id}`)}>
            Edit
          </Button>
        }
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{template.id}</Descriptions.Item>
          <Descriptions.Item label="Website">{websiteName}</Descriptions.Item>
          <Descriptions.Item label="Status">{template.is_active ? 'Active' : 'Inactive'}</Descriptions.Item>
          <Descriptions.Item label="Created At">{template.created_at}</Descriptions.Item>
          <Descriptions.Item label="Description">{template.settings.description}</Descriptions.Item>
          <Descriptions.Item label="Links">{Array.isArray(template.settings.links) ? template.settings.links.join(', ') : template.settings.links}</Descriptions.Item>
          <Descriptions.Item label="Scraping Level">{template.settings.scrapingLevel}</Descriptions.Item>
          <Descriptions.Item label="Wrapper">{template.wrapper.String}</Descriptions.Item>
          <Descriptions.Item label="Type">{template.scraping_type}</Descriptions.Item>
        </Descriptions>

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
