import React, { useState } from "react";
import { Upload, Mail, Briefcase, User } from "lucide-react";
import axios from "axios";

function UserForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return; // Prevent submission if no file is selected

    if (file.type !== "application/pdf") {
      setError("Resume must be in PDF format only");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("resume", file);

    try {
      const { data } = await axios.post(
        // production link should be like this: http://localhost:5678/webhook/store-requests
        "http://localhost:5678/webhook-test/store-requests",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", data);
      setSubmitted(true);
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br bg-[#F5E2DD] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <Briefcase className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-4">
            We've received your information and will send an email to{" "}
            <span className="text-[#F93A0B]">{email}</span> containing a sheet
            with job details and a tailored cover letter for each opportunity
            within 24 hours. Keep an eye on your inbox!
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-[#F93A0B] hover:text-[#cc2c05] font-medium"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#F5E2DD] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <Briefcase className="w-16 h-16 text-[#F93A0B] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI-Powered Job Matching
          </h1>
          <p className="text-gray-600">
            Upload your resume and let our AI find the perfect jobs for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter your name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume
            </label>
            <div className="relative">
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#F93A0B] transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  {file ? file.name : "Upload Resume (PDF)"}
                </span>
              </label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#F93A0B] text-white py-2 px-4 rounded-lg font-medium 
              ${
                isSubmitting
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:bg-[#cc2c05]"
              } 
              transition-colors duration-200`}
          >
            {isSubmitting ? "Processing..." : "Get Matched with Jobs"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          By submitting, you agree to receive job-related emails based on your
          profile and preferences.
        </p>
      </div>
    </div>
  );
}

export default UserForm;
