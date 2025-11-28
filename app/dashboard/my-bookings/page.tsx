"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Calendar, 
  Mail, 
  Phone, 
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Package
} from "lucide-react";
import Swal from "sweetalert2";

interface Booking {
  _id: string;
  eventId?: string;
  eventTitle: string;
  eventType?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  eventDate: string;
  guestCount: string;
  specialRequirements: string;
  budget: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  adminNotes?: string;
  isServiceBooking?: boolean;
  serviceDescription?: string;
  servicePrice?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyBookings() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetchBookings();
    }
  }, [session]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`https://event-planner-server-zsc1.onrender.com//bookings/user/${session?.user?.email}`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load your bookings',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    const result = await Swal.fire({
      title: 'Cancel Booking?',
      text: "Are you sure you want to cancel this booking?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://event-planner-server-zsc1.onrender.com//bookings/${bookingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            status: 'cancelled',
            adminNotes: 'Cancelled by user'
          }),
        });

        if (response.ok) {
          await Swal.fire({
            title: 'Cancelled!',
            text: 'Your booking has been cancelled.',
            icon: 'success',
            confirmButtonColor: '#4f46e5'
          });
          
          fetchBookings(); // Refresh the list
        }
      } catch (error) {
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to cancel booking',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'confirmed': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getBookingTypeIcon = (booking: Booking) => {
    if (booking.isServiceBooking) {
      return <Package size={16} className="text-purple-600" />;
    }
    return <Calendar size={16} className="text-indigo-600" />;
  };

  const getBookingTypeText = (booking: Booking) => {
    if (booking.isServiceBooking) {
      return "Service Booking";
    }
    return "Event Booking";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">View and manage your event and service bookings</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No bookings yet</h3>
          <p className="mt-2 text-gray-500">You haven&apos;t made any bookings yet.</p>
          <div className="mt-4 space-x-4">
            <button
              onClick={() => window.location.href = '/events'}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Browse Events
            </button>
            <button
              onClick={() => window.location.href = '/services'}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Browse Services
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getBookingTypeIcon(booking)}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{booking.eventTitle}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{getBookingTypeText(booking)}</span>
                      {booking.eventType && (
                        <span className="text-sm text-gray-500">• {booking.eventType}</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  <span className="ml-1 capitalize">{booking.status}</span>
                </span>
              </div>

              {booking.isServiceBooking && booking.serviceDescription && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-purple-700 text-sm">{booking.serviceDescription}</p>
                  {booking.servicePrice && (
                    <p className="text-purple-600 font-semibold mt-1">{booking.servicePrice}</p>
                  )}
                </div>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>Event Date: {new Date(booking.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users size={16} className="mr-2" />
                    <span>Guests: {booking.guestCount}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign size={16} className="mr-2" />
                    <span>Budget: {booking.budget}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>Booked: {new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={16} className="mr-2" />
                    <span>{booking.userEmail}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={16} className="mr-2" />
                    <span>{booking.userPhone}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {booking.specialRequirements && (
                    <div className="text-sm text-gray-600">
                      <strong>Requirements:</strong> {booking.specialRequirements}
                    </div>
                  )}
                  {booking.adminNotes && (
                    <div className="text-sm text-gray-600">
                      <strong>Admin Notes:</strong> {booking.adminNotes}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(booking.updatedAt).toLocaleString()}
                </div>
                
                {booking.status === 'pending' && (
                  <button
                    onClick={() => cancelBooking(booking._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}

                {booking.status === 'confirmed' && (
                  <div className="text-sm text-green-600 font-medium">
                    Your booking is confirmed! We&apos;ll contact you soon.
                  </div>
                )}

                {booking.status === 'cancelled' && (
                  <div className="text-sm text-red-600 font-medium">
                    This booking has been cancelled.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}