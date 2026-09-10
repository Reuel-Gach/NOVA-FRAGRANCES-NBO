import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <SignIn 
        fallbackRedirectUrl="/admin"
        appearance={{
          elements: {
            formButtonPrimary: 'bg-black hover:bg-gray-800 text-sm normal-case',
          },
        }}
      />
    </div>
  );
}