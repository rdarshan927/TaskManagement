import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark-dark text-neutral-light py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Task Manager</h3>
            <p className="text-neutral-DEFAULT">
              A simple yet powerful task management application to boost your productivity.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-DEFAULT hover:text-primary-light transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-neutral-DEFAULT hover:text-primary-light transition">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Contact</h3>
            <a 
              href="mailto:darshanronline@gmail.com" 
              className="text-primary-light hover:text-primary-DEFAULT transition inline-block mt-2"
            >
              darshanronline@gmail.com
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-dark-light/20 mt-6 pt-6 text-center text-neutral-dark">
          <p>&copy; {currentYear} Task Manager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;