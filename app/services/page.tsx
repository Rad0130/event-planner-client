export default function Services() {
  const services = [
    {
      title: "Wedding Planning",
      description: "Complete wedding planning and coordination services",
      price: "$2,000+",
      features: ["Venue selection", "Vendor coordination", "Day-of coordination"]
    },
    {
      title: "Corporate Events",
      description: "Professional corporate event management",
      price: "$1,500+",
      features: ["Conference planning", "Team building", "Product launches"]
    },
    {
      title: "Birthday Parties",
      description: "Memorable birthday celebrations",
      price: "$800+",
      features: ["Theme planning", "Entertainment", "Catering coordination"]
    },
    {
      title: "Social Gatherings",
      description: "Intimate social events and parties",
      price: "$600+",
      features: ["Guest management", "Decor planning", "Event coordination"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Services</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We offer comprehensive event planning services to make your special occasions truly memorable. 
          From intimate gatherings to grand celebrations, we handle every detail.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <div className="mb-4">
              <span className="text-2xl font-bold text-indigo-600">{service.price}</span>
              <span className="text-gray-500 text-sm ml-2">starting from</span>
            </div>
            <ul className="space-y-2 mb-6">
              {service.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300">
              Book Service
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Custom Event Planning</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Have a unique event in mind? We specialize in custom event planning tailored to your specific needs and vision.
        </p>
        <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300">
          Get Custom Quote
        </button>
      </div>
    </div>
  );
}