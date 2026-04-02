import { Search, Bell, HelpCircle, Menu, Languages } from 'lucide-react';
import { useLocaleStore } from '../store/useLocaleStore';
import { useSurveyStore } from '../store/useSurveyStore';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const { locale, setLocale, t } = useLocaleStore();
  const { searchQuery, setSearchQuery } = useSurveyStore();

  const toggleLocale = () => {
    setLocale(locale === 'pt' ? 'en' : 'pt');
  };

  return (
    <header className="fixed top-0 z-50 flex justify-between items-center px-6 md:px-8 h-16 w-full md:pl-72 bg-surface/80 backdrop-blur-md shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Hamburger Menu showing only on mobile */}
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-600 md:hidden hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold tracking-tighter text-blue-800 truncate max-w-[200px] md:max-w-none">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-6">
        <div className="hidden lg:flex items-center bg-surface-container px-4 py-2 rounded-full">
          <Search className="text-outline mr-2 w-5 h-5" />
          <input 
            className="bg-transparent border-none focus:ring-0 text-sm w-32 xl:w-48 text-on-surface" 
            placeholder={t('common.search')} 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-4">
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors hidden sm:flex">
            <Bell className="text-slate-600 w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors hidden sm:flex">
            <HelpCircle className="text-slate-600 w-5 h-5" />
          </button>

          {/* Language Switcher */}
          <button 
            onClick={toggleLocale}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-outline-variant/30 text-xs font-bold text-slate-600 hover:bg-surface-container transition-all"
          >
            <Languages className="w-4 h-4" />
            <span className="uppercase">{locale}</span>
          </button>
          
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border-2 border-primary/20">
            <img 
              alt="User avatar" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop" 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
