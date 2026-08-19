export function toCSV(headers, rows){
  const escapeCell = value => {
    const text = String(value ?? '');
    return /[;"\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const lines = [headers.map(escapeCell).join(';')];
  rows.forEach(row => lines.push(row.map(escapeCell).join(';')));
  return lines.join('\n');
}

export function downloadCSV(filename, csvContent){
  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
