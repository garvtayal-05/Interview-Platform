import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EvaluateMockSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/mock/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      setSubmissions(data.submissions || []);
    } catch (err) {
      toast.error(err.message || "Could not fetch mock responses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleEvaluate = async (id, score, remarks) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/mock/evaluate/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score, remarks }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Evaluation failed");

      toast.success("Evaluation submitted");
      fetchSubmissions(); // refresh list
    } catch (err) {
      toast.error(err.message || "Failed to submit evaluation");
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-white">Loading submissions...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Evaluate Mock Submissions</h1>

      {submissions.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg">
          <p>No mock responses submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission) => (
            <div key={submission._id} className="bg-gray-800 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-2">{submission.question}</h2>
              <p className="text-gray-300 mb-1">
                <span className="font-medium">Candidate:</span> {submission.candidateName}
              </p>
              <p className="text-gray-300 mb-1">
                <span className="font-medium">Job Role:</span> {submission.jobTitle}
              </p>

              <div className="mt-4">
                <p className="font-medium text-gray-200 mb-1">Video Answer:</p>
                <video
                  className="w-full max-w-md rounded-lg mb-4"
                  controls
                  src={submission.videoUrl}
                />
              </div>

              <div className="mb-4">
                <p className="font-medium text-gray-200 mb-1">Text Answer:</p>
                <p className="bg-gray-700 p-3 rounded text-gray-100">{submission.textAnswer}</p>
              </div>

              <EvaluateForm
                submissionId={submission._id}
                onEvaluate={handleEvaluate}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EvaluateForm = ({ submissionId, onEvaluate }) => {
  const [score, setScore] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!score) return toast.error("Please enter a score");
    onEvaluate(submissionId, score, remarks);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <input
        type="number"
        className="w-full p-2 rounded bg-gray-900 border text-white"
        placeholder="Score (0–100)"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      />
      <textarea
        className="w-full p-2 rounded bg-gray-900 border text-white"
        placeholder="Remarks"
        rows={3}
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit Evaluation
      </button>
    </form>
  );
};

export default EvaluateMockSubmissions;
