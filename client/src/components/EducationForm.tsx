import { GraduationCap, Plus, Trash2 } from "lucide-react";
import React, { ChangeEvent } from "react";
import { Education } from '../types/resume';

interface EducationFormProps {
  data?: Education[];
  onChange: (data: Education[]) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ data = [], onChange }) => {

  const getTodayYYYYMM = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const addEducation = (): void => {
    const newEducation: Education = {
      institution: "",
      degree: "",
      field: "",
      start_date: "",
      end_date: undefined,
      gpa: undefined,
      is_current: false,
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (index: number): void => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateEducation = (index: number, field: keyof Education, value: string | boolean | number): void => {
    const updated = [...data];

    if (field === "is_current") {
      updated[index] = {
        ...updated[index],
        is_current: value as boolean,
        end_date: (value as boolean) ? undefined : updated[index].end_date
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }

    onChange(updated);
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return dateStr;

    try {
      const [year, month] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Education
          </h3>
          <p className="text-sm text-gray-500">
            Add your education details
          </p>
        </div>

        <button
          onClick={addEducation}
          type="button"
          className="flex items-center gap-2 px-3 py-1 text-sm bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:bg-[#1f1d4a] transition-colors font-medium"
        >
          <Plus className="size-4" />
          Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No education added yet.</p>
          <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((education, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-700">
                  Education #{index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={education.institution || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateEducation(index, "institution", e.target.value)
                  }
                  type="text"
                  placeholder="e.g., Harvard University"
                  className="px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />

                <input
                  value={education.degree || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                  type="text"
                  placeholder="e.g., Bachelor's of Science"
                  className="px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />

                <input
                  value={education.field || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateEducation(index, "field", e.target.value)
                  }
                  type="text"
                  placeholder="e.g., Computer Science"
                  className="px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />

                <input
                  value={education.gpa !== undefined ? String(education.gpa) : ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateEducation(index, "gpa", e.target.value)
                  }
                  type="text"
                  placeholder="e.g., 3.8/4.0 (optional)"
                  className="px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Start Date <span className="text-gray-400">(MM/YYYY)</span>
                  </label>
                  <input
                    value={education.start_date || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateEducation(index, "start_date", e.target.value)
                    }
                    type="month"
                    max={getTodayYYYYMM()}
                    className="px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    End Date <span className="text-gray-400">(MM/YYYY)</span>
                    {education.is_current && <span className="text-green-600 font-medium ml-1">(Present)</span>}
                  </label>
                  <input
                    value={education.is_current ? "" : (education.end_date || "")}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateEducation(index, "end_date", e.target.value)
                    }
                    type="month"
                    min={education.start_date || undefined}
                    max={getTodayYYYYMM()}
                    disabled={education.is_current}
                    className={`px-3 py-2 text-sm border rounded-lg w-full outline-none ${education.is_current
                        ? "bg-gray-100 cursor-not-allowed text-gray-500"
                        : "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={education.is_current || false}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateEducation(index, "is_current", e.target.checked)
                  }
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-gray-700">
                  Currently studying here
                </span>
              </label>

              {(education.institution || education.degree) && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Preview:</p>
                  <div className="text-sm text-gray-700">
                    {education.degree && education.field && (
                      <p className="font-medium">{education.degree} in {education.field}</p>
                    )}
                    {education.institution && (
                      <p className="text-gray-600">{education.institution}</p>
                    )}
                    {(education.start_date || education.end_date || education.is_current) && (
                      <p className="text-gray-500 text-xs mt-1">
                        {education.start_date ? formatDate(education.start_date) : "Start"} - {" "}
                        {education.is_current ? "Present" : (education.end_date ? formatDate(education.end_date) : "End")}
                      </p>
                    )}
                    {education.gpa && (
                      <p className="text-gray-500 text-xs">GPA: {education.gpa}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;