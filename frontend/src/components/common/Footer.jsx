import { Link } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const columns = [
    { title: 'Streamkart', links: [{ label: 'Home', to: '/' }, { label: 'Solutions', to: '/products' }, { label: 'AI Marketplace', to: '/products' }] },
    { title: 'Marketplace', links: [{ label: 'Marketplace', to: '/products' }, { label: 'Features', to: '/about' }, { label: 'Enterprise', to: '/about' }, { label: 'Pricing', to: '/products' }] },
    { title: 'Company', links: [{ label: 'Upcoming', to: '/about' }, { label: 'Company', to: '/about' }, { label: 'Pricing', to: '/products' }] },
    { title: 'Resources', links: [{ label: 'About', to: '/about' }, { label: 'Resources', to: '/about' }, { label: 'FAQs', to: '/contact' }] },
    { title: 'Legal', links: [{ label: 'Legal', to: '/terms' }, { label: 'Contact', to: '/contact' }, { label: 'Events', to: '/about' }, { label: 'Privacy Policy', to: '/privacy' }, { label: 'Terms of Service', to: '/terms' }] },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-gray-900 font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-gray-500 hover:text-indigo-600 text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
              <FaInstagram className="w-5 h-5" />
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Streamkart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
