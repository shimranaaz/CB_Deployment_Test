import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ATSReportModal from '../components/ATSReportModal';
import api from '../configs/api';

const ATSReportPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const submissionId = searchParams.get('id');
    
    if (!submissionId) {
      navigate('/ats-checker');
      return;
    }

    // Fetch submission data
    const fetchSubmission = async () => {
      try {
        const { data } = await api.get(`/ats/submission/${submissionId}`);
        setSubmission(data);
      } catch (error) {
        console.error('Error fetching submission:', error);
        navigate('/ats-checker');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [searchParams, navigate]);

  const handleClose = () => {
    navigate('/ats-checker');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!submission) return null;

  return <ATSReportModal submission={submission} onClose={handleClose} />;
};

export default ATSReportPage;