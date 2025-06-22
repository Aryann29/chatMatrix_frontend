import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { tokenStorage } from "../../utils/auth";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorDisplay from "../../components/ErrorDisplay";
import SuccessAlert from "../../components/SuccessAlert";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const ChatbotSettings = () => {
  const { chatbotId } = useParams();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    llm_provider: "openai",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    max_tokens: 1000,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [chatbotName, setChatbotName] = useState("");

  const llmProviders = [
    {
      id: "openai",
      name: "OpenAI",
      models: [
        { id: "gpt-4", name: "GPT-4", description: "Most capable model" },
        {
          id: "gpt-4-turbo",
          name: "GPT-4 Turbo",
          description: "Faster and cheaper than GPT-4",
        },
        {
          id: "gpt-3.5-turbo",
          name: "GPT-3.5 Turbo",
          description: "Fast and cost-effective",
        },
      ],
    },
    {
      id: "anthropic",
      name: "Anthropic",
      models: [
        {
          id: "claude-3-opus",
          name: "Claude 3 Opus",
          description: "Most powerful Claude model",
        },
        {
          id: "claude-3-sonnet",
          name: "Claude 3 Sonnet",
          description: "Balanced performance",
        },
        {
          id: "claude-3-haiku",
          name: "Claude 3 Haiku",
          description: "Fast and lightweight",
        },
      ],
    },
    {
      id: "google",
      name: "Google",
      models: [
        {
          id: "gemini-pro",
          name: "Gemini Pro",
          description: "Google's flagship model",
        },
        {
          id: "gemini-pro-vision",
          name: "Gemini Pro Vision",
          description: "Multimodal capabilities",
        },
      ],
    },
    {
      id: "mistral",
      name: "Mistral AI",
      models: [
        {
          id: "mistral-large",
          name: "Mistral Large",
          description: "Most capable Mistral model",
        },
        {
          id: "mistral-medium",
          name: "Mistral Medium",
          description: "Balanced performance",
        },
        {
          id: "mistral-small",
          name: "Mistral Small",
          description: "Fast and efficient",
        },
      ],
    },
  ];

  const selectedProvider = llmProviders.find(
    (p) => p.id === settings.llm_provider
  );

  useEffect(() => {
    fetchChatbotSettings();
  }, [chatbotId]);

  const fetchChatbotSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = tokenStorage.getToken();
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/chatbots/${chatbotId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setChatbotName(data.name || "Unnamed Chatbot");

      setSettings({
        llm_provider: data.llm_provider || "openai",
        model: data.model || "gpt-3.5-turbo",
        temperature: data.temperature || 0.7,
        max_tokens: data.max_tokens || 1000,
      });
    } catch (err) {
      console.error("Error fetching chatbot settings:", err);
      if (err.response) {
        setError(
          err.response.data.detail || "Failed to fetch chatbot settings."
        );
      } else {
        setError("Network error or unexpected issue.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "llm_provider") {
      const newProvider = llmProviders.find((p) => p.id === value);
      if (newProvider && newProvider.models.length > 0) {
        setSettings((prev) => ({
          ...prev,
          [key]: value,
          model: newProvider.models[0].id,
        }));
      }
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const token = tokenStorage.getToken();
      if (!token) {
        setError("Authentication token missing. Please log in.");
        return;
      }

      const formData = new FormData();
      Object.entries(settings).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await axios.put(`${API_BASE_URL}/chatbots/${chatbotId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      if (err.response) {
        setError(err.response.data.detail || "Failed to save settings.");
      } else {
        setError("Network error or unexpected issue.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteChatbot = async () => {
    if (deleteConfirmText.toLowerCase() !== "delete") {
      setError('Please type "delete" to confirm deletion.');
      return;
    }

    try {
      setDeleting(true);
      setError(null);

      const token = tokenStorage.getToken();
      if (!token) {
        setError("Authentication token missing. Please log in.");
        return;
      }

      await axios.delete(`${API_BASE_URL}/chatbots/${chatbotId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/dashboard/my-chatbots");
    } catch (err) {
      console.error("Error deleting chatbot:", err);
      if (err.response) {
        setError(err.response.data.detail || "Failed to delete chatbot.");
      } else {
        setError("Network error or unexpected issue.");
      }
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !saving && !deleting) {
    return (
      <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <section className="min-h-screen bg-neutral-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Chatbot Settings
          </h2>
          <p className="text-neutral-400">
            Configure LLM provider and manage your chatbot
          </p>
        </div>

        <SuccessAlert success={success} />

        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <h3 className="text-xl font-semibold text-white mb-6">
              LLM Provider Configuration
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Select Provider
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {llmProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() =>
                      handleSettingChange("llm_provider", provider.id)
                    }
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      settings.llm_provider === provider.id
                        ? "border-teal-500 bg-teal-500/10 text-teal-400"
                        : "border-neutral-600 bg-neutral-700 text-neutral-300 hover:border-neutral-500"
                    }`}
                  >
                    <div className="font-medium">{provider.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {selectedProvider && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-300 mb-3">
                  Select Model
                </label>
                <div className="space-y-2">
                  {selectedProvider.models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleSettingChange("model", model.id)}
                      className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                        settings.model === model.id
                          ? "border-teal-500 bg-teal-500/10"
                          : "border-neutral-600 bg-neutral-700 hover:border-neutral-500"
                      }`}
                    >
                      <div
                        className={`font-medium ${
                          settings.model === model.id
                            ? "text-teal-400"
                            : "text-white"
                        }`}
                      >
                        {model.name}
                      </div>
                      <div className="text-sm text-neutral-400 mt-1">
                        {model.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Temperature: {settings.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) =>
                    handleSettingChange(
                      "temperature",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>Conservative</span>
                  <span>Creative</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Max Tokens
                </label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  step="100"
                  value={settings.max_tokens}
                  onChange={(e) =>
                    handleSettingChange("max_tokens", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="bg-teal-500 hover:bg-teal-600 disabled:bg-teal-500/50 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div> */}


          <div className="bg-neutral-800 rounded-lg p-6 border border-red-500/50">
            <h3 className="text-xl font-semibold text-red-400 mb-4">
              Danger Zone
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Delete Chatbot</h4>
                <p className="text-neutral-400 text-sm">
                  Permanently delete "{chatbotName}" and all associated data.
                  This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Delete Chatbot
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bc-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md border border-red-500/50">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-400">
                  Delete Chatbot
                </h3>
              </div>

              <p className="text-neutral-300 mb-4">
                Are you sure you want to delete "{chatbotName}"? This will
                permanently remove the chatbot and all associated data.
              </p>

              <p className="text-neutral-400 text-sm mb-4">
                Type{" "}
                <span className="font-mono bg-neutral-700 px-1 rounded">
                  delete
                </span>{" "}
                to confirm:
              </p>

              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type 'delete' to confirm"
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 mb-6"
              />

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                    setError(null);
                  }}
                  className="flex-1 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteChatbot}
                  disabled={
                    deleting || deleteConfirmText.toLowerCase() !== "delete"
                  }
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-600/50 transition-colors"
                >
                  {deleting ? "Deleting..." : "Delete Forever"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #14b8a6;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #14b8a6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </section>
  );
};

export default ChatbotSettings;
