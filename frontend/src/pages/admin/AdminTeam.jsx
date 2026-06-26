import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const emptyForm = {
  name: "",
  role: "",
  description: "",
  image_url: "",
  order: 1,
  active: true,
};

const AdminTeam = () => {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const token =
  localStorage.getItem("access_token") ||
  localStorage.getItem("admin_token") ||
  localStorage.getItem("token");

  const loadTeam = async () => {
    const res = await fetch(`${API_URL}/api/admin/team`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMembers(data.members || []);
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const uploadImage = async (file) => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/api/admin/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        setForm((prev) => ({ ...prev, image_url: data.url }));
      } else {
        alert("Eroare la încărcarea pozei.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Nu s-a putut încărca poza.");
    }

    setUploading(false);
  };

  const saveMember = async () => {
    if (!form.name || !form.role) {
      alert("Completează numele și funcția.");
      return;
    }

    const url = editingId
      ? `${API_URL}/api/admin/team/${editingId}`
      : `${API_URL}/api/admin/team`;

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        order: Number(form.order || 1),
      }),
    });

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    loadTeam();
  };

  const editMember = (member) => {
    setForm({
      name: member.name || "",
      role: member.role || "",
      description: member.description || "",
      image_url: member.image_url || "",
      order: member.order || 1,
      active: member.active !== false,
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Sigur ștergi acest membru?")) return;

    await fetch(`${API_URL}/api/admin/team/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadTeam();
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm text-gray-500 mb-2">Dashboard › Echipa</div>
          <h1 className="text-3xl font-bold text-gray-900">Echipa</h1>
          <p className="text-gray-600 mt-1">
            Gestionează membrii echipei care apar pe site.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D4A847] px-5 py-3 font-semibold text-white shadow hover:bg-[#bd9338]"
        >
          <Plus className="w-5 h-5" />
          Adaugă membru
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow border border-gray-100">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? "Editează membru" : "Adaugă membru"}
            </h2>

            <button
              onClick={cancelForm}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              className="rounded-lg border border-gray-300 p-3"
              placeholder="Nume"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="rounded-lg border border-gray-300 p-3"
              placeholder="Funcție"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />

            <input
              className="rounded-lg border border-gray-300 p-3"
              placeholder="Ordine afișare"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
            />

            <select
              className="rounded-lg border border-gray-300 p-3"
              value={form.active ? "true" : "false"}
              onChange={(e) =>
                setForm({ ...form, active: e.target.value === "true" })
              }
            >
              <option value="true">Activ</option>
              <option value="false">Inactiv</option>
            </select>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Încarcă poză
              </label>

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-5 text-gray-600 hover:border-[#D4A847] hover:text-[#D4A847]">
                <Upload className="w-5 h-5" />
                {uploading ? "Se încarcă poza..." : "Alege poză din calculator"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => uploadImage(e.target.files[0])}
                />
              </label>

              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="mt-4 h-40 w-40 rounded-xl object-cover shadow"
                />
              )}
            </div>

            <input
              className="rounded-lg border border-gray-300 p-3 md:col-span-2"
              placeholder="Link poză"
              value={form.image_url}
              onChange={(e) =>
                setForm({ ...form, image_url: e.target.value })
              }
            />

            <textarea
              className="rounded-lg border border-gray-300 p-3 md:col-span-2"
              placeholder="Descriere"
              rows="3"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={saveMember}
              className="rounded-lg bg-[#D4A847] px-6 py-3 font-semibold text-white hover:bg-[#bd9338]"
            >
              {editingId ? "Salvează modificările" : "Salvează membru"}
            </button>

            <button
              onClick={cancelForm}
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Anulează
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow border border-gray-100">
        <div className="grid grid-cols-12 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700">
          <div className="col-span-2">Poză</div>
          <div className="col-span-3">Nume</div>
          <div className="col-span-3">Funcție</div>
          <div className="col-span-1">Ordine</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Acțiuni</div>
        </div>

        {members.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nu ai adăugat încă membri în echipă.
          </div>
        )}

        {members
          .slice()
          .sort((a, b) => (a.order || 1) - (b.order || 1))
          .map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-12 items-center border-t border-gray-100 px-6 py-4"
            >
              <div className="col-span-2">
                {member.image_url ? (
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                    Fără poză
                  </div>
                )}
              </div>

              <div className="col-span-3">
                <p className="font-semibold text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {member.description}
                </p>
              </div>

              <div className="col-span-3 text-gray-700">{member.role}</div>

              <div className="col-span-1 text-gray-700">
                {member.order || 1}
              </div>

              <div className="col-span-1">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    member.active === false
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {member.active === false ? "Inactiv" : "Activ"}
                </span>
              </div>

              <div className="col-span-2 flex justify-end gap-3">
                <button
                  onClick={() => editMember(member)}
                  className="rounded-lg bg-[#D4A847] p-3 text-white hover:bg-[#bd9338]"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteMember(member.id)}
                  className="rounded-lg bg-red-500 p-3 text-white hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminTeam;