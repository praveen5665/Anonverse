import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createCommunity } from "@/services/communityService";

const CommunityForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rules: [{ title: "", description: "" }],
    avatar: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [avatarPreview, setAvatarPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRuleChange = (index, field, value) => {
    const updateRules = [...formData.rules];
    updateRules[index] = { ...updateRules[index], [field]: value };
    setFormData({ ...formData, rules: updateRules });
  };

  const addRule = () => {
    setFormData({
      ...formData,
      rules: [...formData.rules, { title: "", description: "" }],
    });
  };

  const removeRule = (index) => {
    const updatedRules = formData.rules.filter((_, i) => i !== index);
    setFormData({ ...formData, rules: updatedRules });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      const previewURL = URL.createObjectURL(file);
      setAvatarPreview(previewURL);
    } else {
      setAvatarPreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Community name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Community name must be at least 3 characters";
    } else if (formData.name.length > 50) {
      newErrors.name = "Community name must be less than 50 characters";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    formData.rules.forEach((rule, index) => {
      if (rule.title.trim() === "") {
        newErrors[`rule_${index}`] = "Rule title is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.toLowerCase());
      formDataToSend.append("description", formData.description);
      formDataToSend.append("rules", JSON.stringify(formData.rules));
      if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar);
      }

      const response = await createCommunity(formDataToSend);

      if (response.data.success) {
        if (onSuccess) onSuccess(response.data.data.name);
        setSuccess(true);
      }
    } catch (error) {
      setErrors({
        form:
          error.response?.data?.message ||
          "Failed to create community. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create a New Community</h1>
      {errors.form && (
        <div className="bg-red-100 text-red-700 px-4 py-3 mb-4">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Community Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter community name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Describe your community"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Community Avatar (Optional)
          </label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {/* {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="mt-2 w-32 h-32 object-cover rounded-md border"
            />
          ) : (
            <p className="text-gray-500 mt-2">No preview available</p>
          )} */}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Community Rules
          </label>
          {formData.rules.map((rule, index) => (
            <div key={index} className="mb-3 p-3 border rounded-md bg-gray-50">
              <div className="flex justify-between">
                <h4 className="font-medium">Rule #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeRule(index)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                value={rule.title}
                onChange={(e) =>
                  handleRuleChange(index, "title", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Rule title"
              />
              {errors[`rule_${index}`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`rule_${index}`]}
                </p>
              )}
              <textarea
                value={rule.description}
                onChange={(e) =>
                  handleRuleChange(index, "description", e.target.value)
                }
                rows={2}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Rule description (optional)"
              ></textarea>
            </div>
          ))}
          <button
            type="button"
            onClick={addRule}
            className="text-blue-500 text-sm font-medium mt-2"
          >
            + Add Another Rule
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {isSubmitting
            ? "Creating..."
            : success
            ? "Created successfully"
            : "Create Community"}
        </button>
      </form>
    </div>
  );
};

export default CommunityForm;
