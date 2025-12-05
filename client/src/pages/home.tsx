import { useState } from "react";
import { useAuth, type RegisterData } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [loginData, setLoginData] = useState({ emailOrPhone: "", password: "" });
  const [registerData, setRegisterData] = useState<RegisterData & { dateOfBirth: string; gender: string }>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginData.emailOrPhone, loginData.password);
      toast({ title: "Welcome back!", description: "Successfully logged in." });
    } catch (error) {
      toast({ 
        title: "Login failed", 
        description: error instanceof Error ? error.message : "Please check your credentials.",
        variant: "destructive"
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        username: registerData.email.split("@")[0],
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phoneNumber: registerData.phoneNumber || undefined,
      });
      toast({ title: "Welcome to PostBook!", description: "Your account has been created." });
    } catch (error) {
      toast({ 
        title: "Registration failed", 
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-heading font-bold text-gradient mb-3 tracking-tight" data-testid="logo-title">PostBook</h1>
          <p className="text-muted-foreground text-lg">Connect, Share, Watch.</p>
        </div>

        <Card className="border shadow-lg bg-white">
          <CardContent className="pt-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
                <TabsTrigger value="register" data-testid="tab-register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email or Phone</Label>
                    <Input 
                      id="email" 
                      type="text" 
                      placeholder="Enter your email or phone" 
                      required 
                      data-testid="input-login-email"
                      value={loginData.emailOrPhone}
                      onChange={(e) => setLoginData(prev => ({ ...prev, emailOrPhone: e.target.value }))}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password" 
                      required 
                      data-testid="input-login-password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex justify-end">
                    <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full text-white font-semibold text-lg h-12 btn-glow"
                    disabled={isLoading}
                    data-testid="button-login"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Log In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        placeholder="John" 
                        required 
                        data-testid="input-register-firstname"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        required 
                        data-testid="input-register-lastname"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">Phone Number</Label>
                    <Input 
                      id="reg-phone" 
                      type="tel" 
                      placeholder="+1 (555) 000-0000" 
                      data-testid="input-register-phone"
                      value={registerData.phoneNumber}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email Address</Label>
                    <Input 
                      id="reg-email" 
                      type="email" 
                      placeholder="john.doe@example.com" 
                      required 
                      data-testid="input-register-email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input 
                        type="date" 
                        className="block" 
                        data-testid="input-register-dob"
                        value={registerData.dateOfBirth}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select 
                        value={registerData.gender} 
                        onValueChange={(value) => setRegisterData(prev => ({ ...prev, gender: value }))}
                        disabled={isLoading}
                      >
                        <SelectTrigger data-testid="select-register-gender">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input 
                      id="reg-password" 
                      type="password" 
                      placeholder="Create a password" 
                      required 
                      data-testid="input-register-password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      disabled={isLoading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full text-white font-semibold text-lg h-12 btn-glow mt-2"
                    disabled={isLoading}
                    data-testid="button-register"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/50 pt-6 pb-6">
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to PostBook's <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
