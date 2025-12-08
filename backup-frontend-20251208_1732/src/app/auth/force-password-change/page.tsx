"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, Shield, CheckCircle2 } from 'lucide-react';

function ForcePasswordChangeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  useEffect(() => {
    // Calculate password strength
    if (newPassword.length === 0) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (newPassword.length >= 8) strength += 25;
    if (newPassword.length >= 12) strength += 25;
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) strength += 25;
    if (/[0-9]/.test(newPassword)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(newPassword)) strength += 12.5;

    setPasswordStrength(Math.min(strength, 100));
  }, [newPassword]);

  const getStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500';
    if (passwordStrength < 50) return 'bg-orange-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Email is required');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordStrength < 50) {
      toast.error('Please choose a stronger password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/force-password-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          newPassword,
          token: searchParams.get('token')
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password changed successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/auth/signin?passwordChanged=true');
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-blue-200 shadow-2xl">
        <CardHeader className="text-center pb-4 border-b border-blue-100">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            🔐 Change Your Password
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            For security reasons, you must change your temporary password
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Display */}
            <div>
              <Label htmlFor="email" className="text-gray-700 font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="mt-1 bg-gray-50 border-gray-300"
              />
            </div>

            {/* New Password */}
            <div>
              <Label htmlFor="newPassword" className="text-gray-700 font-semibold">
                New Password *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={8}
                  className="pr-10 border-2 border-gray-300 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password Strength:</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength < 50 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              <div className="mt-3 space-y-1">
                <p className="text-xs text-gray-600 font-semibold">Password must contain:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3 h-3 ${newPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-xs text-gray-600">At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3 h-3 ${/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-xs text-gray-600">Uppercase and lowercase letters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3 h-3 ${/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-xs text-gray-600">At least one number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3 h-3 ${/[^a-zA-Z0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-xs text-gray-600">At least one special character</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">
                Confirm New Password *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="pr-10 border-2 border-gray-300 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
              )}
              {confirmPassword && newPassword === confirmPassword && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || passwordStrength < 50}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Changing Password...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Change Password
                </>
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>🔒 Security Notice:</strong> After changing your password, you will be redirected to the login page. 
              Please use your new password to sign in to your account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ForcePasswordChangePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ForcePasswordChangeContent />
    </Suspense>
  );
}
