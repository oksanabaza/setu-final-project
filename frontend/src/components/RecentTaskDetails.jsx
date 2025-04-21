import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Table, Card, Typography, Spin, Tabs } from "antd";
import ReactJson from "react-json-view";

const { Title } = Typography;
const { TabPane } = Tabs;

const RecentTaskDetails = () => {
  const { unique_id } = useParams(); 
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [taskDetails, setTaskDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!unique_id) return; 

    setLoading(true); 

    fetch(`https://setu-final-project.onrender.com/get-result/unique/${unique_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Result) {
          try {
            // Parse the Result stringified JSON
            data.Result = JSON.parse(data.Result);
          } catch (error) {
            console.error("Failed to parse Result JSON", error);
          }
        }
        setTaskDetails(data);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
        setError("Failed to fetch task details.");
      })
      .finally(() => setLoading(false)); 
  }, [unique_id, token]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!taskDetails) {
    return <div>No data found.</div>;
  }

  const columns = [
    { title: "Index", dataIndex: "index", key: "index", width: 80 },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ),
    },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
  ];

  const dataSource = taskDetails.Result?.map((item, index) => ({
    key: index,
    index: index + 1,
    url: item.url,
    price: item.data.price,
    title: item.data.title,
    description: item.data.description,
  }));

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="JSON Format" key="1">
        <Card style={{ marginBottom: "20px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
          <Title level={3}>Results</Title>
          <div
            style={{
              height: "400px",
              overflowY: "auto",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              background: "rgba(0,0,0,0.88)",
            }}
          >
            <ReactJson
              src={taskDetails}
              theme="monokai"
              collapsed={1}
              displayDataTypes={false}
              style={{ height: "100%", overflow: "auto" }}
            />
          </div>
        </Card>
      </TabPane>

      <TabPane tab="Table Format" key="2">
        <Card style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
          <Title level={3}>Results</Title>
          <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 5 }} size="small" />
        </Card>
      </TabPane>
    </Tabs>
  );
};

export default RecentTaskDetails;
