import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const session = {
        email,
        company,
        issuedAt: new Date().toISOString(),
      };
      localStorage.setItem('flowforge-session', JSON.stringify(session));
      navigate('/app', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-md w-full max-w-lg">
      <Input
        label="Company"
        name="company"
        placeholder="Automation Inc."
        value={company}
  onChange={(event: ChangeEvent<HTMLInputElement>) => setCompany(event.target.value)}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="founder@example.com"
        value={email}
  onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Create a secure password"
        value={password}
  onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
        required
      />
      <Button type="submit" variant="primary" className="mt-lg">
        {isSubmitting ? 'Creating workspace…' : 'Create account'}
      </Button>
    </form>
  );
};
