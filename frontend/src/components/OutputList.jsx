import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Table, Typography, Spin } from "antd";

const { Title } = Typography;

const OutputList = () => {
  const [outputs, setOutputs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { task_id } = useParams(); 
  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    if (!task_id) return; 

    setLoading(true); 

    fetch(`http://localhost:8080/get-results/${task_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        if (Array.isArray(data.Results)) {
          setOutputs(data.Results);
        } else {
          console.error("Invalid data format", data);
          setOutputs([]);
        }
      })
      .catch((error) => console.error("Error fetching outputs:", error))
      .finally(() => setLoading(false)); 
  }, [task_id, token]); 

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  const columns = [
    {
      title: "Output ID",
      dataIndex: "id",
      key: "id",
      render: (text, record) => {
        const uniqueId = record.unique_id ? record.unique_id.String : ''; 
        return <Link to={`/get-result/unique/${uniqueId}`}>{uniqueId}</Link>;
      },
      sorter: (a, b) => a.id - b.id, // Sort by Output ID
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price, // Sort by price
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title), // Sort by title
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (url) => <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at), // Sort by created_at date
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at), // Sort by updated_at date
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <Title level={3}>Output List for Task ID: {task_id}</Title>
      <Table
        bordered
        columns={columns}
        dataSource={outputs} 
        rowKey="id" 
        pagination={{ pageSize: 10 }} 
      />
    </div>
  );
};

export default OutputList;
