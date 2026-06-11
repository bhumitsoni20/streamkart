import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">PN</div>
              <span className="text-xl font-bold text-white">Prime<span className="text-blue-400">Net</span></span>
            </div>
            <p className="text-gray-500 text-sm max-w-md">
              Your trusted marketplace for digital subscriptions. Buy and sell premium services at the best prices.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Marketplace', 'About', 'Contact', 'Terms', 'Privacy'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase()}`} className="text-gray-500 hover:text-white text-sm transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Categories</h4>
            <ul className="space-y-2">
              {['OTT Platforms', 'AI Tools', 'VPN Services', 'Education', 'Software'].map((cat) => (
                <li key={cat}>
                  <span className="text-gray-500 text-sm">{cat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Prime Net. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
