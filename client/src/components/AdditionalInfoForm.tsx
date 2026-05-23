import React, { ChangeEvent } from "react";

interface AdditionalInfoData {
  certifications?: string;
  languages?: string;
  interests?: string;
}

interface AdditionalInfoFormProps {
  data?: AdditionalInfoData;
  onChange: (data: AdditionalInfoData) => void;
}

const AdditionalInfoForm: React.FC<AdditionalInfoFormProps> = ({ 
  data = {}, 
  onChange 
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: value,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
        Additional Information
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-600">
          Certifications
        </label>
        <input
          type="text"
          name="certifications"
          value={data.certifications || ""}
          onChange={handleChange}
          placeholder="e.g. AWS Certified Developer"
          className="w-full border border-gray-300 rounded-lg p-2 mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">
          Languages
        </label>
        <input
          type="text"
          name="languages"
          value={data.languages || ""}
          onChange={handleChange}
          placeholder="e.g. English, Hindi, Tamil"
          className="w-full border border-gray-300 rounded-lg p-2 mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">
          Interests
        </label>
        <textarea
          name="interests"
          value={data.interests || ""}
          onChange={handleChange}
          placeholder="e.g. Reading, Coding, Music"
          className="w-full border border-gray-300 rounded-lg p-2 mt-1 h-20 resize-none"
        ></textarea>
      </div>
    </div>
  );
};

export default AdditionalInfoForm;