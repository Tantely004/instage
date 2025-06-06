import { saveAs } from 'file-saver';

const exportToCSV = (data, filename = 'planning_export.csv') => {
  const csv = [];
  const headers = [
    'Titre Chronogramme',
    'Date de début',
    'Date de fin',
    'Description',
    'Intitulé Tâche',
    'Détail',
    'Date de début Tâche',
    'Date de fin Tâche',
    'Priorité',
    'État de la tâche'
  ];
  csv.push(headers.join(','));

  data.tasks.forEach(task => {
    const row = [
      data.title || '',
      data.startDate ? new Date(data.startDate).toLocaleDateString() : '',
      data.endDate ? new Date(data.endDate).toLocaleDateString() : '',
      data.description || '',
      task.title || '',
      task.detail || '',
      task.startDate ? new Date(task.startDate).toLocaleDateString() : '',
      task.endDate ? new Date(task.endDate).toLocaleDateString() : '',
      task.priority || '',
      task.status || ''
    ];
    csv.push(row.join(','));
  });

  const csvContent = csv.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};

export default exportToCSV;