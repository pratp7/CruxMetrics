// Example API service for data endpoints
export const getMetrics = (req, res) => {
  res.json({
    status: "success",
    data: {
      metrics: [
        { id: 1, name: "Page Load Time", value: "1.2s" },
        { id: 2, name: "Users Online", value: "5420" },
        { id: 3, name: "Server Uptime", value: "99.9%" },
      ],
    },
  });
};

export const createMetric = (req, res) => {
  const { name, value } = req.body;

  if (!name || !value) {
    return res.status(400).json({
      status: "error",
      message: "Name and value are required",
    });
  }

  res.json({
    status: "success",
    message: "Metric created successfully",
    data: { id: Date.now(), name, value },
  });
};
