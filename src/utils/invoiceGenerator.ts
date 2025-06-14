
export const generateInvoicePDF = (paymentData: any) => {
  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${paymentData.transaction_id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
        .company-logo { font-size: 24px; font-weight: bold; color: #007bff; }
        .invoice-title { font-size: 18px; margin-top: 10px; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .invoice-info, .customer-info { width: 45%; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .table th { background-color: #f8f9fa; font-weight: bold; }
        .total-section { text-align: right; margin-top: 30px; }
        .total-amount { font-size: 18px; font-weight: bold; color: #007bff; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-logo">🎓 Etutorss</div>
        <div class="invoice-title">Payment Invoice</div>
      </div>
      
      <div class="invoice-details">
        <div class="invoice-info">
          <h3>Invoice Details</h3>
          <p><strong>Invoice ID:</strong> INV-${paymentData.transaction_id}</p>
          <p><strong>Transaction ID:</strong> ${paymentData.transaction_id}</p>
          <p><strong>Date:</strong> ${new Date(paymentData.created_at).toLocaleDateString('en-IN')}</p>
          <p><strong>Payment Method:</strong> ${paymentData.payment_method.toUpperCase()}</p>
          <p><strong>Status:</strong> ${paymentData.payment_status}</p>
        </div>
        
        <div class="customer-info">
          <h3>Student Information</h3>
          <p><strong>Student ID:</strong> ${paymentData.user_id}</p>
          <p><strong>Session:</strong> ${paymentData.session_requests?.proposed_title || 'Session Booking'}</p>
        </div>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Platform Fee</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${paymentData.session_requests?.proposed_title || 'Individual Session'}</td>
            <td>₹${(paymentData.amount - paymentData.platform_fee).toFixed(2)}</td>
            <td>₹${paymentData.platform_fee.toFixed(2)}</td>
            <td>₹${paymentData.amount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="total-section">
        <p class="total-amount">Total Paid: ₹${paymentData.amount.toFixed(2)}</p>
      </div>
      
      <div class="footer">
        <p>Thank you for choosing Etutorss!</p>
        <p>For support, contact us at support@etutorss.com</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([invoiceHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary iframe to print
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  
  document.body.appendChild(iframe);
  
  iframe.onload = () => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
      URL.revokeObjectURL(url);
    }, 1000);
  };
};
