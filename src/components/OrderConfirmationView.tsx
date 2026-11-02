import React from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Download,
  Share2,
  ArrowRight,
  Clock,
  Printer,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR, useTranslation, formatDateIN } from '../utils/formatters';

export const OrderConfirmationView: React.FC = () => {
  const {
    theme,
    language,
    orders,
    lastPlacedOrder,
    trackingOrderId,
    setActiveTab,
  } = useStore();

  const t = useTranslation(language);

  // Get current order being viewed or tracked
  const order =
    (trackingOrderId ? orders.find((o) => o.id === trackingOrderId) : null) ||
    lastPlacedOrder ||
    orders[0];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold mb-3">No recent orders found</h2>
        <button
          onClick={() => setActiveTab('storefront')}
          style={{ backgroundColor: 'var(--theme-primary)', color: '#FFFFFF' }}
          className="px-6 py-2.5 rounded-lg text-xs font-bold"
        >
          {t.startShopping}
        </button>
      </div>
    );
  }

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleWhatsAppUpdate = () => {
    const text = encodeURIComponent(
      `Hi! Tracking update for my order #${order.id} on ${theme.storeName}. Tracking ID: ${order.trackingNumber}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn print:p-0">
      
      {/* Success Celebration Banner (Hide in print) */}
      <div className="print:hidden bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 sm:p-8 text-center mb-8 shadow-xs">
        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/60 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          {t.orderSuccess}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 max-w-lg mx-auto">
          Thank you for shopping with <strong className="text-slate-900 dark:text-white">{theme.storeName}</strong>! Confirmation SMS and WhatsApp updates have been dispatched to <strong>{order.customer.mobile}</strong>.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <div className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            {t.orderId}: {order.id}
          </div>
          <div className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
            Waybill: {order.trackingNumber} ({order.courierPartner})
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handlePrintInvoice}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.downloadInvoice}</span>
          </button>

          <button
            onClick={handleWhatsAppUpdate}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Updates on WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('storefront')}
            style={{ backgroundColor: 'var(--theme-primary)', color: '#FFFFFF' }}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg shadow-sm"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Shipment Tracking Stepper (Delhivery / Shiprocket style) */}
      <div className="print:hidden bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              Live Courier Shipment Timeline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fulfilled via <strong className="text-slate-800 dark:text-slate-200">{order.courierPartner} Express</strong> · Air Waybill: <span className="font-mono">{order.trackingNumber}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Estimated Doorstep Delivery</span>
            <span className="text-sm font-bold text-emerald-600">
              {formatDateIN(order.estimatedDeliveryDate)} (Before 7:00 PM)
            </span>
          </div>
        </div>

        {/* Timeline Stepper Steps */}
        <div className="mt-6 relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          {order.timeline.map((step, idx) => {
            return (
              <div key={idx} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                {/* Stepper Dot */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    step.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : step.current
                      ? 'bg-indigo-600 border-indigo-600 text-white animate-pulse'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-transparent'
                  }`}
                >
                  <span className="text-[9px]">✓</span>
                </div>

                <div>
                  <h4 className={`text-xs font-bold ${step.completed || step.current ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                    {language === 'hi' ? step.statusHi : step.status}
                  </h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{step.location}</span>
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 font-mono sm:text-right shrink-0">
                  <span>{step.date}</span> {step.time !== '--' && <span>· {step.time}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Tax Invoice Container (Printable GST compliant) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs print:border-none print:shadow-none">
        
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-2.5">
              {theme.logoUrl ? (
                <img
                  src={theme.logoUrl}
                  alt={theme.storeName}
                  className="w-8 h-8 rounded-full object-cover border border-amber-400/60 bg-black"
                />
              ) : (
                <span
                  style={{ backgroundColor: 'var(--theme-primary)' }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                >
                  {theme.logoText.slice(0, 2)}
                </span>
              )}
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">{theme.storeName}</h3>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">Rohini, Delhi</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Tax Invoice / Bill of Supply</p>
            <p className="text-xs text-slate-500 font-mono">GSTIN: 07AAACA1234F1Z5</p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <p><strong className="text-slate-900 dark:text-white">Invoice No:</strong> INV-{order.id}</p>
            <p><strong className="text-slate-900 dark:text-white">Order Date:</strong> {formatDateIN(order.date)}</p>
            <p><strong className="text-slate-900 dark:text-white">Payment Status:</strong> <span className="uppercase text-emerald-600 font-bold">{order.paymentStatus} ({order.paymentMethod})</span></p>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 dark:border-slate-700 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 text-slate-400">
              Billed & Shipped To:
            </h4>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{order.customer.fullName}</p>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5">{order.customer.addressLine1}</p>
            {order.customer.landmark && <p className="text-slate-500">Landmark: {order.customer.landmark}</p>}
            <p className="text-slate-600 dark:text-slate-300">{order.customer.city}, {order.customer.state} - <strong className="text-slate-900 dark:text-white">{order.customer.pincode}</strong></p>
            <p className="text-slate-600 dark:text-slate-300 mt-1 font-mono">Mobile: +91 {order.customer.mobile}</p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 text-slate-400">
              Merchant & Dispatch Hub:
            </h4>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{order.storeName}</p>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5">Varanasi Textile & Craft Cluster, G.T. Road</p>
            <p className="text-slate-600 dark:text-slate-300">Varanasi, Uttar Pradesh - 221001, India</p>
            <p className="text-slate-500 mt-1">Logistics: {order.courierPartner} (Surface AWB: {order.trackingNumber})</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="py-6 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <th className="pb-2.5">Item Description</th>
                <th className="pb-2.5">HSN</th>
                <th className="pb-2.5 text-center">Qty</th>
                <th className="pb-2.5 text-right">Unit Price</th>
                <th className="pb-2.5 text-right">Taxable Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {order.items.map((it, idx) => (
                <tr key={idx} className="py-2.5">
                  <td className="py-3">
                    <p className="font-bold text-slate-900 dark:text-white">{it.product.title}</p>
                    {it.selectedVariant && (
                      <p className="text-[10px] text-slate-400">
                        {Object.entries(it.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </p>
                    )}
                  </td>
                  <td className="py-3 font-mono text-slate-500">{it.product.hsnCode || '5208'}</td>
                  <td className="py-3 text-center font-bold">{it.quantity}</td>
                  <td className="py-3 text-right tabular-nums">{formatINR(it.product.price)}</td>
                  <td className="py-3 text-right font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatINR(it.product.price * it.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Total Calculation */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="text-[11px] text-slate-500 max-w-sm space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">GST Declaration:</p>
            <p>Invoice issued in accordance with Section 31 of the Central Goods & Services Tax (CGST) Act, 2017.</p>
          </div>

          <div className="w-full sm:w-64 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Gross Subtotal:</span>
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{formatINR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Promotional Discount:</span>
                <span className="tabular-nums">- {formatINR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping & Handling:</span>
              <span className="font-semibold tabular-nums">{order.deliveryCharge === 0 ? 'FREE' : formatINR(order.deliveryCharge)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Included:</span>
              <span className="tabular-nums font-mono">{formatINR(order.gstAmount)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white">
              <span>Total Paid:</span>
              <span className="text-base tabular-nums">{formatINR(order.total)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
