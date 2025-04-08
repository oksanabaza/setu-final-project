import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Table, Typography, Spin } from "antd";

const { Title } = Typography;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

const OutputList = () => {
  const [outputs, setOutputs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskName, setTaskName] = useState("");
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

  const columns = [
    {
      title: "Last Run",
      dataIndex: "unique_id",
      key: "last_run",
      render: (uniqueId) => {
        const idString = uniqueId?.String || "";
        const dateStr = idString.split("_")[1];

        let formatted = "-";
        if (dateStr && dateStr.length === 14) {
          const year = dateStr.slice(0, 4);
          const month = dateStr.slice(4, 6);
          const day = dateStr.slice(6, 8);
          const hour = dateStr.slice(8, 10);
          const minute = dateStr.slice(10, 12);
          const second = dateStr.slice(12, 14);
          const dateObj = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
          formatted = dateObj.toLocaleString();
        }

        return (
          <Link to={`/get-result/unique/${idString}`}>
            {formatted}
          </Link>
        );
      },
      sorter: (a, b) => {
        const getTime = (uniqueId) => {
          const idString = uniqueId?.String || "";
          const dateStr = idString.split("_")[1];
          if (dateStr && dateStr.length === 14) {
            const year = dateStr.slice(0, 4);
            const month = dateStr.slice(4, 6);
            const day = dateStr.slice(6, 8);
            const hour = dateStr.slice(8, 10);
            const minute = dateStr.slice(10, 12);
            const second = dateStr.slice(12, 14);
            return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`).getTime();
          }
          return 0;
        };
        return getTime(a.unique_id) - getTime(b.unique_id);
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (value) => formatDate(value),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (value) => formatDate(value),
      sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
    },
  ];
  useEffect(() => {
    let isMounted = true;
  
    fetch(`http://localhost:8080/scraping-task/${task_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data?.name) {
          setTaskName(data.name);
        }
      })
      .catch((err) => console.error("Error fetching task name", err));
  
    return () => {
      isMounted = false;
    };
  }, [task_id, token]);
  
  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <Title level={3}>
        Output List for Task: {taskName ? `${taskName}` : task_id}
      </Title>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          bordered
          columns={columns}
          dataSource={outputs}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default OutputList;
