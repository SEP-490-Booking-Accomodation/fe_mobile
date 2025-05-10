export const formatMoney = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

  export const getStatusText = (status) => {
    const statusMap = {
      1: "status_confirmed",
      2: "status_need_checkin",
      3: "status_checked_in",
      4: "status_need_checkout",
      5: "status_checked_out",
      6: "status_cancelled",
      7: "status_completed",
      8: "status_pending",
    };
    return statusMap[status] || "status_unknown";
  };

  export const getPaymentMethodText = (method) => {
    const methodMap = {
      1: "payment_method_momo",   
      2: "payment_method_mean",       
      3: "payment_method_test",      
    };
    return methodMap[method] || "payment_method_unknown"; 
  };

export const getPaymentStatusText = (status) => {
  const statusMap = {
    1: "payment_pending",
    2: "payment_pending",
    3: "payment_paid",
    4: "payment_refunded",
    5: "payment_failed",
  };
  return statusMap[status] || "status_unknown";
};