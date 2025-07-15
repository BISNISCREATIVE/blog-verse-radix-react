import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, User, LogOut, Edit, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItems = () => (
    <>
      <Link to="/" className="text-blog-text-primary hover:text-blog-primary transition-colors">
        Home
      </Link>
      {isAuthenticated && (
        <Link to="/write" className="text-blog-text-primary hover:text-blog-primary transition-colors">
          Write
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-blog-surface/95 backdrop-blur supports-[backdrop-filter]:bg-blog-surface/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blog-primary rounded-lg flex items-center justify-center">
            <span className="text-blog-primary-foreground font-bold text-lg">B</span>
          </div>
          <span className="font-bold text-xl text-blog-text-primary hidden sm:block">
            BlogVerse
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blog-text-secondary w-4 h-4" />
            <Input
              type="search"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavItems />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-blog-text-secondary">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/write" className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Write Post
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Search Button - Mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/search')}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col space-y-4 mt-8">
                {isAuthenticated && (
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-blog-text-secondary">{user?.email}</p>
                    </div>
                  </div>
                )}
                
                <nav className="flex flex-col space-y-3">
                  <Link 
                    to="/" 
                    className="text-blog-text-primary hover:text-blog-primary transition-colors p-2"
                  >
                    Home
                  </Link>
                  
                  {isAuthenticated ? (
                    <>
                      <Link 
                        to="/write" 
                        className="text-blog-text-primary hover:text-blog-primary transition-colors p-2"
                      >
                        Write Post
                      </Link>
                      <Link 
                        to="/profile" 
                        className="text-blog-text-primary hover:text-blog-primary transition-colors p-2"
                      >
                        Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="text-blog-text-primary hover:text-blog-primary transition-colors p-2"
                      >
                        Settings
                      </Link>
                      <Button onClick={handleLogout} variant="outline" className="justify-start">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Button asChild variant="outline">
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button asChild>
                        <Link to="/register">Register</Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};