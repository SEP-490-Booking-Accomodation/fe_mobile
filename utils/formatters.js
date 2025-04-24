export const formatMoney = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

export const getStatusText = (status) => {
  const statusMap = {
    1: "Xác nhận",
    2: "Cần Check-in",
    3: "Check-in",
    4: "Cần Check-out",
    5: "Check-out",
    6: "Đã hủy",
    7: "Hoàn thành",
    8: "Chờ",
  };
  return statusMap[status] || "Không xác định";
};

export const getPaymentMethodText = (method) => {
  const methodMap = {
    1: "Momo",
    2: "Ví Mean",
    3: "Test",
  };
  return methodMap[method] || "Không xác định";
};

export const getPaymentStatusText = (status) => {
  const statusMap = {
    1: "Chờ thanh toán",
    2: "Chờ thanh toán",
    3: "Đã thanh toán",
    4: "Hoàn tiền",
    5: "Thất bại",
  };
  return statusMap[status] || "Không xác định";
};
