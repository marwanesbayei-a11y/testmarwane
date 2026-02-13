
import { Appointment } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (appointment: Appointment) => {
  const headers = ['Champ', 'Valeur'];
  const data = [
    ['Client', appointment.clientName],
    ['Entreprise', appointment.company],
    ['Adresse', appointment.address],
    ['Téléphone', appointment.phone],
    ['Email', appointment.email],
    ['Commercial', appointment.salesRep],
    ['Date', appointment.date],
    ['Heure', appointment.time],
    ['Motif', appointment.purpose],
    ['Notes', appointment.notes],
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `RDV_${appointment.company.replace(/\s+/g, '_')}_${appointment.date}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (appointment: Appointment) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(30, 64, 175); // slate-800
  doc.text('FICHE DE RENDEZ-VOUS COMMERCIAL', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 105, 28, { align: 'center' });

  // Draw a horizontal line
  doc.setDrawColor(200);
  doc.line(20, 35, 190, 35);

  // Content Table
  const tableData = [
    ['Client', appointment.clientName],
    ['Entreprise', appointment.company],
    ['Commercial en charge', appointment.salesRep],
    ['Date du rendez-vous', appointment.date],
    ['Heure', appointment.time],
    ['Adresse', appointment.address],
    ['Téléphone', appointment.phone],
    ['Email', appointment.email],
    ['Motif de la visite', appointment.purpose],
  ];

  // Use the autoTable function directly on the doc instance
  autoTable(doc, {
    startY: 45,
    head: [['Information', 'Détails']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255] },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    margin: { left: 20, right: 20 },
  });

  // Get the final Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  
  // Notes section
  doc.setFontSize(14);
  doc.setTextColor(30, 64, 175);
  doc.text('Notes Complémentaires', 20, finalY + 15);
  
  doc.setFontSize(11);
  doc.setTextColor(50);
  const splitNotes = doc.splitTextToSize(appointment.notes || "Aucune note supplémentaire.", 170);
  doc.text(splitNotes, 20, finalY + 25);

  // Footer for signature
  const pageHeight = doc.internal.pageSize.height;
  doc.setDrawColor(200);
  doc.line(20, pageHeight - 40, 80, pageHeight - 40);
  doc.line(130, pageHeight - 40, 190, pageHeight - 40);
  
  doc.setFontSize(9);
  doc.text('Signature Client', 20, pageHeight - 35);
  doc.text('Signature Commercial', 130, pageHeight - 35);

  doc.save(`RDV_${appointment.company.replace(/\s+/g, '_')}_${appointment.date}.pdf`);
};
