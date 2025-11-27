"use client";
import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Mail, 
  User, 
  Clock, 
  CheckCircle,
  Reply,
  Trash2,
  Eye
} from "lucide-react";
import Swal from "sweetalert2";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('https://event-planner-server-zsc1.onrender.com');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load messages',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string, adminReply?: string) => {
    try {
      const response = await fetch(`https://event-planner-server-zsc1.onrender.com/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          adminReply 
        }),
      });

      if (response.ok) {
        await Swal.fire({
          title: 'Success!',
          text: `Message marked as ${newStatus}`,
          icon: 'success',
          confirmButtonColor: '#4f46e5'
        });
        
        fetchMessages(); // Refresh the list
        setSelectedMessage(null);
      } else {
        throw new Error('Failed to update message');
      }
    } catch (error) {
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to update message status',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://event-planner-server-zsc1.onrender.com/${messageId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await Swal.fire({
            title: 'Deleted!',
            text: 'Message has been deleted.',
            icon: 'success',
            confirmButtonColor: '#4f46e5'
          });
          
          fetchMessages(); // Refresh the list
          setSelectedMessage(null);
        }
      } catch (error) {
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to delete message',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    }
  };

  const handleReply = async (message: Message) => {
    const { value: adminReply } = await Swal.fire({
      title: `Reply to ${message.name}`,
      input: 'textarea',
      inputLabel: 'Your Reply',
      inputPlaceholder: 'Type your response here...',
      inputValue: message.adminReply || '',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280',
      inputValidator: (value) => {
        if (!value) {
          return 'Please write a reply!';
        }
      }
    });

    if (adminReply) {
      await updateMessageStatus(message._id, 'replied', adminReply);
    }
  };

  const markAsRead = async (messageId: string) => {
    await updateMessageStatus(messageId, 'read');
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <Clock size={16} />;
      case 'read': return <Eye size={16} />;
      case 'replied': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Messages Management</h1>
          <p className="text-gray-600 mt-2">Manage all customer inquiries and messages</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>

          <div className="text-sm text-gray-500 flex items-center">
            <Filter size={16} className="mr-2" />
            {filteredMessages.length} of {messages.length} messages
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message._id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all hover:shadow-md ${
                selectedMessage?._id === message._id ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => {
                setSelectedMessage(message);
                if (message.status === 'unread') {
                  markAsRead(message._id);
                }
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{message.name}</h3>
                    <p className="text-sm text-gray-600">{message.email}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                  {getStatusIcon(message.status)}
                  <span className="ml-1 capitalize">{message.status}</span>
                </span>
              </div>

              <h4 className="font-medium text-gray-900 mb-2">{message.subject}</h4>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {message.message}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReply(message);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    title="Reply"
                  >
                    <Reply size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMessage(message._id);
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No messages found</h3>
              <p className="mt-2 text-gray-500">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search criteria" 
                  : "No messages have been received yet"}
              </p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
          {selectedMessage ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Message Details</h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">From</label>
                  <p className="text-gray-900">{selectedMessage.name}</p>
                  <p className="text-gray-600 text-sm">{selectedMessage.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <p className="text-gray-900">{selectedMessage.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {selectedMessage.adminReply && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Your Reply</label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">{selectedMessage.adminReply}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Received: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(selectedMessage.status)}`}>
                    {getStatusIcon(selectedMessage.status)}
                    <span className="ml-1 capitalize">{selectedMessage.status}</span>
                  </span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleReply(selectedMessage)}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Reply size={16} className="inline mr-2" />
                  {selectedMessage.adminReply ? 'Update Reply' : 'Reply'}
                </button>
                <button
                  onClick={() => deleteMessage(selectedMessage._id)}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Select a message</h3>
              <p className="mt-2 text-gray-500">Click on a message to view details and reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}