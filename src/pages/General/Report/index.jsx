import React from 'react';

const ReportCard = ({ report }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-6">
      <div className="bg-gray-400 rounded-xl h-32 mb-4"></div>
      <div className="flex justify-between items-start flex-col">
        <h1 className="text-lg font-semibold text-gray-800">{report.title}</h1>
        <p className="text-sm text-gray-500">{report.description}</p>
      </div>
      <button className="bg-indigo-700 text-white rounded-md px-4 py-1 mt-4 text-sm">View Report</button>
    </div>
  );
};

function Report() {
  // Dummy data for the report cards
  const reports = [
    { id: 1, title: 'Annual Report 2023', description: 'A comprehensive report for the year.' },
    { id: 2, title: 'Quarterly Report Q1', description: 'An overview of the first quarter.' },
    { id: 3, title: 'Financial Report', description: 'Financial performance review.' },
    { id: 4, title: 'Sustainability Report', description: 'Details on sustainability efforts.' },
    { id: 5, title: 'Project Report Alpha', description: 'Key insights on Project Alpha.' },
  ];

  return (
    <div className="min-h-[100vh] bg-gray-100 py-8">
      <h1 className="text-3xl text-center text-indigo-700 font-semibold mb-8">Reports</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}

export default Report;
