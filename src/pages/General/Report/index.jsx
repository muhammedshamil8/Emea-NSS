import React, { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { getDocs, collection, Timestamp } from 'firebase/firestore';
import dayjs from 'dayjs';

const ReportCard = ({ report }) => {

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-6">
      <div className="bg-gray-400 rounded-xl h-32 mb-4"></div>
      <div className="flex justify-between items-start flex-col">
        <h1 className="text-lg font-semibold text-gray-800">{report.title}</h1>
        <p className="text-sm text-gray-500">{report.description}</p>
        <p className="text-gray-500 text-sm">
          {report.created_at instanceof Timestamp
            ? dayjs(report.created_at.toDate()).format("MMMM D, YYYY h:mm A")
            : typeof report.created_at === 'string' // Check if it's a string or a date string
              ? dayjs(report.created_at).format("MMMM D, YYYY h:mm A")
              : "Unknown Date"}
        </p>
      </div>
      <button className="bg-indigo-700 text-white rounded-md px-4 py-1 mt-4 text-sm"> <a
        href={report.doc_link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        View Report
      </a></button>
    </div>
  );
};

function Report() {
  const [reports, setReports] = useState([]);
  const reportsCollectionRef = collection(db, 'reports');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    getReports();
  }, []);

  const getReports = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(reportsCollectionRef);
      const reports = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(reports);
      setReports(reports);
    } catch (error) {
      console.error("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] bg-gray-100 py-8">
      <h1 className="text-3xl text-center text-indigo-700 font-semibold mb-8">Reports</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : (
          reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))
        )}
      </div>
    </div>
  );
}

export default Report;
