"use client";

import React, { useState, useEffect } from 'react';
import { Download, Receipt, ArrowLeft, Loader2 } from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [parentName, setParentName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/parent/fees/history')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPayments(data.payments);
          setParentName(data.parentName);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const generateReceipt = (payment: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.text("EduCore School", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("OFFICIAL FEE RECEIPT", 105, 28, { align: "center" });
    
    // Receipt Info
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`Receipt No: ${payment.receiptNumber}`, 20, 45);
    doc.text(`Date: ${new Date(payment.paymentDate).toLocaleDateString()}`, 140, 45);
    
    // Student Info
    doc.text(`Student: ${payment.student.user.name}`, 20, 55);
    doc.text(`Class: ${payment.student.class.name} - ${payment.student.class.section} | Roll: ${payment.student.rollNo}`, 20, 62);
    doc.text(`Parent: ${parentName}`, 20, 69);
    
    // Table
    (doc as any).autoTable({
      startY: 80,
      head: [['Description', 'Amount']],
      body: [
        [
          payment.feeRecord ? `${payment.feeRecord.feeType} Fee` : (payment.note || 'Advance / Custom Payment'),
          `Rs. ${payment.amount.toLocaleString()}`
        ]
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      margin: { top: 10 }
    });
    
    // Payment Details
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    
    doc.text(`Payment Mode: ${payment.paymentMode}`, 20, finalY + 15);
    doc.text(`Transaction ID: ${payment.transactionId || 'N/A'}`, 20, finalY + 22);
    doc.setTextColor(34, 197, 94); // Green 500
    doc.text(`Status: SUCCESS`, 20, finalY + 29);
    
    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.text("This is a computer-generated receipt and does not require a signature.", 105, 280, { align: "center" });
    doc.text("EduCore School | 123 Education Lane | +91 9876543210 | support@educore.edu", 105, 285, { align: "center" });
    
    doc.save(`${payment.receiptNumber}.pdf`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <a href="/parent/fees" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </a>
          <h1 className="text-2xl font-bold text-slate-800">Payment History</h1>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Receipt No</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Mode</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-700 whitespace-nowrap">
                      {new Date(p.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-sm text-slate-500 font-mono">{p.receiptNumber}</td>
                    <td className="p-4 text-sm font-medium text-slate-800">
                      {p.feeRecord ? `${p.feeRecord.feeType} Fee` : 'Payment'}
                      <div className="text-xs text-slate-400 font-normal">{p.student.user.name}</div>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-800 whitespace-nowrap">₹{p.amount.toLocaleString()}</td>
                    <td className="p-4 text-sm text-slate-500">{p.paymentMode}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                        SUCCESS ✓
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => generateReceipt(p)}
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
                
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      <Receipt className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <p>No payment history found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
