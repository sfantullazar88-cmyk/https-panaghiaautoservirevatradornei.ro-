import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminTeam = () => {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    role: "",
    description: "",
    image_url: "",
    active: true,
  });

  const token = localStorage.getItem("admin_token");

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

  const saveMember = async () => {
    await fetch(`${API_URL}/api/admin/team`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      role: "",
      description: "",
      image_url: "",
      active: true,
    });

    loadTeam();
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Ștergi acest membru?")) return;

    await fetch(`${API_URL}/api/admin/team/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadTeam();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Echipa</h1>
      <p className="text-gray-600 mb-6">
        Adaugă membrii echipei care vor apărea pe site.
      </p>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Adaugă membru</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border rounded-lg p-3"
            placeholder="Nume"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border rounded-lg p-3"
            placeholder="Funcție"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />

          <input
            className="border rounded-lg p-3 md:col-span-2"
            placeholder="Link poză"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />

          <textarea
            className="border rounded-lg p-3 md:col-span-2"
            placeholder="Descriere"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <button
          onClick={saveMember}
          className="mt-4 bg-[#D4A847] text-white px-6 py-3 rounded-lg font-semibold"
        >
          Salvează membru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-xl shadow p-4">
            {member.image_url && (
              <img
                src={member.image_url}
                alt={member.name}
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
            )}

            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-[#D4A847]">{member.role}</p>
            <p className="text-gray-600 mt-2">{member.description}</p>

            <button
              onClick={() => deleteMember(member.id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Șterge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTeam;