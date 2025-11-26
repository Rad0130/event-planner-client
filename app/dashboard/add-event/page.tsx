"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Assuming NEXT_PUBLIC_API_URL is available in the environment
const API_URL = process.env.NEXT_PUBLIC_API_URL; 

export default function AddEvent() {
  // TypeScript Fix: Renamed 'session' to '_session' to silence the unused variable warning
  const { data: _session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Redirects unauthenticated users to the login page
      redirect("/login");
    },
  });

  const [formData, setFormData] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    // Standard handler for controlled inputs
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
        const res = await fetch(`${API_URL}/events`, {
            method: "POST", // Correctly submits data to the backend API
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({...formData, price: Number(formData.price)}), // Ensure price is sent as a number
        });

        if (res.ok) {
            setSuccess(true);
            // Reset form fields upon successful submission
            setFormData({title: "", shortDescription: "", fullDescription: "", price: "", date: "", priority: "Medium", image: ""});
            // Auto-hide success message
            setTimeout(() => setSuccess(false), 5000); 
        } else {
            // Handle HTTP errors (e.g., 400 or 500 status codes)
            const errorData = await res.json();
            alert(`Failed to add event: ${errorData.message || res.statusText}`);
        }
    } catch (error) {
        // Handle network errors (e.g., API is offline)
        alert("An error occurred during submission. Is the backend API running?");
    } finally {
        setLoading(false);
    }
  };
  
  if (status === "loading") {
      return <div className="text-center py-20 text-indigo-600"><Loader2 className="animate-spin inline mr-2" /> Loading Authentication...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-indigo-600">Add New Event 🔐</h1>
      
      {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert">
              <CheckCircle className="mr-3 h-5 w-5" />
              <span className="block sm:inline font-semibold">Event added successfully!</span>
          </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label className="block font-medium mb-1" htmlFor="title">Event Title</label>
          <input required type="text" id="title" name="title" className="w-full border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
            value={formData.title} onChange={handleChange} />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="shortDescription">Short Description (1-2 lines)</label>
          <input required type="text" id="shortDescription" name="shortDescription" className="w-full border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.shortDescription} onChange={handleChange} />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="fullDescription">Full Description</label>
          <textarea required id="fullDescription" name="fullDescription" className="w-full border p-3 rounded-lg h-32 focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.fullDescription} onChange={handleChange}></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-1" htmlFor="price">Price ($)</label>
            {/* Value is stored as string but sent as Number in handleSubmit */}
            <input required type="number" id="price" name="price" className="w-full border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.price} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="date">Date</label>
            <input required type="date" id="date" name="date" className="w-full border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.date} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="priority">Priority</label>
            <select required id="priority" name="priority" className="w-full border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.priority} onChange={handleChange}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block font-medium mb-1" htmlFor="image">Image URL</label>
          <input type="url" id="image" name="image" className="w-full border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
        </div>
        
        <button type="submit" disabled={loading} className={cn("bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 w-full font-bold transition duration-300 flex items-center justify-center", loading && "opacity-70 cursor-not-allowed")}>
          {loading ? (
             <><Loader2 className="animate-spin mr-2" /> Submitting...</>
          ) : "Submit Event"}
        </button>
      </form>
    </div>
  );
}