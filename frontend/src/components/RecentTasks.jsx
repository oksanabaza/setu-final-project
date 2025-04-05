import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Spin, Alert, Typography, Tag, Progress } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

const RecentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecentTasks = async () => {
      try {
        const response = await fetch("http://localhost:8080/scraping-tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch tasks (Status: ${response.status})`);
        }

        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTasks();
  }, [token]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert 
        message="Error" 
        description={error} 
        type="error" 
        showIcon 
        style={{ margin: "20px" }} 
      />
    );
  }

  const columns = [
    {
      title: "Task Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <Link to={`/get-results/${record.task_id}`}>{text}</Link>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusColor = status === "Completed" ? "green" : status === "Failed" ? "red" : "blue";
        return <Tag color={statusColor}>{status}</Tag>;
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress, record) => (
        <Progress percent={progress} status={record.status === "Failed" ? "exception" : "active"} />
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Website",
      dataIndex: "website_url",
      key: "website_url",
      render: (url) => <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>,
    },
  ];

  return (
    <>
    {/* // <div style={{ maxWidth: 1000, margin: "20px auto", padding: "20px" }}> */}
      {/* <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>Recent Tasks</Title> */}
      <Table 
        columns={columns} 
        dataSource={tasks.map((task, index) => ({ ...task, key: index }))} 
        pagination={{ pageSize: 5 }} 
      /></>
  
  );
};

export default RecentTasks;
