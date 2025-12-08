export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-travelok-blue mb-4">Cookie Policy</h1>
      <p className="text-travelok-gray mb-6">
        We use cookies to enhance your experience, analyze site performance, and assist with marketing efforts. You can manage your cookie preferences in your browser settings.
      </p>
      <h2 className="text-xl font-semibold text-travelok-blue mb-2">Types of Cookies</h2>
      <ul className="list-disc pl-6 text-travelok-gray space-y-2">
        <li>Essential cookies for core site functionality.</li>
        <li>Analytics cookies to understand usage and improve the site.</li>
        <li>Preference cookies to remember your settings.</li>
      </ul>
    </div>
  );
}
