"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function AddEvent() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const [formData, setFormData] = useState({
    EventName: "",
    Category: "",
    Price: "",
    Description: "",
    Image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) alert("Event Added Successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Add New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Event Name</label>
          <input required type="text" className="w-full border p-3 rounded" 
            onChange={(e) => setFormData({...formData, EventName: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Category</label>
            <input required type="text" className="w-full border p-3 rounded"
              onChange={(e) => setFormData({...formData, Category: e.target.value})} />
          </div>
          <div>
            <label className="block font-medium mb-1">Price</label>
            <input required type="number" className="w-full border p-3 rounded"
              onChange={(e) => setFormData({...formData, Price: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Image URL</label>
          <input required type="url" className="w-full border p-3 rounded"
            onChange={(e) => setFormData({...formData, Image: e.target.value})} />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea required className="w-full border p-3 rounded h-32"
            onChange={(e) => setFormData({...formData, Description: e.target.value})}></textarea>
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 w-full font-bold">
          Submit Event
        </button>
      </form>
    </div>
  );
}