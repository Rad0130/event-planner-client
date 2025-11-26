"use client";
import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface EventFormData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  image: string;
}

export default function AddEvent() {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    price: "",
    date: "",
    priority: "Medium",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, price: Number(formData.price) }),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          title: "",
          shortDescription: "",
          fullDescription: "",
          price: "",
          date: "",
          priority: "Medium",
          image: "",
        });
        setTimeout(() => {
          setSuccess(false);
          router.push('/dashboard/manage-events');
        }, 2000);
      } else {
        const errorData = await res.json();
        alert(`Failed to add event: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      alert("An error occurred during submission. Is the backend API running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-indigo-600">Add New Event 🔐</h1>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert">
          <CheckCircle className="mr-3 h-5 w-5" />
          <span className="block sm:inline font-semibold">Event added successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label className="block font-medium mb-2" htmlFor="title">Event Title *</label>
          <input 
            required 
            type="text" 
            id="title" 
            name="title" 
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={formData.title} 
            onChange={handleChange}
            placeholder="Enter event title"
          />
        </div>
        
        <div>
          <label className="block font-medium mb-2" htmlFor="shortDescription">Short Description (1-2 lines) *</label>
          <input 
            required 
            type="text" 
            id="shortDescription" 
            name="shortDescription" 
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={formData.shortDescription} 
            onChange={handleChange}
            placeholder="Brief description of the event"
          />
        </div>
        
        <div>
          <label className="block font-medium mb-2" htmlFor="fullDescription">Full Description *</label>
          <textarea 
            required 
            id="fullDescription" 
            name="fullDescription" 
            className="w-full border border-gray-300 p-3 rounded-lg h-32 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={formData.fullDescription} 
            onChange={handleChange}
            placeholder="Detailed description of the event"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-2" htmlFor="price">Price ($) *</label>
            <input 
              required 
              type="number" 
              id="price" 
              name="price" 
              min="0"
              step="0.01"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={formData.price} 
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-2" htmlFor="date">Date *</label>
            <input 
              required 
              type="date" 
              id="date" 
              name="date" 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={formData.date} 
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block font-medium mb-2" htmlFor="priority">Priority *</label>
            <select 
              required 
              id="priority" 
              name="priority" 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={formData.priority} 
              onChange={handleChange}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block font-medium mb-2" htmlFor="image">Image URL</label>
          <input 
            type="url" 
            id="image" 
            name="image" 
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={formData.image} 
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-sm text-gray-500 mt-1">Provide a URL for the event image (optional)</p>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className={cn(
            "bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 w-full font-bold transition duration-300 flex items-center justify-center shadow-md",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? (
            <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Adding Event...</>
          ) : "Add Event"}
        </button>
      </form>
    </div>
  );
}