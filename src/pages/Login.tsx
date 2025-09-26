import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // from auth context
  const { user, login, signUp } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // track whether we already redirected to prevent loops
  const redirectedRef = useRef(false);

  // only depend on user?.id (stable primitive) to avoid effect firing when "user" object reference changes
  useEffect(() => {
    // if no user or we've already redirected, do nothing
    if (!user?.id) return;

    // if already redirected once, don't navigate again
    if (redirectedRef.current) return;

    // if user is already on the root path, no need to navigate
    if (location.pathname === '/') {
      redirectedRef.current = true;
      return;
    }

    redirectedRef.current = true;
    navigate('/', { replace: true });
  }, [user?.id, navigate, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignUp) {
      const success = await signUp(email, password);
      if (success) {
        toast({
          title: 'Account created!',
          description: 'Successfully signed up. Please log in.',
        });
        setIsSignUp(false);
      } else {
        toast({
          title: 'Sign-up failed',
          description: 'Could not create account. Email may already exist or is invalid.',
          variant: 'destructive',
        });
      }
    } else {
      const success = await login(email, password);
      if (success) {
        toast({
          title: 'Welcome back!',
          description: 'Successfully logged in to FixItUp Admin',
        });
        // no explicit navigate here — handled by useEffect
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">FixItUp</h1>
          <p className="text-muted-foreground">Admin Panel</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{isSignUp ? 'Admin Sign Up' : 'Admin Login'}</CardTitle>
            <CardDescription>
              {isSignUp ? 'Create a new admin account' : 'Enter your credentials to access the admin panel'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@fixitup.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (isSignUp ? 'Signing up...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Login')}
              </Button>


              {!isSignUp && (
                <div className="text-center">
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </a>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
