import { JSX, useState } from "react";


const ResetPassword = ():JSX.Element =>{
    
        const [step, setStep] = useState<'enter-email' | 'email-sent' | 'reset-password'>('enter-email');

return (
  <div>
    {step === 'enter-email' && (
      <form onSubmit={handleSendEmail}>
        <input type="email" required />
        <button type="submit">Send Reset Link</button>
      </form>
    )}

    {step === 'email-sent' && (
      <p>✅ We've sent a reset link to your email. Check your inbox.</p>
    )}

    {step === 'reset-password' && (
      <form onSubmit={handleSetNewPassword}>
        <input type="password" required placeholder="New Password" />
        <input type="password" required placeholder="Confirm Password" />
        <button type="submit">Set New Password</button>
      </form>
    )}
  </div>
);

    
}