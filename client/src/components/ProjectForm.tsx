import { Plus, Trash2 } from 'lucide-react';
import React, { ChangeEvent } from 'react';
import { Project } from '../types/resume';

interface ProjectFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ data, onChange }) => {
  const addProject = (): void => {
    const newProject: Project = {
      name: "",
      type: undefined,
      description: "",
    };
    onChange([...data, newProject]);
  };

  const removeProject = (index: number): void => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateProject = (index: number, field: keyof Project, value: string): void => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value || undefined };
    onChange(updated);
  };

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
            Projects
          </h3>
          <p className='text-sm text-gray-500'>Add your projects</p>
        </div>
        <button
          type="button"
          onClick={addProject}
          className='flex items-center gap-2 px-3 py-1 text-sm bg-[#2c2a63] text-[#EDC9AF] rounded-lg hover:opacity-90 transition-colors'
        >
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

      <div className='space-y-4 mt-6'>
        {data.map((project, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className='flex justify-between items-start'>
              <h4 className="font-medium text-gray-700">Project #{index + 1}</h4>
              <button
                type="button"
                onClick={() => removeProject(index)}
                className='text-red-500 hover:text-red-700 transition-colors'
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className='grid gap-3'>
              <input
                value={project.name || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateProject(index, "name", e.target.value)
                }
                type="text"
                placeholder="Project Name"
                className="px-3 py-2 text-sm border rounded-lg w-full"
              />

              <input
                value={project.type || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateProject(index, "type", e.target.value)
                }
                type="text"
                placeholder="Project Type (optional)"
                className="px-3 py-2 text-sm border rounded-lg w-full"
              />

              <textarea
                rows={4}
                value={project.description || ""}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  updateProject(index, "description", e.target.value)
                }
                placeholder="Describe your project..."
                className="w-full px-3 py-2 text-sm border rounded-lg resize-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectForm;