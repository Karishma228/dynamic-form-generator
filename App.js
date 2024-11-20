import React, { useState, useRef } from "react";
import ReactJson from "react-json-view";
import "./App.css";

const initialFormSchema = {
  formTitle: "Project Requirements Survey",
  formDescription: "Please fill out this survey about your project needs",
  fields: [
    {
      id: "name",
      type: "text",
      label: "Full Name",
      required: true,
      placeholder: "Enter your full name",
    },
    {
      id: "email",
      type: "email",
      label: "Email Address",
      required: true,
      placeholder: "you@example.com",
      validation: {
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        message: "Please enter a valid email address",
      },
    },
    {
      id: "companySize",
      type: "select",
      label: "Company Size",
      required: true,
      options: [
        { value: "1-50", label: "1-50 employees" },
        { value: "51-200", label: "51-200 employees" },
        { value: "201-1000", label: "201-1000 employees" },
        { value: "1000+", label: "1000+ employees" },
      ],
    },
    {
      id: "industry",
      type: "radio",
      label: "Industry",
      required: true,
      options: [
        { value: "tech", label: "Technology" },
        { value: "healthcare", label: "Healthcare" },
        { value: "finance", label: "Finance" },
        { value: "retail", label: "Retail" },
        { value: "other", label: "Other" },
      ],
    },
    {
      id: "timeline",
      type: "select",
      label: "Project Timeline",
      required: true,
      options: [
        { value: "immediate", label: "Immediate (within 1 month)" },
        { value: "short", label: "Short-term (1-3 months)" },
        { value: "medium", label: "Medium-term (3-6 months)" },
        { value: "long", label: "Long-term (6+ months)" },
      ],
    },
    {
      id: "comments",
      type: "textarea",
      label: "Additional Comments",
      required: false,
      placeholder: "Any other details you'd like to share...",
    },
  ],
};

function App() {
  const [formSchema, setFormSchema] = useState(initialFormSchema);
  const [formData, setFormData] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [copyMessage, setCopyMessage] = useState(""); // For copy feedback message
  const formRef = useRef();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleJSONChange = (change) => {
    if (change.updated_src) {
      setFormSchema(change.updated_src); // Synchronize form schema with editor
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = { ...formData, submissionTime: new Date() };
    const blob = new Blob([JSON.stringify(submissionData, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "form_submission.json";
    link.click();
  };

  const handleCopyJson = () => {
    // Convert formSchema to JSON string and copy to clipboard
    const jsonString = JSON.stringify(formSchema, null, 2);
    navigator.clipboard.writeText(jsonString).then(
      () => {
        setCopyMessage("Form JSON copied to clipboard!");
        setTimeout(() => setCopyMessage(""), 3000); // Clear message after 3 seconds
      },
      (err) => {
        setCopyMessage("Failed to copy form JSON.");
      }
    );
  };

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
      <div className="container">
        {/* JSON Editor */}
        <div className="json-editor">
          <h3>Edit Form JSON</h3>
          <ReactJson
            src={formSchema}
            onEdit={handleJSONChange}
            onAdd={handleJSONChange}
            onDelete={handleJSONChange}
            theme={darkMode ? "monokai" : "rjv-default"}
          />
        </div>

        {/* Copy JSON Button */}
        <div>
          <button onClick={handleCopyJson}>Copy Form JSON</button>
          {copyMessage && <p>{copyMessage}</p>}
        </div>

        {/* Form Preview */}
        <div className="form-preview">
          <h3>{formSchema.formTitle}</h3>
          <p>{formSchema.formDescription}</p>
          <form ref={formRef} onSubmit={handleSubmit}>
            {formSchema.fields.map((field) => (
              <div key={field.id} className="form-group">
                <label htmlFor={field.id}>{field.label}</label>
                {field.type === "text" || field.type === "email" ? (
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id] || ""}
                    onChange={handleFormChange}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    name={field.id}
                    value={formData[field.id] || ""}
                    onChange={handleFormChange}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                ) : field.type === "select" ? (
                  <select
                    id={field.id}
                    name={field.id}
                    value={formData[field.id] || ""}
                    onChange={handleFormChange}
                    required={field.required}
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "radio" ? (
                  field.options.map((option) => (
                    <div key={option.value}>
                      <input
                        type="radio"
                        id={option.value}
                        name={field.id}
                        value={option.value}
                        onChange={handleFormChange}
                        required={field.required}
                      />
                      <label htmlFor={option.value}>{option.label}</label>
                    </div>
                  ))
                ) : null}
              </div>
            ))}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
