import Link from "next/link";

async function getEvent(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`);
  return res.json();
}

export default async function EventDetails({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link href="/events" className="text-indigo-600 mb-4 inline-block">&larr; Back to Events</Link>
      <div className="relative h-80 w-full bg-gray-200 rounded-xl overflow-hidden mb-8">
        <img src={event.Image} alt={event.EventName} className="object-cover w-full h-full" />
      </div>
      <h1 className="text-4xl font-bold mb-2">{event.EventName}</h1>
      <div className="flex gap-4 text-sm font-semibold text-gray-500 mb-6">
        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">{event.Category}</span>
        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">${event.Price}</span>
      </div>
      <p className="text-gray-700 leading-relaxed text-lg">{event.Description}</p>
    </div>
  );
}