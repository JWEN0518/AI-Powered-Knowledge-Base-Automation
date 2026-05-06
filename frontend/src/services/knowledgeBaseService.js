import api from "./api";

function buildFormData(form, selectedFile) {
  const formData = new FormData();

  formData.append("title", form.title);
  formData.append("content", form.content || "");
  formData.append("category", form.category || "Auto Imported");
  formData.append("sourceFile", form.sourceFile || "");
  formData.append("tags", form.tags || "");

  if (selectedFile) {
    formData.append("file", selectedFile);
  }

  return formData;
}

export async function fetchKnowledgeBaseRecords(filters = {}) {
  const params = {};

  Object.keys(filters).forEach((key) => {
    if (filters[key]) params[key] = filters[key];
  });

  const response = await api.get("/knowledge-base", { params });
  return response.data;
}

export async function createKnowledgeBaseRecord(form, selectedFile) {
  const response = await api.post("/knowledge-base", buildFormData(form, selectedFile), {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
}

export async function updateKnowledgeBaseRecord(id, form, selectedFile) {
  const response = await api.put(`/knowledge-base/${id}`, buildFormData(form, selectedFile), {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
}

export async function updateKnowledgeBaseStatus(id, status, note) {
  const response = await api.patch(`/knowledge-base/${id}/status`, {
    status,
    note: note || `Status changed to ${status}`
  });

  return response.data;
}

export async function deleteKnowledgeBaseRecord(id) {
  const response = await api.delete(`/knowledge-base/${id}`);
  return response.data;
}
