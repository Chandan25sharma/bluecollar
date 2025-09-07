// components/Footer.tsx
import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand & Socials */}
        <div>
          <h3 className="text-xl font-bold text-green-600 mb-2">SkillServe</h3>
          <p className="text-sm text-gray-500 mb-4">
            Connect with trusted local professionals. Quick, reliable, and quality service.
          </p>
          <div className="flex space-x-3">
            <a href="#" className="text-gray-500 hover:text-green-600"><FiFacebook size={18} /></a>
            <a href="#" className="text-gray-500 hover:text-green-600"><FiInstagram size={18} /></a>
            <a href="#" className="text-gray-500 hover:text-green-600"><FiTwitter size={18} /></a>
            <a href="#" className="text-gray-500 hover:text-green-600"><FiYoutube size={18} /></a>
          </div>
        </div>

        {/* For Customers */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Customers</h4>
          <ul className="text-sm space-y-1">
            <li><Link href="/services" className="hover:text-green-600">Find Services</Link></li>
            <li><Link href="/how-it-works" className="hover:text-green-600">How It Works</Link></li>
            <li><Link href="/pricing" className="hover:text-green-600">Pricing</Link></li>
            <li><Link href="/faq" className="hover:text-green-600">FAQ</Link></li>
          </ul>
        </div>

        {/* For Providers */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Providers</h4>
          <ul className="text-sm space-y-1">
            <li><Link href="/provider-signup" className="hover:text-green-600">Become a Pro</Link></li>
            <li><Link href="/provider-resources" className="hover:text-green-600">Resources</Link></li>
            <li><Link href="/success-stories" className="hover:text-green-600">Success Stories</Link></li>
            <li><Link href="/provider-faq" className="hover:text-green-600">FAQ</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Company</h4>
          <ul className="text-sm space-y-1 mb-3">
            <li><Link href="/about-us" className="hover:text-green-600">About Us</Link></li>
            <li><Link href="/careers" className="hover:text-green-600">Careers</Link></li>
            <li><Link href="/contact" className="hover:text-green-600">Contact</Link></li>
            <li><Link href="/press" className="hover:text-green-600">Press</Link></li>
          </ul>
          {/* Newsletter */}
          <div>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button className="bg-green-600 text-white px-3 py-2 rounded-r text-sm hover:bg-green-700 transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} SkillServe. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <Link href="/privacy" className="hover:text-green-600">Privacy</Link>
          <Link href="/terms" className="hover:text-green-600">Terms</Link>
          <Link href="/cookies" className="hover:text-green-600">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
