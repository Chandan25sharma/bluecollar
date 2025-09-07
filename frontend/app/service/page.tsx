export default function ServicesPage() {
  const mockServices = [
    { id: "1", title: "Electrician", price: 50 },
    { id: "2", title: "Plumber", price: 40 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockServices.map((s) => (
          <div key={s.id} className="border p-4 rounded shadow">
            <h2 className="font-bold">{s.title}</h2>
            <p>${s.price}</p>
            <a href={`/service/${s.id}`} className="text-blue-500">View</a>
          </div>
        ))}
      </div>
    </div>
  );
}
