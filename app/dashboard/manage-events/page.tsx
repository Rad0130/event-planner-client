"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

type EventType = {
  _id: string;
  EventName: string;
  Category: string;
  Price: number;
};

export default function ManageEvents() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e._id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Manage Events</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Event Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{event.EventName}</td>
                <td className="p-4 text-gray-500">{event.Category}</td>
                <td className="p-4">${event.Price}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
